const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendNetworkStatus: (status) => ipcRenderer.send('app-network-status', status),
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
});
