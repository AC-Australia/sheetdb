const { app, BrowserWindow, autoUpdater, dialog } = require('electron')
const path = require("path");
const server = require('../src/server/server');
const portscanner = require('portscanner')
const isDev = require("electron-is-dev");
const gotTheLock = app.requestSingleInstanceLock()
const { ipcMain } = require('electron');

let installExtension, REACT_DEVELOPER_TOOLS;

// Before Launch Decide If Dev Tools will be required
  if (isDev) {
    const devTools = require("electron-devtools-installer");
    installExtension = devTools.default;
    REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
  }
// If App Instance Already Running Quit new Instance
  if (!gotTheLock) {
    app.quit();
  }
// Force Close During Squirrel Installations
  if (require("electron-squirrel-startup")) {
    app.quit();
  }
// Set Proccess Varibles for Windows ADOdb and Registry Scripts
  if (process.mainModule.filename.indexOf('app.asar') !== -1) {
    process.env.PATHFORWSF = path.join(path.dirname(app.getPath('exe')), './resources/vbs');
    process.env.ADODBPATH = './resources/adodb.js';
  } 
// Once Express Is Ready Create Window and set up background process
  app.whenReady().then(async () => {
    // Creats Window and Loads Render Files
    console.log("Creating New Winow")
    const win = new BrowserWindow({
      width: 1430,
      height: 1080,
      webPreferences: {
        nodeIntegration: true
      }
    })
    // Set No MenuBar
    win.setMenuBarVisibility(false)
    // Get Avalible Port 
    process.env.expressPort = await getAvaliblePort()
    // Set Version and Express Port Ready for Use in Render
    console.log("Setting Port Variables")
    const mainProcessVars = {
      expressPort: process.env.expressPort,
      appVersion: app.getVersion()
    }    
    // Set Up event Listner - This will be called in render to get port number for back end and version number to display on screen
    console.log("Setting Up Variable Listner")
    ipcMain.on('variable-request', function (event, arg) {
      event.sender.send('variable-reply', [ mainProcessVars[arg[0]], mainProcessVars[arg[1]] ]);
    });
    // Start Back End
    server.startExpress();
    // Load URL for Render based on dev or production
    win.loadURL(
      isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../build/index.html")}`
    );
    // Open the DevTools.
    // console.log("Open Dev tools")
    if (isDev) {
      win.webContents.openDevTools({ mode: "detach" });
    }
    // If DevMode Install development Tools
    // console.log("Install extensions")
    if (isDev) {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then(name => console.log(`Added Extension:  ${name}`))
        .catch(error => console.log(`An error occurred: , ${error}`));
    } 
    // If not Dev Mode - Set Up Auto-Updates
    if (!isDev) {
      // Variables For Auto Updater
      const server = 'http://my-cabinetvision-pa.herokuapp.com'
      const url = `${server}/update/${process.platform}/${app.getVersion()}`
      autoUpdater.setFeedURL({ url })
      // Set Timed Interval to Check Updates
      setInterval(() => {
        autoUpdater.checkForUpdates()
      }, 300000)
      // Sets Message Variable For Dialog Info
      autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        let message = process.platform === 'win32' ? releaseNotes : releaseName
        win.webContents.send('updateAvalible', message)
      });
    }
    // Event Listner for File Explorer
    ipcMain.on('getDirectory', async (event, arg) => {
      console.log("Electron Trigged")
      console.log(arg)
      try{
      const result = await dialog.showOpenDialog(win, {
        properties: ['openDirectory']
      })
      win.webContents.send('filePath', {purpose: arg, filePath:result.filePaths})
    } catch (err) {
      console.log("ERROR", err)
    }
    })
  })
// Once Window is Closed Quit the app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    app.createWindow()
  }
})

// Set Up functions
const getAvaliblePort = async () => {
  try {
    let portNumber = await portscanner.findAPortNotInUse(25000,35000)
    return portNumber
  } catch (err){
    console.log("Error in Port Scanner", err)
    let portNumber = 25000 
    return portNumber
  }
}
