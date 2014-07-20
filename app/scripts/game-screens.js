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
    gameScreen.startGame('peru', 'chocolate', 10);
  }
});
gameMenuScreen.init();



$.extend(gameScreen, {

  setListeners: function() {
    this.$el.find('.network-game-button').on('click', this.onNetworkGameClick);
    this.$currentColorOverlay = this.$('.overlay-current-color');
  },

  init: function() {
    this.setTopbarText('Waiting for other unicorns...');
  },


  onNetworkGameClick: function() {
    Utils.switchScreen(optionsScreen);
  },

  onGameStart: function() {
    // this.$currentColorOverlay
  },

  startGame: function(startColor, targetColor, time) {
    var me = this;
    me.setStartColor(startColor);
    me.setTargetColor(targetColor);
    me.$el.on(PageTransitions.TransitionEvents.transitionEnd, function() {

      setTimeout(function() {
        me.hideTopbar();
        me.shrinkTargetColor();
        me.$el.trigger('game-start-animation-finished');
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

var gameScreen;
