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

optionsScreen.init();
optionsScreen.fillUsername();
gameMenuScreen.init();
networkGameLobbyScreen.init();
networkGameLobbyScreen.setDescription('test');
networkGameLobbyScreen.setPlayerCount('555');


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

