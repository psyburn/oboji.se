/*global Screen, Core, Utils, _*/
'use strict';

var networkGame = new NetworkGame({
  name: localStorage.getItem('username')
});

var room;

var startColor, targetColor;

var startNextGame = function() {
  if (room.isManager()) {
    startColor = Core.Color.generateRandomRgbString();
    targetColor = Core.Color.generateRandomRgbString();
    room.startNextGame(startColor, targetColor);
  }
};


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
    room = networkGame.createRoom({
      'public': false,
      maxPlayers: 100
    });
    Utils.switchScreen(networkGameLobbyScreen);
  },

  onJoinNetworkGameClick: function() {
    Utils.switchScreen(joinNetworkGameMenu);
  },

  onRandomNetworkGameClick: function() {
    networkGame.getPublicRooms(function(publicRooms) {
      if (publicRooms.length === 0) {
        Utils.switchScreen(gameMenuScreen);
        return alert('Nema igra');
      }
      // Show loading screen
      var roomInfo = publicRooms[Math.floor(Math.random() * publicRooms.length)];

      roomInfo.joinRoom(roomInfo.roomCode, function(room) {
        if (room === false) {
          window.alert('Mrš!');
        } else {
          Utils.switchScreen(gameScreen);
          gameScreen.startGame();
        }
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
    var me = this;
    this.$el.find('.game-start-button').on('click', function() {
      me.onStartGameClick.call(me);
    });
  },

  onScreenShown: function() {
    room.on('game:changed', this.updateTexts, this);
    room.on('game:next', this.onRoomGameNext, this);
    this.updateTexts();
  },

  onRoomGameNext: function(inStartColor, inTargetColor) {
    startColor = inStartColor;
    targetColor = inTargetColor;
    if (!room.isManager()) {
      this.joinGame();
    }
  },

  onStartGameClick: function() {
    this.joinGame();
  },

  joinGame: function() {
    Utils.switchScreen(gameScreen);
    gameScreen.startGame();
  },

  updateTexts: function() {
    this.$('.room-code').text(room.getRoomCode());
    this.$('.player-count').text(_.values(room.get('players')).length);

    if (!room.isManager()) {
      this.$('.game-start-button').hide();
      this.$('.game-will-start-soon').show();
    } else {
      this.$('.game-start-button').show();
      this.$('.game-will-start-soon').hide();
    }
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
    this.$el.find('.network-game-start-button').on('click', _.bind(this.onCreateGameClick, this));
    this.$el.find('input[type=radio]').on('change', _.bind(this.onGameTypeChage, this));
  },

  getGameCodeValue: function() {
    return this.$el.find('.game-code-input').val();
  },

  onCreateGameClick: function() {
    room = networkGame.createRoom({
      'public': this.gameType === 'public',
      maxPlayers: 100
    });
    Utils.switchScreen(networkGameLobbyScreen);
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
    this.$el.find('.network-game-start-button').on('click', _.bind(this.onGameStartClick, this));
    this.$el.find('input[type=radio]').on('change', _.bind(this.onGameTypeChage, this));
  },

  getGameCodeValue: function() {
    return this.$el.find('.game-code-input').val();
  },

  onGameStartClick: function() {
    var me = this;
    networkGame.joinRoom(this.getGameCodeValue(), function(inRoom) {
      if (inRoom === false) {
        me.$('.game-code-input').val('');
        window.alert('Mrš!');
      } else {
        room = inRoom;
        Utils.switchScreen(networkGameLobbyScreen);
      }
    });
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
  startRules: 'This is your starting color color<br> Change it by moving you mobile left, right, up, down, forward, back',
  targetRules: 'This is your target color. Match the starting color with the target color. Good luck.',

  setListeners: function() {
    this.$('.network-game-button').on('click', this.onNetworkGameClick);
  },

  onScreenShown: function() {
    this.setColors();
  },

  init: function() {
    this.setListeners();
    this.setTopbarText('Waiting for other unicorns...');
    this.$timer = this.$('.timer');
  },

  onNetworkGameClick: function() {
    Utils.switchScreen(optionsScreen);
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

    var targetColor = this.$('.color2');
    var startColor = this.$('.color1');

    var targetRGB = targetColor.css('background-color').split('(')[1].split(',').map(function(x) {
      return parseInt(x);
    });
    var startRGB = startColor.css('background-color').split('(')[1].split(',').map(function(x) {
      return parseInt(x);
    });

    var delta = function(old, newVal) {
      return Math.abs(old - newVal);
    };

    var score = delta(targetRGB[0], startRGB[0]) + delta(targetRGB[1], startRGB[1]) + delta(targetRGB[2], startRGB[2]);

    room.addScore(256 * 3 - score);
  },

  startGame: function() {
    // =======
    //   startGame: function(room, startColor, targetColor, time) {
    //     var me = this;
    //     window.$game = this.$el;

    //     me.$el.on('showStartColor', function() {
    //       me.setStartColor(startColor);
    //     });

    //     me.$el.on('showTargetColor', function() {
    //       me.showTargetColor(targetColor);
    //     });

    //     me.$el.on('showGameScreen', function() {
    //       me.setTargetColor(startColor);
    //       me.hideTopbar();
    //       me.shrinkTargetColor();
    //       me.$el.trigger('game-start-animation-finished');
    //       me.onGameStart();
    //     });
    //   },

    if (room) {
      room.off('game:next', this.onGameNext, this);
      room.off('game:done', this.onGameDone, this);
      room.off('game:finish', this.onGameFinish, this);
      room.off('game:changed', this.onGameChange, this);
    }

    room.on('game:next', this.onGameNext, this);
    room.on('game:done', this.onGameDone, this);
    room.on('game:finish', this.onGameFinish, this);
    room.on('game:changed', this.onGameChange, this);

    startNextGame();
    this.setColors();

    var me = this;

    me.$el.on(PageTransitions.TransitionEvents.transitionEnd, function() {
      setTimeout(function() {
        me.hideTopbar();
        me.shrinkTargetColor();

        Core.colorChanger.setElement(me.$('.color2'));
        me.startGameTimer();
      }, 2500);
    });
  },

  setColors: function() {
    this.setStartColor(startColor);
    this.setTargetColor(targetColor);
  },

  onGameEnd: function() {
    console.log('end');
  },

  onGameNext: function() {
    if (room.isManager()) {
      Utils.switchScreen(gameScreen);
      // gameScreen.startGame();
    }
  },

  onGameDone: function() {
    if (room.isManager()) {
      room.finishGame();
    }
  },

  onGameFinish: function() {
    Utils.switchScreen(resultsScreen);
    // alert('Finish');
    // room.getLeaderboard();
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

  showTargetColor: function(target) {
    $('.color1').css({
      backgroundColor: target
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

/* Results screen */

var resultsScreen = new Screen({
  id: 'results-screen'
});

_.extend(resultsScreen, {
  setListeners: function() {},
  init: function() {
    this.setListeners();
    console.log('init');
  },
  setWinningMessage: function(playerWon) {
    var username = localStorage.getItem('username');
    if (playerWon) {
      this.$el.find('.winning-message').html('Awesome, ' + username + '!<br />You have won this round.');
    } else {
      this.$el.find('.winning-message').html('Awwww, ' + username + ', you didn\'t win :( :(<br />Try your luck in the next round');
    }
  },

  onScreenShown: function() {
    var board = room.getLeaderboard();
    this.setData(board);
    var myPlayer = room.getPlayer();
    this.setWinningMessage(board[0].player.id === myPlayer.id);

    setTimeout(startNextGame, 5000);
  },

  setData: function(data) {
    var playersList = $('<ul>').addClass('scores');
    var playerItem;
    var playerName;
    var playerScore;

    playerName = $('<span>').addClass('player-name');
    playerScore = $('<span>').addClass('player-score');
    playerItem = $('<li>').addClass('player');

    _.each(data, function(player) {
      var newName = playerName.clone().text(player.player.name);
      var newScore = playerScore.clone().text(player.score);
      var newPlayer = playerItem.clone();
      newPlayer.append(newName);
      newPlayer.append(newScore);
      playersList.append(newPlayer);
    });

    $('.players-container').append(playersList);
  }
});

resultsScreen.init();