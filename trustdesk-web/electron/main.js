const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#05070a', // Matches our dark premium backdrop
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    // Wait until the Vite dev server is running before loading
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, Vite outputs to dist
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handler to log offline/online statuses back from React to Node
ipcMain.on('app-network-status', (event, status) => {
  console.log(`[TrustDesk Desktop] Network connectivity changed to: ${status}`);
});
