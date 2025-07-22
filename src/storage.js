const fs = require('fs')
const path = require('path')
const { dialog } = require('electron')

class Storage {
  fileName;

  constructor(fileN) {
    this.fileName = fileN;
  }

  getFile() {
    let pth = this.fileName;

    if (fs.existsSync(pth)) {
      let rawdata = fs.readFileSync(pth)

      if (rawdata != '') {
        let data = JSON.parse(rawdata)
        return data
      } else {
        const newData = this.validateJson()
        return newData
      }
    } else {
      if (!fs.existsSync('data')) {
        fs.mkdirSync('data');
      }
      const newData = this.validateJson()
      return newData
    }
  }

  validateJson() {
    let smInfo = this.validateSM()
    let dungeons = this.validateDungeons()
    this.set('smInfo', smInfo)
    this.set('dungeons', dungeons)
    return { "smInfo": smInfo, "dungeons": dungeons }
  }

  validateSM() {
    let smInfo = this.get('smInfo')

    if (!smInfo || smInfo.length < 9) {
      smInfo  = [
        { smKey: 'mlight', smValue: ''},
        { smKey: 'mforest', smValue: ''},
        { smKey: 'mfire', smValue: ''},
        { smKey: 'mwater', smValue: ''},
        { smKey: 'mshadow', smValue: ''},
        { smKey: 'mspirit', smValue: ''},
        { smKey: 'emerald', smValue: ''},
        { smKey: 'ruby', smValue: ''},
        { smKey: 'sapphire', smValue: ''}
      ]
    }
    return smInfo
  }

  validateDungeons() {
    let dungeons = this.get('dungeons')
    if (!dungeons || dungeons.length < 12) {
      dungeons = [
        { entrance: 'deku', dungeon: '', boss: ''},
        { entrance: 'dodongo', dungeon: '', boss: ''},
        { entrance: 'jabu', dungeon: '', boss: ''},
        { entrance: 'forest', dungeon: '', boss: ''},
        { entrance: 'fire', dungeon: '', boss: ''},
        { entrance: 'water', dungeon: '', boss: ''},
        { entrance: 'shadow', dungeon: '', boss: ''},
        { entrance: 'spirit', dungeon: '', boss: ''},
        { entrance: 'ganon', dungeon: '', boss: ''},
        { entrance: 'well', dungeon: '', boss: ''},
        { entrance: 'ice', dungeon: '', boss: ''},
        { entrance: 'gtg', dungeon: '', boss: ''},
      ]
    }
    return dungeons
  }

  get(key) {
    let pth = this.fileName;

    if (fs.existsSync(pth)) {
      let rawdata = fs.readFileSync(pth)

      if (rawdata != '') {
        let data = JSON.parse(rawdata)
        return data[key]
      } else return null
    } else {
      return null
    }
  }

  set(key, value) {
    let pth = this.fileName;

    let data = {}
    if (!fs.existsSync('data')) {
        fs.mkdirSync('data');
    }

    if (fs.existsSync(pth)) {
      let rawdata = fs.readFileSync(pth)
      if (rawdata != '') data = JSON.parse(rawdata)
    }
    data[key] = value

    fs.writeFileSync(pth, JSON.stringify(data))
    return true
  }

  deleteFile() {
    const promise = new Promise((resolve, reject) => {
      let pth = this.fileName;
      if (fs.existsSync(pth)) {
          fs.unlink(pth, (err) => {
            if (err) {
              dialog.showMessageBox({
                title: 'Error',
                message: 'No se pudo eliminar el antiguo archivo',
                type: 'error'
              })
              reject()
            } else {
              dialog.showMessageBox({
                title: 'Info',
                message: 'Archivo reiniciado con exito',
                type: 'info'
              })
              this.validateJson()
              resolve()
            }
            
          })
      }
    })
    return promise;
  }
}

module.exports = { Storage };