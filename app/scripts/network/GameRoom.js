/* global _, GameRoom */

GameRoom = function(remoteRoom, gameInfo, player, manager, netGame) {
  'use strict';

  var listeners = {};
  var scoreExpected = false;

  function trigger(eventName) {
    listeners[eventName] = listeners[eventName] || [];
    var args = _.toArray(arguments).slice(1);
    for (var i = 0; i < listeners[eventName]; i++) {
      listeners[eventName][i].cb.apply(listeners[eventName][i].scope, args);
    }
  }

  on('game:next', function() {
    scoreExpected = true;
  });
  on('game:done', function() {
    scoreExpected = false;
  });

  remoteRoom.on('value', _.bind(function(snapshot) {
    var newInfo = snapshot.val() || {};

    if (newInfo.started && !gameInfo.started) {
      trigger('game:start');
    }
    if (!newInfo.started && gameInfo.started) {
      trigger('game:finish');
    }

    var newGames = _.values(newInfo.games || {});
    var oldGames = _.values(gameInfo.games || {});

    if (newGames.length > oldGames.length) {
      var game = newInfo.games.slice(-1);
      trigger('game:next', game.startColor, game.goalColor);
    }

    var newScores = _.values(newInfo.scores || {});
    var oldScores = _.values(gameInfo.scores || {});

    if (newScores.length > oldScores.length &&
        newScores.length === newInfo.expectedScores) {
      trigger('game:done');
    }

    gameInfo = newInfo;
    trigger('game:change');
  }, this));

  function startNextGame(startColor, goalColor) {
    gameInfo.games = gameInfo.games || {};
    var gameCount = _.values(gameInfo.games).length;
    gameInfo.started = true;
    var game = {
      startColor: startColor,
      goalColor: goalColor
    };
    gameInfo.games[gameCount] = game;
    gameInfo.expectedScores += _.values(gameInfo.players || []).length;
    saveRoom(_.bind(function() {
      if (!gameCount) {
        trigger('game:start');
      }
      trigger('game:next', game.startColor, game.goalColor);
    }, this));
  }

  function leaveRoom() {
    gameInfo.players = _.reject(gameInfo.players, player);
    saveRoom();
    if (scoreExpected) {
      addScore(0);
    }
  }

  function getLeaderboard() {
    var groups = _.groupBy(_.values(gameInfo.scores || []), function(score) {
      return score.player.id;
    });
    var scores = [];
    _.each(groups, function(group) {
      var score = 0;
      for (var i = 0; i < group.length; i++) {
        score += group[i].score;
      }
      scores.push({
        player: group[0].player,
        score: score
      });
    });

    scores.sort(function(s1, s2) {
      return s1.score > s2.score;
    });

    return scores;
  }

  function addScore(score) {
    remoteRoom.child('scores').push({
      player: player,
      score: score
    }); // Will this work?
  }

  function on(eventName, cb, scope) {
    listeners[eventName] = listeners[eventName] || [];
    listeners[eventName].push({
      cb: cb,
      scope: scope
    });
  }

  function off(eventName, cb, scope) {
    listeners[eventName] = listeners[eventName] || [];
    var listener = _.findWhere(listeners[eventName], {
      cb: cb,
      scope: scope
    });
    if (listener) {
      listeners[eventName] = _.without(listeners[eventName], listener);
    }
  }

  function get(propertyName) {
    return gameInfo[propertyName] || null;
  }

  function set(propertyName, propertyValue) {
    gameInfo[propertyName] = propertyValue;
    saveRoom();
  }

  function saveRoom(cb) {
    cb = cb || function() {};
    gameInfo.lastActive = netGame.getServerTime();
    remoteRoom.set(gameInfo, cb);
  }

  return {
    leaveRoom: leaveRoom,
    getLeaderboard: getLeaderboard,
    on: on,
    off: off,
    get: get,
    set: set,
    addScore: addScore,
    startNextGame: manager ? startNextGame : undefined
  };
};