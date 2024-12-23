const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Optional, can be removed if not needed
            nodeIntegration: true, // Enable Node.js integration
        },
    });

    // Load the React production build
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));

    mainWindow.loadURL('http://localhost:5000');


    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
