/*global Screen, Core, Utils, _*/
'use strict';

var networkGame;

/* Game menu screen */
var gameMenuScreen = new Screen({
  id: 'game-menu'
});


_.extend(gameMenuScreen, {
  setListeners: function() {
    this.$el.find('.network-game-button').on('click', this.onNetworkGameClick);
    this.$el.find('.options-button').on('click', this.onOptionsClick);
    this.$el.find('.network-game-random-start-button').on('click', this.onRandomNetworkGameClick);
  },

  onNetworkGameClick: function() {
    Utils.switchScreen(networkGameMenu);
  },

  onRandomNetworkGameClick: function() {
    networkGame = new NetworkGame({
      name: localStorage.getItem('username')
    });

    networkGame.getPublicRooms(function(publicRooms) {
      if (publicRooms.length === 0) {
        Utils.switchScreen(gameMenuScreen);
        return alert('Nema igra');
      }
      // Show loading screen
      var roomInfo = publicRooms[Math.floor(Math.random() * publicRooms.length)];

      roomInfo.joinRoom(roomInfo.roomCode, function(room) {
        Utils.switchScreen(gameScreen);
        gameScreen.setRoom(room);
      });
    });
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


/* Network game screen */

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
    this.setTopbarText('Waiting for other unicorns...');
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
    this.onGameEnd();
    // this.$currentColorOverlay
  },

  startGame: function(room, startColor, targetColor, time) {
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

  setRoom: function(room) {
    if (room) {
      room.off('game:next', this.onGameNext, this);
      room.off('game:done', this.onGameDone, this);
      room.off('game:finish', this.onGameFinish, this);
      room.off('game:changed', this.onGameChange, this);
    }
    this.room = room;
    room.on('game:next', this.onGameNext, this);
    room.on('game:done', this.onGameDone, this);
    room.on('game:finish', this.onGameFinish, this);
    room.on('game:changed', this.onGameChange, this);

    if (room.isManager()) {
      this.startGame();
    }
  },

  onGameEnd: function() {

  },

  onGameNext: function() {
    // Show game screen
  },

  onGameDone: function() {

  },

  onGameFinish: function() {

  },

  onGameChange: function() {
    if (this.room.isManager()) {

    } else {

    }
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
  },

  generateRandomColor: function() {

  }

});

gameScreen.init();