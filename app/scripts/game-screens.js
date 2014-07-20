'use strict';

var gameMenuScreen = new Screen({
  id: 'game-menu'
});

var optionsScreen = new Screen({
  id: 'options-screen'
});

var networkGameLobbyScreen = new Screen({
  id: 'network-game-lobby'
});

_.extend(optionsScreen, {
  fillUsername: function() {
    var previousUsername = localStorage.getItem('username');
    if (previousUsername) {
      if(this.$el.find('input').get(0)) {
        this.$el.find('input').get(0).value = previousUsername;
      }
    }
  },

  setListeners: function() {
    this.$el.find('.save-options-button').on('click', _.bind(this.onSaveClick, this));
  },

  onSaveClick: function() {
    localStorage.setItem('username', this.$el.find('input').get(0).value);
  }
});


_.extend(gameMenuScreen, {
  setListeners: function() {
    this.$el.find('.network-game-button').on('click', this.onNetworkGameClick);
  },

  onNetworkGameClick: function() {
    Utils.switchScreen(optionsScreen);
  }
});

_.extend(networkGameLobbyScreen, {
  setListeners: function() {
    this.$el.find('.game-start-button').on('click', this.onStartGameClick);
  },

  onStartGameClick: function() {

  },

  setPlayerCount: function(playerCount) {
    this.$el.find('.player-count').get(0).innerHTML = playerCount;
  },

  setDescription: function(description) {
    this.$el.find('.network-game-description').get(0).innerHTML = description;
  }
});


var networkGameMenu = new Screen({
  id: 'network-game-menu'
});

_.extend(networkGameMenu, {
  setListeners: function() {
    this.$el.find('.network-game-start-button').on('click', _.bind(this.onGameStarClick, this));
    this.$el.find('input[type=radio]').on('change', _.bind(this.onGameTypeChage, this));
  },

  getGameCodeValue: function() {
    return this.$el.find('.game-code-input').val();
  },
  onGameStarClick: function() {
    console.log('clicked game start');

  },
  onGameTypeChage: function() {
    this.gameType = 'public';
    var condition = false;
    if (condition) {
      this.gameType = 'private';
    }
    if (this.gameType === 'public') {
      this.$el.find('.game-code-input').hide();
    } else {
      this.$el.find('.game-code-input').show();
    }
  }
});


optionsScreen.init();
optionsScreen.fillUsername();
gameMenuScreen.init();
networkGameMenu.init();


var gameScreen = new Screen({
  id: 'game-screen'
});

$.extend(gameScreen, {

  setListeners: function() {
    this.$el.find('.network-game-button').on('click', this.onNetworkGameClick);
    this.$currentColorOverlay = this.$('.overlay-current-color');
  },


  onNetworkGameClick: function() {
    Utils.switchScreen(optionsScreen);
  },

  onGameStart: function() {
    this.$currentColorOverlay
  }
});

gameScreen.init();


var networkGameMenuScreen;

var gameScreen;

