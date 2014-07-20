/*global Screen, Core, Utils, _*/
'use strict';

/* Game menu screen */
var gameMenuScreen = new Screen({
  id: 'game-menu'
});



_.extend(gameMenuScreen, {
  setListeners: function() {
    this.$el.find('.network-game-button').on('click', this.onNetworkGameClick);
    this.$el.find('.join-network-game-button').on('click', this.onJoinNetworkGameClick);
    this.$el.find('.options-button').on('click', this.onOptionsClick);
    this.$el.find('.network-game-random-start-button').on('click', this.onRandomNetworkGameClick);
  },

  onNetworkGameClick: function() {
    Utils.switchScreen(networkGameMenu);
  },

  onJoinNetworkGameClick: function() {
    Utils.switchScreen(joinNetworkGameMenu);
  },

  onRandomNetworkGameClick: function() {
    Utils.switchScreen(gameScreen);
    gameScreen.startGame('peru', 'chocolate', 10);
  },

  onOptionsClick: function() {
    Utils.switchScreen(optionsScreen);
  },
});

gameMenuScreen.init();



/* Options screen */
var optionsScreen = new Screen({
  id: 'options-screen'
});

_.extend(optionsScreen, {
  fillUsername: function() {
    var previousUsername = localStorage.getItem('username');
    if (previousUsername) {
      if (this.$el.find('input').get(0)) {
        this.$el.find('input').get(0).value = previousUsername;
      }
    }
  },

  setListeners: function() {
    this.$el.find('.save-options-button').on('click', _.bind(this.onSaveClick, this));
  },

  onSaveClick: function() {
    localStorage.setItem('username', this.$el.find('input').get(0).value);
    Utils.switchScreen(gameMenuScreen);
  },

  onScreenShown: function() {
    this.fillUsername();
  }
});

optionsScreen.init();



/* Network game lobby screen */

var networkGameLobbyScreen = new Screen({
  id: 'network-game-lobby'
});

_.extend(networkGameLobbyScreen, {
  setListeners: function() {
    this.$el.find('.game-start-button').on('click', this.onStartGameClick);
  },

  onStartGameClick: function() {

  },

  setPlayerCount: function(playerCount) {
    this.$el.find('.player-count').html(playerCount);
  },

  setDescription: function(description) {
    this.$el.find('.network-game-description').html(description);
  }
});

networkGameLobbyScreen.init();


/* Create Network game screen */

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
    if (this.$el.find('input:checked').val() === 'private') {
      this.gameType = 'private';
    }
    if (this.gameType === 'public') {
      this.$el.find('.game-code-input').hide();
    } else {
      this.$el.find('.game-code-input').show();
    }
  }
});

networkGameMenu.init();

/* Join Network game screen */

var joinNetworkGameMenu = new Screen({
  id: 'join-network-game-menu'
});

_.extend(joinNetworkGameMenu, {
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
    if (this.$el.find('input:checked').val() === 'private') {
      this.gameType = 'private';
    }
    if (this.gameType === 'public') {
      this.$el.find('.game-code-input').hide();
    } else {
      this.$el.find('.game-code-input').show();
    }
  }
});

joinNetworkGameMenu.init();



/* Game screen */

var gameScreen = window.gameScreen = new Screen({
  id: 'game-screen'
});

$.extend(gameScreen, {
  setListeners: function() {
    this.$('.network-game-button').on('click', this.onNetworkGameClick);
  },

  init: function() {
    this.setListeners();
    this.setTopbarText('This is your starting color. <br> Change it by shaing your phone up, down, left, right, forward, back');
    this.$timer = this.$('.timer');
  },

  onNetworkGameClick: function() {
    Utils.switchScreen(optionsScreen);
  },

  onGameStart: function() {
    Core.colorChanger.setElement(this.$('.color2'));
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
        me.$timer.text(me.gameTime / 1000 + ' seconds left ...');
      }
    }, 1000);
  },

  clearGameTimer: function() {
    if (this.gameInterval) {
      window.clearInterval(this.gameInterval);
    }
    this.$timer.text();
  },

  onGameTimerEnd: function() {
    this.$timer.text('Timeout!');
    this.clearGameTimer();
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
    this.$el.find('.game-topbar').html(text);
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

/* Results screen */

var resultsScreen = new Screen({
  id: 'results-screen'
});

_.extend(resultsScreen, {
  setListeners: function() {
    this.$el.find('.network-game-start-button').on('click', _.bind(this.onGameStarClick, this));
    this.$el.find('input[type=radio]').on('change', _.bind(this.onGameTypeChage, this));
  },
  setWinningMessage: function(playerWon) {
    var username = localStorage.getItem('username');
    if (playerWon) {
      this.$el.find('.winning-message').text('Awesome, ' + username + '! You have won this round.');
    } else {
      this.$el.find('.winning-message').text('Awwww, ' + username + ', you have lost :( :(');
    }

    this.$el.find('.next-game-message').text('Next game is starting in couple of seconds. Please rest your arm until then. ');
  }
});

resultsScreen.init();
