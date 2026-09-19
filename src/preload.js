const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('indexAPI', {
  reload: (callback) => ipcRenderer.on('reload', (_event, value) => callback(value)),
  deleteShopHint: (index) => ipcRenderer.send('deleteShopHint', index),
  deleteHint: (index) => ipcRenderer.send('deleteHint', index),
  saveSM: () => saveStoneMedallion(),
  saveDungeon: () => saveDungeons()
})

const smList = [
  'emerald', 'ruby', 'sapphire', 'mlight', 'mforest', 'mfire', 'mwater', 'mspirit', 'mshadow'
]

const defaultSMList = [
  'deku', 'dodongo', 'jabu', 'link', 'forest', 'fire', 'water', 'spirit', 'shadow'
]

const dungeonList = [
  'deku', 'dodongo', 'jabu', 'forest', 'fire', 'water', 'spirit', 'shadow', 'ganon', 'well', 'ice', 'gtg'
]

const defaultBossesList = [
  'bgohma', 'bdodongo', 'bbarinade', 'bphantom', 'bvolvagia', 'bmorpha', 'btwin', 'bbongo', 'bganon'
]

const setDefaultStoneMedallionListener = () => {
  let smBtn = document.getElementById('default-sm')
  smBtn.addEventListener('click', () => {
    const list = []
    smList.forEach((smKey, index) => {
      const smValue = defaultSMList[index]
      const data = { 'smKey': smKey, 'smValue': smValue }
      list.push(data)
    })
    ipcRenderer.send('saveSM', list)
  })
}

const saveStoneMedallion = () => {
  const list = []
  smList.forEach(smKey => {
    const smValue = document.getElementById('sm-location-' + smKey).value
    const data = { 'smKey': smKey, 'smValue': smValue }
    list.push(data)
  })
  ipcRenderer.send('saveSM', list)
}

const setDefaultDungeonsListener = () => {
  let dBtn = document.getElementById('default-dungeon')
  dBtn.addEventListener('click', () => {
    const list = []
    dungeonList.forEach((entrance, index) => {
      let dungeon = entrance
      let boss = defaultBossesList[index] ?? ""
      const data = { 'entrance': entrance, 'dungeon': dungeon, 'boss': boss }
      list.push(data)
    })
    ipcRenderer.send('saveDungeon', list)
  })
}

const saveDungeons = () => {
  const list = []
  dungeonList.forEach(entrance => {
    let dungeon = document.getElementById('d-location-' + entrance).value
    let boss = document.getElementById('d-boss-' + entrance).value
    const data = { 'entrance': entrance, 'dungeon': dungeon, 'boss': boss }
    list.push(data)
  })
  ipcRenderer.send('saveDungeon', list)
}

const saveShopHintsListener = () => {
  let dBtn = document.getElementById('save-shop')
  dBtn.addEventListener('click', () => {
    let location = document.getElementById('shop-location')
    let item = document.getElementById('shop-item')
    let price = document.getElementById('shop-price')
    if (location.value == 'empty' || item.value == '' || price.value == '') {
      ipcRenderer.send('errorMessage', 'Necesitas llenar todos los campos')
      return
    }

    const data = { 'location': location.value, 'item': item.value, 'price': price.value }
    ipcRenderer.send('saveShop', data)
  })
}

const saveHintsListener = () => {
  let hintBtn = document.getElementById('save-hint')
  hintBtn.addEventListener('click', () => {
    let hint1 = document.getElementById('hint-1')
    let hint2 = document.getElementById('hint-2')
    let hint3 = document.getElementById('hint-3')
    if (hint1.value == '' && hint2.value == '' && hint3.value == '') {
      ipcRenderer.send('errorMessage', 'Necesitas al menos un campo lleno')
      return
    }

    const data = [hint1.value, hint2.value, hint3.value].filter(hint => hint != '')
    ipcRenderer.send('saveHint', data)
  })
}

const resetFileListener = () => {
  let resetBtn = document.getElementById('reset-file')
  resetBtn.addEventListener('click', () => {
    ipcRenderer.send('resetFile', '')
  })
}

document.addEventListener('DOMContentLoaded', () => {
  setDefaultStoneMedallionListener()
  setDefaultDungeonsListener()
  saveShopHintsListener()
  saveHintsListener()
  resetFileListener()
})
