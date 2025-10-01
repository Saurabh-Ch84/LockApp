# Lock - Website Blocker

## Installation Guide

### Prerequisites

**IMPORTANT:** Lock requires Python 3.8 or higher to be installed on your system.

#### Windows
1. Download Python from [python.org](https://www.python.org/downloads/)
2. During installation, **CHECK "Add Python to PATH"** ✓
3. Verify installation:
   ```cmd
   python --version
   ```
   Should show: `Python 3.x.x`

#### macOS
```bash
brew install python3
# Or download from python.org
python3 --version
```

#### Linux
```bash
sudo apt-get update
sudo apt-get install python3 python3-pip
python3 --version
```

---

## Installing Lock

### Windows

1. **Right-click** on `Lock Setup 1.0.0.exe`
2. Select **"Run as administrator"** (Required!)
3. Follow the installation wizard
4. Launch Lock from Start Menu or Desktop

### First Launch (Important!)

**On first launch, Lock will automatically:**
- Install required Python packages (Flask, flask_cors)
- Show a loading screen saying "Installing dependencies..."
- This takes 30-60 seconds
- **This only happens ONCE!**

After that, Lock will start normally every time.

---

## Running Lock

### Windows
- Always run as **Administrator** (required to modify hosts file)
- Find Lock in Start Menu or Desktop shortcut
- Right-click → Run as administrator

### macOS
```bash
sudo open /Applications/Lock.app
```

### Linux
```bash
sudo /opt/lock/lock
```

---

## How It Works

1. **Create Account:** First time setup - create your master admin account
2. **Add Websites:** Type website URLs to block (e.g., facebook.com)
3. **Block List:** View and manage all blocked websites
4. **Automatic:** Changes take effect immediately!

---

## Troubleshooting

### "Python not found" Error
- Make sure Python is installed
- Windows: Check "Add Python to PATH" during installation
- Verify: `python --version` in Command Prompt

### "Permission Denied" Error
- Run Lock as Administrator (Windows)
- Use `sudo` on macOS/Linux

### Dependencies Won't Install
- Check internet connection
- Manually install: `pip install flask flask_cors`
- Try running: `python -m pip install flask flask_cors`

### Websites Not Blocking
- Flush DNS cache:
  - **Windows:** `ipconfig /flushdns`
  - **macOS:** `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`
  - **Linux:** `sudo systemd-resolve --flush-caches`
- Close and reopen your browser

### Port 5000 Already in Use
- Close any applications using port 5000
- Restart Lock

---

## Technical Details

- **Frontend:** Electron + React
- **Backend:** Flask (Python)
- **Method:** Modifies system hosts file
- **Port:** 5000 (Flask server)

---

## Uninstalling

### Windows
- Control Panel → Programs → Uninstall Lock
- Or: Settings → Apps → Lock → Uninstall

### macOS
- Drag Lock.app to Trash
- Empty Trash

### Linux
- `sudo apt remove lock` (if installed via .deb)
- Or delete from /opt/lock

---

## Need Help?

If you encounter any issues:
1. Check if Python is installed: `python --version`
2. Try manual dependency install: `pip install flask flask_cors`
3. Run as Administrator/sudo
4. Check the console for error messages

---

**Created by Saurabh**  
Version 1.0.0