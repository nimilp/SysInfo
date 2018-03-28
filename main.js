const electron = require('electron');
const {app, BrowserWindow,ipcMain} = electron;
const path = require('path');
const url = require('url');
const os = require('os');

let mainWindow;

function createWindow() {
  var _self = this;
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
  console.log(width-200)
  mainWindow = new BrowserWindow({
    height:height,
    x:width-250,
    y:0,
    width:250,
    resizable:false,
    opacity: .75,frame:true,
    maximizable:false,
    minimizable:true
  });
  mainWindow.loadURL(url.format({
    pathname : path.join(__dirname,'index.html'),
    protocol : "file:",
    slashes : true
  }));
// console.log(os);
//   ipcMain.on('mu:dom_loaded', ()=>{
//     const infoObjects = {
//       os:os
//     }
//
//     mainWindow.webContents.send('mu:data', infoObjects);
//   })
  mainWindow.on('closed',() => mainWindow = null)
}

app.on('ready', createWindow);
