const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Matches fetchBlocklist thunk
  getBlocklist: () => ipcRenderer.invoke('get-blocklist'),
  // Matches addSite thunk
  blockSite: (url) => ipcRenderer.invoke('block-website', url),
  // Matches removeSite thunk
  unblockSite: (url) => ipcRenderer.invoke('unblock-website', url),

  // Auth functions
  checkAuthStatus: () => ipcRenderer.invoke('check-auth-status'),
  createAccount: (creds) => ipcRenderer.invoke('create-account', creds),
  verifyUser: (creds) => ipcRenderer.invoke('verify-user', creds),

  // reset-password
  getConfigPath: () => ipcRenderer.invoke('get-config-path'),
  // Dialog-box
  showDialog: (options) => ipcRenderer.invoke('show-dialog', options),
});