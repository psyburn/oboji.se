/* global _, GameRoom */

GameRoom = function(remoteRoom, gameInfo, player, manager, netGame) {
  'use strict';

  var listeners = {};

  remoteRoom.on('value', function(snapshot) {
    var newInfo = snapshot.val();

    if (newInfo.started && !gameInfo.started) {
      trigger('game:start');
    }

    gameInfo = newInfo;
    trigger('game:change');
  });

  function startGame() {
    gameInfo.started = true;
    saveRoom();
  }

  function leaveRoom() {
    gameInfo.players = _.without(gameInfo.players, player);
    saveRoom();
  }

  function getLeaderboard() {
    var groups = _.groupBy(gameInfo.scores, player);
    var scores = [];
    _.each(groups, function(group, groupPlayer) {
      var score = 0;
      for (var i = 0; i < group.length; i++) {
        score += group[i].score;
      }
      scores.push({
        player: groupPlayer,
        score: score
      });
    });

    scores.sort(function(s1, s2) {
      return s1.score > s2.score;
    });

    return scores;
  }

  function addScore(score) {
    gameInfo.scores.push({
      player: player,
      score: score
    });
    saveRoom();
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

  function trigger(eventName) {
    listeners[eventName] = listeners[eventName] || [];
    var args = arguments.splice(0, 1);
    for (var i = 0; i < listeners[eventName]; i++) {
      listeners[eventName][i].cb.apply(listeners[eventName][i].scope, args);
    }
  }

  function get(propertyName) {
    return gameInfo[propertyName] || null;
  }

  function set(propertyName, propertyValue) {
    gameInfo[propertyName] = propertyValue;
    saveRoom();
  }

  function saveRoom() {
    gameInfo.lastActive = netGame.getServerTime();
    remoteRoom(gameInfo);
  }

  return {
    startGame: manager ? startGame : undefined,
    leaveRoom: leaveRoom,
    getLeaderboard: getLeaderboard,
    on: on,
    off: off,
    get: get,
    set: set,
    addScore: addScore
  };
};