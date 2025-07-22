const names = {
    'emerald': 'Kokiri\'s Emerald',
    'ruby': 'Goron\'s Ruby',
    'sapphire': 'Zora\'s Sapphire',
    'mlight': 'Light Medallion',
    'mforest': 'Forest Medallion',
    'mfire': 'Fire Medallion',
    'mwater': 'Water Medallion',
    'mshadow': 'Shadow Medallion',
    'mspirit': 'Spirit Medallion',
    'link': 'Link\'s Pocket',
    'deku': 'Deku Tree',
    'dodongo': 'Dodongo\'s Cavern',
    'jabu': 'Jabu-Jabu\'s Belly',
    'forest': 'Forest Temple',
    'fire': 'Fire Temple',
    'water': 'Water Temple',
    'shadow': 'Shadow Temple',
    'spirit': 'Spirit Temple',
    'well': 'Bottom of the Well',
    'ice': 'Ice Cavern',
    'gtg': 'Gerudo Training Grounds',
    'ganon': 'Ganon\'s Castle',
    'bgohma': 'Gohma',
    'bdodongo': 'King Dodongo',
    'bbarinade': 'Barinade',
    'bphantom': 'Phantom Ganon',
    'bvolvagia': 'Volvagia',
    'bmorpha': 'Morpha',
    'bbongo': 'Bongo Bongo',
    'btwin': 'Twinrova',
    'bganon': 'Ganondorf',
    'skokiri': 'Kokiri Shop',
    'sbazaar': 'Market Bazaar',
    'spotion': 'Market Potion Shop',
    'sbombchu': 'Bombchu Shop',
    'sgoron': 'Goron Shop',
    'szora': 'Zora Shop',
    'skbazaar': 'Kakariko Bazaar',
    'skpotion': 'Kakariko Potion Shop',
}

const locations = [
    {
        group: 'Startup',
        options: ['link']
    },
    {
        group: 'Dungeons',
        options: ['deku', 'dodongo', 'jabu']
    },
    {
        group: 'Temples',
        options: ['forest', 'fire', 'water', 'shadow', 'spirit']
    },
    {
        group: 'Extras',
        options: ['well', 'ice', 'gtg', 'ganon']
    }
]

const bosses = [
    {
        group: 'Child',
        options: ['bgohma', 'bdodongo', 'bbarinade']
    },
    {
        group: 'Adult',
        options: ['bphantom', 'bvolvagia', 'bmorpha', 'bbongo', 'btwin', 'bganon']
    }
]

const humanNames = (element) => {
    return names[element] ?? '??'
}

const clearInputs = () => {
    const location = document.getElementById('shop-location')
    const item = document.getElementById('shop-item')
    const price = document.getElementById('shop-price')
    location.value = 'empty'
    item.value = ''
    price.value = ''

    const hint1 = document.getElementById('hint-1')
    const hint2 = document.getElementById('hint-2')
    const hint3 = document.getElementById('hint-3')
    hint1.value = ''
    hint2.value = ''
    hint3.value = ''
}

const createReadOnlyInput = (key, customName) => {
    const input = document.createElement('input')
    input.value = key
    if (!customName) {
        input.value = humanNames(key)
    }
    input.readOnly = true
    return input
}

const createArrow = () => {
    const img = document.createElement('img')
    img.src = './assets/arrow.png'
    return img
}

const createDeleteShopHint = (index) => {
    const img = document.createElement('img')
    img.src = './assets/close.png'
    img.className = 'close'
    img.addEventListener('click', () => {
        window.indexAPI.deleteShopHint(index)
    })
    return img
}

const createDeleteHint = (index) => {
    const img = document.createElement('img')
    img.src = './assets/close.png'
    img.className = 'close'
    img.addEventListener('click', () => {
        window.indexAPI.deleteHint(index)
    })
    return img
}

const createSelectLocation = (key, value, section) => {
    const select = document.createElement('select')
    let id = 'sm-location-' + key
    if (section == 'dungeon') {
        id = 'd-location-' + key
    }
    select.id = id
    const emptyOption = document.createElement('option')
    emptyOption.value = ''
    emptyOption.innerHTML = '???'
    select.appendChild(emptyOption)
    locations.forEach(location => {
        if (section != 'dungeon' || location.group != 'Startup') {
            const optgroup = document.createElement('optgroup')
            optgroup.label = location.group
            location.options.forEach(option => {
                const optionHTML = document.createElement('option')
                optionHTML.value = option
                optionHTML.innerHTML = humanNames(option)
                optgroup.appendChild(optionHTML)
            })
            select.appendChild(optgroup)
        }
    })
    select.value = value
    return select
}

const createSelectBoss = (key, value) => {
    const select = document.createElement('select')
    select.id = 'd-boss-' + key
    const emptyOption = document.createElement('option')
    emptyOption.value = ''
    emptyOption.innerHTML = '-'
    select.appendChild(emptyOption)
    bosses.forEach(boss => {
        const optgroup = document.createElement('optgroup')
        optgroup.label = boss.group
        boss.options.forEach(option => {
            const optionHTML = document.createElement('option')
            optionHTML.value = option
            optionHTML.innerHTML = humanNames(option)
            optgroup.appendChild(optionHTML)
        })
        select.appendChild(optgroup)
    })
    select.value = value
    return select
}

const loadSMDiv = (file) => {
    const smDiv = document.getElementById('sm-info');
    smDiv.innerHTML = ''
    file.smInfo.forEach(element => {
        const smItem = document.createElement('div')
        smItem.className = 'info-item'
        const arrow = createArrow()
        const smItemSM = createReadOnlyInput(element.smKey)
        const smItemDungeon = createSelectLocation(element.smKey, element.smValue, 'sm')
        smItem.appendChild(smItemSM)
        smItem.appendChild(arrow)
        smItem.appendChild(smItemDungeon)
        smDiv.appendChild(smItem)
    });
}

const loadDungeonDiv = (file) => {
    const dDiv = document.getElementById('dungeons-info');
    dDiv.innerHTML = ''
    file.dungeons.forEach(element => {
        const dItem = document.createElement('div')
        dItem.className = 'info-item'
        const arrow1 = createArrow()
        const arrow2 = createArrow()
        const dEntrance = createReadOnlyInput(element.entrance)
        const dDungeon = createSelectLocation(element.entrance, element.dungeon, 'dungeon')
        const dBoss = createSelectBoss(element.entrance, element.boss)
        dItem.appendChild(dEntrance)
        dItem.appendChild(arrow1)
        dItem.appendChild(dDungeon)
        dItem.appendChild(arrow2)
        dItem.appendChild(dBoss)
        dDiv.appendChild(dItem)
    });
}

const loadShopDiv = (file) => {
    const shopDiv = document.getElementById('shops-info');
    shopDiv.innerHTML = ''
    if (file.shops) {
        file.shops.forEach((element, index) => {
            const shopItem = document.createElement('div')
            shopItem.className = 'info-item'
            const closeBtn = createDeleteShopHint(index)
            const arrow1 = createArrow()
            const arrow2 = createArrow()
            const sLocation = createReadOnlyInput(element.location)
            const sItem = createReadOnlyInput(element.item, true)
            const sPrice = createReadOnlyInput(element.price, true)
            shopItem.appendChild(closeBtn)
            shopItem.appendChild(sLocation)
            shopItem.appendChild(arrow1)
            shopItem.appendChild(sItem)
            shopItem.appendChild(arrow2)
            shopItem.appendChild(sPrice)
            shopDiv.appendChild(shopItem)
        });
    }
}

const loadHintDiv = (file) => {
    const hintDiv = document.getElementById('hints-info');
    hintDiv.innerHTML = ''
    if (file.hints) {
        file.hints.forEach((element, index) => {
            const hintsItem = document.createElement('div')
            hintsItem.className = 'info-item'
            const closeBtn = createDeleteHint(index)
            hintsItem.appendChild(closeBtn)
            element.forEach((hint, hintId) => {
                if (hintId != 0) {
                    const arrow = createArrow()
                    hintsItem.appendChild(arrow)
                }
                const hintElement = createReadOnlyInput(hint, true)
                hintsItem.appendChild(hintElement)
            })
            hintDiv.appendChild(hintsItem)
        });
    }
}

window.indexAPI.reload((file) => {
    loadSMDiv(file)
    loadDungeonDiv(file)
    loadShopDiv(file)
    loadHintDiv(file)
    clearInputs()
})