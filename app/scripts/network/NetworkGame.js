/* global _, Firebase, NetworkGame, GameRoom */

NetworkGame = function(player) {
  'use strict';

  var keyChars = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  function generateKey() {
    var key = '';
    for (var i = 0; i < 5; i++) {
      var rand = Math.floor(Math.random() * keyChars.length);
      key += keyChars[rand];
    }
    return key;
  }

  if (typeof player === 'string') {
    player = {
      name: player
    };
  }
  player.id = generateKey() + '-' + (+new Date());

  var rootPath = 'https://oboji-se.firebaseio.com/';

  var publicRoomList = new Firebase(rootPath + 'public-rooms');
  var remoteRooms = new Firebase(rootPath + 'rooms');
  var offsetRef = new Firebase(rootPath + '.info/serverTimeOffset');

  var timeOffset;
  offsetRef.on('value', function(snap) {
    timeOffset = snap.val();
  });

  var activeRoom = null;
  var publicRooms = [];

  publicRoomList.on('child_added', function(snapshot) {
    publicRooms.push(snapshot.val());
  });

  function getServerTime() {
    return new Date().getTime() + timeOffset;
  }

  function createRoom(options) {
    options.roomCode = generateKey();
    options.created = options.lastActive = getServerTime();
    options.manager = player;
    options.players = { 0: player };
    options.scores = {};
    options.games = {};
    options.expectedScores = 0;
    if (options.public) {
      var room = {
        roomCode: options.roomCode,
        lastActive: options.lastActive
      };
      publicRoomList.push(room);
      publicRooms.push(room);
    }
    remoteRooms.child(options.roomCode).set(options);

    if (activeRoom) {
      activeRoom.leaveRoom();
    }
    activeRoom = new GameRoom(new Firebase(rootPath + 'rooms/' + options.roomCode), options, player, true, this);
    return activeRoom;
  }

  function getPublicRooms(cb) {
    var publicRoomsInfo = [];
    var publicRoomArray = _.clone(publicRooms);
    var lastActiveLimit = getServerTime() - 5 * 60 * 1000;
    
    function loadRoom() {
      var publicRoom = publicRoomArray.shift();
      if (publicRoom) {
        getRoomInfo(publicRoom.roomCode, _.bind(function(room) {
          var playerCount = _.values(room.players || []).length;
          if (playerCount < room.maxPlayers && playerCount > 0 && !room.started && room.lastActive > lastActiveLimit) {
            publicRoomsInfo.push(room);
          }
          loadRoom();
        }, this));
      } else {
        cb(publicRoomsInfo);
      }
    }

    loadRoom();
  }

  function joinRoom(roomCode, cb) {
    if (activeRoom && activeRoom.roomCode === roomCode) {
      cb(activeRoom);
    } else {
      getRoomInfo(roomCode, _.bind(function(room) {
        if (!room) {
          return cb(false);
        }
        if (activeRoom) {
          activeRoom.leaveRoom();
        }

        var key = ((+new Date()) + '-' + Math.random()).replace('0.', ''); // A very stupid way to do this, but it should work without much logic
        room.players[key] = player;
        activeRoom = new GameRoom(new Firebase(rootPath + 'rooms/' + roomCode), room, player, false, this);
        activeRoom.save.call(activeRoom);
        cb(activeRoom);
      }, this));
    }
  }

  function getRoomInfo(roomCode, cb) {
    var room = new Firebase(rootPath + 'rooms/' + roomCode);
    room.once('value', _.bind(function(snapshot) {
      cb(snapshot.val());
    }, this));
  }

  return {
    getServerTime: getServerTime,
    createRoom: createRoom,
    getPublicRooms: getPublicRooms,
    joinRoom: joinRoom
  };
};