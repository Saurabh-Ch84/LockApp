const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// 1. Determine OS hosts file path
const HOSTS_PATH = process.platform === 'win32'
    ? 'C:\\Windows\\System32\\drivers\\etc\\hosts'
    : '/etc/hosts';

function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 700,
        minHeight: 400,
        minWidth: 600,
        autoHideMenuBar: true,
        webPreferences: {
            // Load the bridge we just created
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: false, // Security: Keep true backend logic isolated
            contextIsolation: true  // Security: Protect global scope
        }
    });
    win.setMenuBarVisibility(false);
    // 2. Load the App
    // In Dev: Wait for Vite server. In Prod: Load built files.
    const isDev = !app.isPackaged; 
    if (isDev) {
        // We use the variable from the 'concurrently' script or default to 5173
        win.loadURL('http://localhost:5173');
        // win.webContents.openDevTools(); // Optional: Open DevTools automatically
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

// --- HELPER FUNCTION: FLUSH DNS ---
const flushDNS = () => {
    // Windows command to flush DNS
    const command = process.platform === 'win32' ? 'ipconfig /flushdns' : 'killall -HUP mDNSResponder';
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`DNS Flush Error: ${error.message}`);
            return;
        }
        console.log('DNS Cache Flushed Successfully');
    });
};

app.whenReady().then(() => {
    createWindow();

    // --- IPC HANDLERS (The "Backend API") ---
    const USER_CONFIG_PATH = path.join(app.getPath('userData'), 'user-config.json');
    const crypto = require('crypto'); // Built-in Node module for hashing

    // Helper: Hash password
    const hashPassword = (password) => {
        return crypto.createHash('sha256').update(password).digest('hex');
    };

    // Handler: SHOW NATIVE DIALOG
    ipcMain.handle('show-dialog', async (event, { title, message, detail }) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        return dialog.showMessageBox(win, {
            type: 'info',
            buttons: ['OK'],
            title: title,
            message: message,
            detail: detail
        });
    });

    // Handler: CHECK IF SETUP IS COMPLETE
    ipcMain.handle('check-auth-status', async () => {
        return fs.existsSync(USER_CONFIG_PATH);
    });

    ipcMain.handle('get-config-path', () => {
        return USER_CONFIG_PATH;
    });

    // Handler: CREATE ACCOUNT (First time)
    ipcMain.handle('create-account', async (event, { username, password }) => {
        try {
            const data = {
                username,
                passwordHash: hashPassword(password)
            };
            fs.writeFileSync(USER_CONFIG_PATH, JSON.stringify(data));
            return { success: true, username };
        } catch (error) {
            return { success: false, error: "Failed to create account file." };
        }
    });

    // Handler: LOGIN (Verify credentials)
    ipcMain.handle('verify-user', async (event, { username, password }) => {
        try {
            if (!fs.existsSync(USER_CONFIG_PATH)) {
                return { success: false, error: "No account found. Please restart app." };
            }

            const fileData = fs.readFileSync(USER_CONFIG_PATH, 'utf-8');
            const storedUser = JSON.parse(fileData);

            // Check Username
            if (storedUser.username !== username) {
                return { success: false, error: "Invalid Username" };
            }

            // Check Password Hash
            const inputHash = hashPassword(password);
            if (storedUser.passwordHash !== inputHash) {
                return { success: false, error: "Invalid Password" };
            }

            return { success: true, username: storedUser.username };

        } catch (error) {
            return { success: false, error: "Login failed. Corrupt config file?" };
        }
    });
    
    // Handler 1: GET BLOCKLIST
    ipcMain.handle('get-blocklist', async () => {
        try {
            // Read file
            const content = fs.readFileSync(HOSTS_PATH, 'utf-8');
            const lines = content.split('\n');
            
            // Filter: Look for lines starting with "127.0.0.1" that aren't localhost
            const blockedSites = lines
                .filter(line => line.trim().startsWith('127.0.0.1') && !line.includes('localhost'))
                .map(line => {
                    // Line looks like: "127.0.0.1 facebook.com"
                    const parts = line.split(/\s+/); // Split by any whitespace
                    return parts.length > 1 ? parts[1] : null;
                })
                .filter(Boolean); // Remove nulls
            
            // Return unique list (Set removes duplicates)
            return { success: true, data: [...new Set(blockedSites)] };
        } catch (error) {
            console.error("Error reading hosts file:", error);
            // If file missing or permission denied, return empty list or error
            return { success: false, error: error.message };
        }
    });

    // Handler 2: BLOCK WEBSITE
    ipcMain.handle('block-website', async (event, url) => {
        if (!url) return { success: false, error: "Invalid URL" };
        
        // Clean the URL (remove http/https/www if typed manually, though frontend usually handles display)
        // Ideally, we store "facebook.com" and block both "facebook.com" and "www.facebook.com"
        const cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '');
        
        const entry1 = `\n127.0.0.1 ${cleanUrl}`;
        const entry2 = `\n127.0.0.1 www.${cleanUrl}`;

        try {
            // Check write permissions first
            fs.accessSync(HOSTS_PATH, fs.constants.W_OK);
            
            // Append both variations
            fs.appendFileSync(HOSTS_PATH, entry1);
            fs.appendFileSync(HOSTS_PATH, entry2);
            
            flushDNS();
            return { success: true };
        } catch (error) {
            if (error.code === 'EACCES' || error.code === 'EPERM') {
                return { success: false, error: "Permission Denied. Please Run as Administrator." };
            }
            return { success: false, error: error.message };
        }
    });

    // Handler 3: UNBLOCK WEBSITE
    ipcMain.handle('unblock-website', async (event, url) => {
        try {
            const cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '');
            
            const content = fs.readFileSync(HOSTS_PATH, 'utf-8');
            const lines = content.split('\n');
            
            // Filter out any line that contains the domain
            const newLines = lines.filter(line => !line.includes(cleanUrl));
            
            fs.writeFileSync(HOSTS_PATH, newLines.join('\n'));
            
            flushDNS();

            return { success: true };
        } catch (error) {
            return { success: false, error: "Permission Denied. Please Run as Administrator." };
        }
    });
});

// Quit when all windows are closed (except on Mac)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});