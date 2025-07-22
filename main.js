const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const MainScreen = require("./src/index");
const path = require('path')

let curWindow

const createWindow = () => {
    curWindow = new MainScreen();
}

app.whenReady().then(() => {
    //ipcMain.handle('ping', () => 'pong')
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

ipcMain.on('errorMessage', (event, data) => {
    dialog.showMessageBox({
        title: 'Zelda OoT Info Notes',
        message: data,
        type: 'error'
    })
})
