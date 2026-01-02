// frontend/public/electron.cjs

const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let flaskProcess = null;
let mainWindow = null;

function createFlaskProcess() {
  let pythonExecutable, scriptPath;
  
  // app.isPackaged is the most reliable way to check for production
  if (!app.isPackaged) {
    // Development
    scriptPath = path.join(__dirname, '../../backend/app.py');
    pythonExecutable = process.platform === 'win32' 
      ? path.join(__dirname, '../../backend/venv/Scripts/python.exe')
      : path.join(__dirname, '../../backend/venv/bin/python');
  } else {
    // Production
    const resourcesPath = process.resourcesPath;
    scriptPath = path.join(resourcesPath, 'backend/app.py');
    pythonExecutable = process.platform === 'win32'
      ? path.join(resourcesPath, 'backend/venv/Scripts/python.exe')
      : path.join(resourcesPath, 'backend/venv/bin/python');
  }

  console.log('Starting Flask process...');
  flaskProcess = spawn(pythonExecutable, [scriptPath]);

  // We can still log the output for debugging, but we won't rely on it to start the window.
  flaskProcess.stdout.on('data', (data) => console.log(`Flask stdout: ${data}`));
  flaskProcess.stderr.on('data', (data) => console.error(`Flask stderr: ${data}`));
  flaskProcess.on('error', (error) => dialog.showErrorBox('Backend Error', 'Failed to start the Flask server. ' + error));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { 
      nodeIntegration: true,
      contextIsolation: false
    },
    title: 'Lock'
  });

  const startURL = !app.isPackaged
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startURL);

  mainWindow.on('closed', () => { mainWindow = null; });
}

// --- SIMPLIFIED STARTUP LOGIC ---
app.on('ready', () => {
  // 1. Start the Flask server
  createFlaskProcess();
  
  // 2. Wait 5 seconds (5000 milliseconds) and then create the window
  console.log('Waiting for backend to start...');
  setTimeout(createWindow, 5000); 
});

// --- (The rest of your event listeners remain the same) ---
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (mainWindow === null) createWindow(); });
app.on('quit', () => {
  if (flaskProcess) flaskProcess.kill();
});