/* global setup */
setup.createTavern = function (town, opts) {
  opts = opts || {}
  var tavern = (opts['newBuilding'] || setup.createBuilding)(town, 'tavern')

  tavern.name = setup.createTavernName()
  console.groupCollapsed(tavern.name)
  tavern.bartender = (opts['newBartender'] || setup.createBartender)(town.name, tavern.name)
  tavern.barmaid = setup.createNPC({
    isShallow: true,
    gender: 'woman',
    background: 'commoner',
    hasClass: false,
    profession: 'barmaid'
  })

  Object.assign(tavern, {
    passageName: 'TavernOutput',
    initPassage: 'InitTavern',
    BuildingType: 'tavern',
    wordNoun: ['tavern', 'tavern', 'tavern', 'tavern', 'pub', 'pub', 'pub', 'inn', 'inn', 'bar', 'bar', 'bar', 'watering hole', 'drinkery'].random(),
    shortages: ['wine', 'booze', 'grog', 'whiskey', 'mutton', 'lamb', 'carrots', 'mugs', 'forks', 'frogs', 'bread', 'mushrooms', 'salt', 'silver pieces', 'chairs', 'eggs', 'potatoes'],
    fun: setup.tavernData.fun.random(),
    type: [
      'quiet and low-key bar',
      'regular',
      'regular',
      'regular',
      'regular',
      'raucous dive',
      'raucous dive',
      'raucous dive',
      'raucous dive',
      "thieves' guild hangout",
      'gathering place for a secret society',
      'high-end dining club',
      'high-end dining club',
      'gambling den',
      'gambling den',
      tavern.bartender.race + ' only club',
      "guild-member's only club",
      "guild-member's only club",
      'members-only club',
      'brothel',
      'brothel'
    ].random(),
    // entertainment: setup.tavernData.entertainment.random(),
    // patrons: setup.tavernData.patrons.random(),
    game: setup.tavernData.games.random()
  })
  var rollData = setup.tavernData.rollData
  var rollDataVariables = ['wealth', 'size', 'cleanliness', 'roughness', 'reputation']
  rollDataVariables.forEach(function (propName) {
    setup.defineRollDataGetter(tavern, setup.tavernData.rollData, propName)
  })

  Object.defineProperty(tavern, 'lodging', {
    get: function () {
      console.log('Fetching ' + tavern.name + ' lodging.')
      var lodging = rollData.wealth.find(function (descriptor) {
        return descriptor[0] <= this.roll.wealth
      }, this)
      if (lodging === undefined) {
        lodging = rollData.wealth[rollData.wealth.length - 1]
      }
      this._lodging = lodging[2]
      return this._lodging
    }
  })
  Object.defineProperty(tavern, 'food', {
    get: function () {
      console.log('Fetching ' + tavern.name + ' food.')
      var food = rollData.wealth.find(function (descriptor) {
        return descriptor[0] <= this.roll.wealth
      }, this)
      if (food === undefined) {
        food = rollData.wealth[rollData.wealth.length - 1]
      }
      this._food = food[2]
      return this._food
    }
  })

  Object.defineProperty(tavern, 'bedCleanliness', {
    get: function () {
      console.log('Fetching ' + tavern.name + ' bed cleanliness.')
      var bedCleanliness = rollData.cleanliness.find(function (descriptor) {
        return descriptor[0] <= this.roll.cleanliness
      }, this)
      if (bedCleanliness === undefined) {
        bedCleanliness = rollData.cleanliness[rollData.cleanliness.length - 1]
      }
      this._bedCleanliness = bedCleanliness[1]
      return this._bedCleanliness
    }
  })

  Object.defineProperty(tavern, 'sin', {
    get: function () {
      console.log('Fetching ' + tavern.name + ' sin.')
      if (this.roll.sin > 80) {
        this._sin = 'corrupt'
      } else if (this.roll.sin > 70) {
        this._sin = 'venal'
      } else if (this.roll.sin > 60) {
        this._sin = 'sleazy'
      } else if (this.roll.sin > 50) {
        this._sin = 'seedy'
      } else if (this.roll.sin > 40 && this.roll.reputation > 60) {
        this._sin = 'surprisingly trustworthy'
      } else if (this.roll.sin > 40) {
        this._sin = 'trustworthy'
      } else if (this.roll.sin > 30 && this.roll.reputation > 60) {
        this._sin = 'surprisingly reliable'
      } else if (this.roll.sin > 30) {
        this._sin = 'reliable'
      } else if (this.roll.sin <= 20 && this.roll.reputation > 60) {
        this._sin = 'surprisingly honest'
      } else if (this.roll.sin <= 20) {
        this._sin = 'honest'
      } else {
        this._sin = 'reasonably trustworthy'
      }
      return this._sin
    }
  })

  // tavern.wealth = ''
  // tavern.size = ''
  // tavern.cleanliness = ''

  Object.assign(tavern, setup.getTavernDraws(town, tavern))
  // console.log(tavern)

  if (tavern.draw === 'proximity to the church') {
    if (tavern.type.indexOf(['gambling den', 'proximity to the brothel', 'raucous dive']) !== -1) {
      tavern.draw = 'proximity to the brothel'
    } else if (tavern.type === 'brothel') {
      tavern.draw = 'cheap prices for customers'
      tavern.hasBrothel = true
    }
  }
  switch (tavern.draw) {
    case "tavern.reputation + ' atmosphere'":
      tavern.notableFeature = 'its ' + tavern.reputation + ' atmosphere'
      break
    default:
      tavern.notableFeature = 'its ' + tavern.draw
  }
  setup.tavernModifiers(town, tavern)
  // setup.tavernRender(tavern)
  // setup.townBinder(town, tavern, 'tavern')
  console.log(tavern)
  console.groupEnd();
  return tavern
}
