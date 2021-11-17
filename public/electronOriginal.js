const path = require("path");
const server = require('../src/server/server');
const portscanner = require('portscanner')
const { app, BrowserWindow, autoUpdater, dialog  } = require("electron");
const isDev = require("electron-is-dev");
let myWindow = null
const gotTheLock = app.requestSingleInstanceLock()
const { ipcMain } = require('electron');
// let port
// Conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS;
let win = null

  // Installs Dev Tools When in Dev Mode
  if (isDev) {
    const devTools = require("electron-devtools-installer");
    installExtension = devTools.default;
    REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
  }

  // Forces focus and maximise on app when and prevents a second instance opening
  if (!gotTheLock) {
    app.quit();
  // }else{
  //   app.on('second-instance', (event, commandLine, workingDirectory) => {
  //     //Someone tried to run second instance of app or update has occured
  //     if (win){
  //       if (win.isMinimized()) win.restore()
  //       win.focus
  //     }
  //   })
  }

  // Handle creating/removing shortcuts on Windows when installing/uninstalling
  if (require("electron-squirrel-startup")) {
    app.quit();
  }

if (process.mainModule.filename.indexOf('app.asar') !== -1) {
  // In that case we need to set the correct path to adodb.js
  process.env.PATHFORWSF = path.join(path.dirname(app.getPath('exe')), './resources/vbs');
  process.env.ADODBPATH = './resources/adodb.js';
} 

// server.startExpress();
const createWindow = async () => {
  try {
    process.env.expressPort = await portscanner.findAPortNotInUse(25000,35000)
  } catch (err){
    console.log("Error in Port Scanner", err)
    process.env.expressPort = 25000 
  }
  // process.env.expressPort = port 
  // console.log("Port", port)

  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    }
  });
  var mainProcessVars = {
    expressPort: process.env.expressPort,
    appVersion: app.getVersion()
  }
  ipcMain.on('variable-request', function (event, arg) {
    event.sender.send('variable-reply', [ mainProcessVars[arg[0]], mainProcessVars[arg[1]] ]);
  });
  win.setMenuBarVisibility(false)
  server.startExpress();
  // and load the index.html of the app.
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  
  

  createWindow();

  win.webContents.on('ipc-message', () =>{
    console.log("YEETIER")
  })

  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(error => console.log(`An error occurred: , ${error}`));
  } else {
    const server = 'http://my-cabinetvision-pa.herokuapp.com'
    const url = `${server}/update/${process.platform}/${app.getVersion()}`
    autoUpdater.setFeedURL({ url })
    setInterval(() => {
      console.log("will check updatess")
      autoUpdater.checkForUpdates()
    }, 60000)
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
      // const dialogOpts = {
      //   type: 'info',
      //   buttons: ['Restart', 'Later'],
      //   title: 'Application Update',
      //   message: process.platform === 'win32' ? releaseNotes : releaseName,
      //   detail: 'A new version has been downloaded. Restart the application to apply the updates.'
      // }
      const dialogOpts = {
      message: process.platform === 'win32' ? releaseNotes : releaseName
      }
      win.webContents.send('updateAvalible', dialogOpts);
      // ipcMain.send('updateAvalible', dialogOpts);
      ipcMain.on('updateAvalible-reply', ((event, args) =>{
        if (args[0] === 0) autoUpdater.quitAndInstall()
      }))

      // dialog.showMessageBox(dialogOpts).then((returnValue) => {
      //   if (returnValue.response === 0) autoUpdater.quitAndInstall()
      // })
    })
    autoUpdater.on('error', message => {
      console.error('There was a problem updating the application')
      console.error(message)
    })
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
