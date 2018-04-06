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
    minimizable:true,
    icon: path.join(__dirname, 'assets/icons/64x64.png')
  });
  mainWindow.loadURL(url.format({
    pathname : path.join(__dirname,'index.html'),
    protocol : "file:",
    slashes : true
  }));
  mainWindow.on('closed',() => mainWindow = null)
}

app.on('ready', createWindow);
//mac specific
app.on('activate', () =>{
  if(mainWindow === null){
    createWindow();
  }
});
app.on('all-windows-closed',()=>{
  if(process.platform !== 'darwin'){
    app.quit();
  }
})
