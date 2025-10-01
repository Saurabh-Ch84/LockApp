# backend/blocker.py
import platform

# Get the correct hosts file path for the current operating system
HOSTS_PATH = r"C:\Windows\System32\drivers\etc\hosts" if platform.system() == "Windows" else "/etc/hosts"
REDIRECT_IP = "127.0.0.1"
START_MARKER = "# START WEBSITES BLOCKED BY APP\n"
END_MARKER = "# END WEBSITES BLOCKED BY APP\n"

def apply_block(website_list):
    """
    Writes the given list of websites to the hosts file to block them.
    This new version cleanly removes the old block before writing the new one.
    """
    try:
        with open(HOSTS_PATH, 'r+') as file:
            content = file.readlines()
            
            # --- SIMPLIFIED CLEANUP LOGIC ---
            # Create new content that excludes any lines between our app's markers.
            new_content = []
            in_our_block_section = False
            for line in content:
                if line.strip() == START_MARKER.strip():
                    in_our_block_section = True
                    continue # Skip this line
                if line.strip() == END_MARKER.strip():
                    in_our_block_section = False
                    continue # Skip this line
                if not in_our_block_section:
                    new_content.append(line)

            # Go back to the start of the file to overwrite it with cleaned content
            file.seek(0)
            file.writelines(new_content)

            # Now, write the new blocking rules if the list is not empty
            if website_list:
                file.write("\n")
                file.write(START_MARKER)
                for website in website_list:
                    file.write(f"{REDIRECT_IP} {website}\n")
                file.write(END_MARKER)
            
            # Remove any trailing old content
            file.truncate()
        
        return {"message": "Block list applied successfully."}
    except PermissionError:
        return {"error": "Permission denied. Please run the server as an administrator or with sudo."}
    except Exception as e:
        return {"error": str(e)}

def unblock_all():
    """Removes all blocking rules created by this app from the hosts file."""
    try:
        with open(HOSTS_PATH, 'r+') as file:
            content = file.readlines()
            
            new_content = []
            in_our_block_section = False
            for line in content:
                if line.strip() == START_MARKER.strip():
                    in_our_block_section = True
                    continue
                if line.strip() == END_MARKER.strip():
                    in_our_block_section = False
                    continue
                if not in_our_block_section:
                    new_content.append(line)

            file.seek(0)
            file.writelines(new_content)
            file.truncate()
        
        return {"message": "All sites unblocked successfully."}
    except PermissionError:
        return {"error": "Permission denied. Please run the server as an administrator or with sudo."}
    except Exception as e:
        return {"error": str(e)}