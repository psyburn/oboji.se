'use strict';

var gameMenuScreen = new Screen({
  id: 'game-menu'
});

var optionsScreen = new Screen({
  id: 'options-screen'
});

$.extend(gameMenuScreen, {
  setListeners: function() {
    this.$el.find('.network-game-button').on('click', this.onNetworkGameClick);
  },

  onNetworkGameClick: function() {
    Utils.switchScreen(optionsScreen);
  }
});
gameMenuScreen.init();



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

var networkGameLobbyScreen;

var gameScreen;

