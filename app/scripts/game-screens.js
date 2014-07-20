/*global Screen, Core, Utils*/
'use strict';

var gameMenuScreen = new Screen({
  id: 'game-menu'
});

var optionsScreen = new Screen({
  id: 'options-screen'
});

var gameScreen = new Screen({
  id: 'game-screen'
});

$.extend(gameMenuScreen, {
  setListeners: function() {
    this.$el.find('.network-game-button').on('click', this.onNetworkGameClick);
    this.$el.find('.network-game-random-start-button').on('click', this.onRandomNetworkGameClick);
  },

  onNetworkGameClick: function() {
    Utils.switchScreen(optionsScreen);
  },

  onRandomNetworkGameClick: function() {
    Utils.switchScreen(gameScreen);

  }
});
gameMenuScreen.init();


var gameScreen = window.gameScreen = new Screen({
  id: 'game-screen'
});

$.extend(gameScreen, {

  setListeners: function() {
    this.$('.network-game-button').on('click', this.onNetworkGameClick);
  },

  init: function() {
    this.setListeners();
    this.setTopbarText('Waiting for other unicorns...');
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
    // this.$currentColorOverlay
  },

  startGame: function(startColor, targetColor, time) {
    var me = this;
    me.$el.on(PageTransitions.TransitionEvents.transitionEnd, function() {

      this.setStartColor(startColor);
      setTimeout(function() {
        me.hideTopbar();
        me.shrinkTargetColor();
        me.$el.trigger('game-start-animation-finished');
        me.onGameStart();
      }, 2500);
    });
  },

  shrinkTargetColor: function() {
    $('.color1').addClass('shrink');
  },

  hideTopbar: function() {
    this.$el.find('.game-topbar').addClass('hide');
  },

  setTopbarText: function(text) {
    this.$el.find('.game-topbar').text(text);
  },

  setStartColor: function(startColor) {
    $('.color1').css({
      backgroundColor: startColor
    });
  },

  setTargetColor: function(targetColor) {
    $('.color2').css({
      backgroundColor: targetColor
    });
  }
});

gameScreen.init();
//gameScreen.startGame('forestGreen', 'peru', 10);


var networkGameMenuScreen;

var networkGameLobbyScreen;