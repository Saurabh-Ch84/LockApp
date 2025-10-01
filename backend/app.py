# backend/app.py
import json,os
import platform  # 1. Import the platform module
import subprocess  # 2. Import the subprocess module
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, jsonify, request
from flask_cors import CORS
import blocker

app = Flask(__name__)
CORS(app)

# The name of our persistent storage file
USER_FILE = 'user.json'
BLOCKLIST_FILE = 'blocklist.json'

def load_user_data():
    if os.path.exists(USER_FILE):
        with open(USER_FILE, 'r') as f:
            return json.load(f)
    return None # No user exists

def save_user_data(username, password):
    hashed_password = generate_password_hash(password)
    with open(USER_FILE, 'w') as f:
        json.dump({"username": username, "password_hash": hashed_password}, f)


def load_blocklist():
    """Reads the block list from the JSON file."""
    try:
        with open(BLOCKLIST_FILE, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        # If the file doesn't exist or is empty, start with a default list
        return ["www.facebook.com", "www.instagram.com"]

def save_blocklist(data):
    """Saves the block list to the JSON file."""
    with open(BLOCKLIST_FILE, 'w') as f:
        json.dump(data, f, indent=4)


@app.route('/api/login', methods=['POST'])
def login():
    user_data = load_user_data()
    
    req_data = request.get_json()
    username = req_data.get('username')
    password = req_data.get('password')

    if not username or not password:
        return jsonify({"success": False, "error": "Username and password required"}), 400

    # --- SCENARIO 1: FIRST TIME RUN ---
    if user_data is None:
        print("No user found. Creating new admin user...")
        save_user_data(username, password)
        return jsonify({"success": True, "message": "Admin account created successfully!"}), 201

    # --- SCENARIO 2: NORMAL LOGIN ---
    else:
        is_password_correct = check_password_hash(user_data['password_hash'], password)
        if user_data['username'] == username and is_password_correct:
            return jsonify({"success": True}), 200
        else:
            return jsonify({"success": False, "error": "Invalid username or password"}), 401

@app.route('/api/blocklist', methods=['GET', 'POST'])
def handle_blocklist():
    block_list = load_blocklist()
    if request.method == 'POST':
        data = request.get_json()
        new_site_raw = data.get('website')
        if not new_site_raw:
            return jsonify({"error": "The 'website' field is required"}), 400
        
        # --- NEW LOGIC: Handle both www and non-www versions ---
        # Normalize by removing 'www.' if it exists
        if new_site_raw.startswith('www.'):
            base_site = new_site_raw[4:]
        else:
            base_site = new_site_raw
        
        site_with_www = f"www.{base_site}"
        
        # Add both versions if they aren't already in the list
        added = False
        if base_site not in block_list:
            block_list.append(base_site)
            added = True
        if site_with_www not in block_list:
            block_list.append(site_with_www)
            added = True

        if added:
            save_blocklist(block_list)
            blocker.apply_block(block_list)
            return jsonify({"message": f"'{base_site}' added and blocked."}), 201
        else:
            return jsonify({"message": f"'{base_site}' already on the list."}), 200
    else: # GET
        return jsonify(block_list)

@app.route('/api/blocklist/delete', methods=['POST'])
def delete_from_blocklist():
    block_list = load_blocklist()
    data = request.get_json()
    site_to_remove_raw = data.get('website')
    if not site_to_remove_raw:
        return jsonify({"error": "Website is required"}), 400

    # --- NEW LOGIC: Remove both versions ---
    if site_to_remove_raw.startswith('www.'):
        base_site = site_to_remove_raw[4:]
    else:
        base_site = site_to_remove_raw
        
    site_with_www = f"www.{base_site}"

    # Filter out both versions from the list
    original_count = len(block_list)
    block_list = [site for site in block_list if site != base_site and site != site_with_www]
    
    if len(block_list) < original_count:
        save_blocklist(block_list)
        blocker.apply_block(block_list)
        return jsonify({"message": f"'{base_site}' removed successfully"}), 200
    else:
        return jsonify({"message": f"'{base_site}' not found in the list"}), 404


@app.route('/api/unblock', methods=['POST'])
def unblock_changes():
    save_blocklist([]) # Clear the list in the file
    result = blocker.unblock_all()
    if "error" in result:
        return jsonify(result), 500
    return jsonify(result), 200

@app.route('/api/status', methods=['GET'])
def status():
    user_data = load_user_data()
    return jsonify({"is_setup": user_data is not None})

# 3. Add this new function to flush the DNS
def flush_dns():
    """Checks the operating system and runs the appropriate DNS flush command."""
    os_name = platform.system()
    command = ""

    if os_name == "Windows":
        command = "ipconfig /flushdns"
        print("Attempting to flush DNS cache for Windows...")
    elif os_name == "Darwin":  # macOS
        command = "sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder"
        print("Attempting to flush DNS cache for macOS...")
    else:
        print(f"DNS flush not configured for this OS ({os_name}).")
        return

    try:
        # We run the command and capture the output
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print("DNS cache flushed successfully.")
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error flushing DNS: {e.stderr}")
        print("--> IMPORTANT: Please ensure the server is run as an administrator or with sudo.")
    except Exception as e:
        print(f"An unexpected error occurred while flushing DNS: {e}")

if __name__ == "__main__":
    flush_dns()
    app.run(port=5000, debug=True, use_reloader=False)