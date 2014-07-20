'use strict';

var Screen = function(options) {
  this._init(options);
};

$.extend(Screen.prototype, {
  _init: function(options) {
    this.$el = $('#' + options.id);
  },
  init: function(options) {
    this.setListeners();
  },
  setListeners: function(options) {
    // listeners
  }
});


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

var networkGameMenuScreen;

var networkGameLobbyScreen;

var gameScreen;

