const { auto } = require('@popperjs/core');
const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const iconPath = path.join(__dirname, "buildResources", "icon.png");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

app.commandLine.appendSwitch('--enable-experimental-web-platform-features');

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ 
        icon: iconPath,
        width: 700,
        height: 700,
        autoHideMenuBar: true,
        backgroundColor: "#2d2d2d",
        webPreferences: {
            nodeIntegration: true, // to allow require
            contextIsolation: false, // allow use with Electron 12+
            preload: path.join(__dirname, 'preload.js')
        }
    })
    //serial 
    mainWindow.webContents.session.on('select-serial-port', (event, portList, webContents, callback) => {        
        //Add listeners to handle ports being added or removed before the callback for `select-serial-port`
        //is called.
        mainWindow.webContents.session.on('serial-port-added', (event, port) => {
          console.log('serial-port-added FIRED WITH', port)
          //Optionally update portList to add the new port
        })
      
        mainWindow.webContents.session.on('serial-port-removed', (event, port) => {
          console.log('serial-port-removed FIRED WITH', port)
          //Optionally update portList to remove the port
        })
        event.preventDefault()
        if (portList && portList.length > 0) {
          callback(portList[0].portId)
        } else {
          callback('') //Could not find any matching devices
        }
      })
    
    mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
      if (permission === 'serial' && details.securityOrigin === 'file:///') {
        return true
      }
    })
  
    mainWindow.webContents.session.setDevicePermissionHandler((details) => {
      if (details.deviceType === 'serial' && details.origin === 'file://') {
        return true
      }
    })
    //serial

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    app.quit()
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
