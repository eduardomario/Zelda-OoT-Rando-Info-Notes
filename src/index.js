const { BrowserWindow, ipcMain, dialog } = require("electron");
const { Storage } = require('./storage')
const path = require("path");

class MainScreen {
  window;

  position = {
    width: 1280,
    height: 720,
    maximized: false,
  };

  constructor() {
    this.window = new BrowserWindow({
      width: this.position.width,
      height: this.position.height,
      title: "Zelda OoT Hints",
      icon: __dirname + '/assets/icon.ico',
      show: false,
      removeMenu: true,
      acceptFirstMouse: true,
      autoHideMenuBar: true,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: true,
        preload: path.join(__dirname, "./preload.js"),
      },
    });

    this.window.once("ready-to-show", () => {
      this.window.show();

      if(this.position.maximized) {
        this.window.maximize();
      }
    });

    this.handleMessages();

    let wc = this.window.webContents;
    //wc.openDevTools({ mode: "undocked" });

    this.window.loadFile("./src/index.html").then(() => {
      this.refreshPage()
    });
  }

  close() {
    this.window.close();
    ipcMain.removeAllListeners();
  }

  hide() {
    this.window.hide();
  }

  handleMessages() {
    ipcMain.on('saveSM', (event, data) => {
      const store = new Storage('data/notes.json')
      store.set('smInfo', data)
      this.refreshPage()
      dialog.showMessageBox({
        title: 'Save Stone/Medallion',
        message: 'Cambios guardados con éxito',
        type: 'info'
      })
    })

    ipcMain.on('saveDungeon', (event, data) => {
      const store = new Storage('data/notes.json')
      store.set('dungeons', data)
      this.refreshPage()
      dialog.showMessageBox({
        title: 'Save Dungeon',
        message: 'Cambios guardados con éxito',
        type: 'info'
      })
    })

    ipcMain.on('saveShop', (event, data) => {
      const store = new Storage('data/notes.json')
      let shops = store.get('shops')
      const newData = { 'location': data.location, 'item': data.item, 'price': data.price }
      if (!shops) {
        shops = []
      }
      shops.push(newData)
      store.set('shops', shops)
      this.refreshPage()
    })

    ipcMain.on('deleteShopHint', (event, index) => {
      dialog.showMessageBox({
        title: 'Delete Shop Hint',
        message: '¿Estas seguro de borrar esta pista?',
        type: 'info',
        buttons: ['Yes', 'No']
      })
      .then((result) => {
        if (result.response == 0) {
          const store = new Storage('data/notes.json')
          let shops = store.get('shops')
          const newShops = shops.filter((shop, id) => id != index)
          store.set('shops', newShops)
          this.refreshPage()
        }
      })
    })

    ipcMain.on('saveHint', (event, data) => {
      const store = new Storage('data/notes.json')
      let hints = store.get('hints')
      if (!hints) {
        hints = []
      }
      hints.push(data)
      store.set('hints', hints)
      this.refreshPage()
    })

    ipcMain.on('deleteHint', (event, index) => {
      dialog.showMessageBox({
        title: 'Delete Hint',
        message: '¿Estas seguro de borrar esta pista?',
        type: 'info',
        buttons: ['Yes', 'No']
      })
      .then((result) => {
        if (result.response == 0) {
          const store = new Storage('data/notes.json')
          let hints = store.get('hints')
          const newHints = hints.filter((hint, id) => id != index)
          store.set('hints', newHints)
          this.refreshPage()
        }
      })
    })

    ipcMain.on('resetFile', (event, data) => {
      dialog.showMessageBox({
        title: 'Reset File',
        message: '¿Estas seguro de reiniciar tus notas?',
        type: 'info',
        buttons: ['Yes', 'No']
      })
      .then((result) => {
        if (result.response == 0) {
          const store = new Storage('data/notes.json')
          store.deleteFile().then(() => {
            this.refreshPage()
          })
        } else {
          dialog.showMessageBox({
            title: 'Reset File',
            message: 'Reinicio de las notas cancelado',
            type: 'info'
          })
        }
      })
    })
  }

  refreshPage() {
    const store = new Storage('data/notes.json')
    const file = store.getFile()
    this.window.webContents.send('reload', file)
  }
}

module.exports = MainScreen;