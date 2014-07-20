/*global Screen, Core, Utils*/
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



var gameScreen = window.gameScreen = new Screen({
  id: 'game-screen'
});

$.extend(gameScreen, {
  init: function() {
    this.setListeners();
  },

  setListeners: function() {
    this.$('.network-game-button').on('click', this.onNetworkGameClick);
  },

  onNetworkGameClick: function() {
    Utils.switchScreen(optionsScreen);
  },

  onGameStart: function() {
    Core.colorChanger.setElement(this.$('.color1'));
    this.startGameTimer();
  },

  startGameTimer: function() {
    var me = this;
    this.clearGameTimer();
    this.gameTime = 1000 * 15;
    this.gameInterval = window.setInterval(function() {
      me.gameTime -= 1000;
      if (me.gameTime === 0) {
        me.onGameTimerEnd.call(me);
      } else {
        me.$('.timer').text(me.gameTime / 1000 + ' seconds left ...');
      }
    }, 1000);
  },

  clearGameTimer: function() {
    if (this.gameInterval) {
      window.clearInterval(this.gameInterval);
    }
    this.$('.timer').text();
  },

  onGameTimerEnd: function() {
    this.$('.timer').text('Timeout!');
    this.clearGameTimer();
  }
});

gameScreen.init();


var networkGameMenuScreen;

var networkGameLobbyScreen;

var gameScreen;