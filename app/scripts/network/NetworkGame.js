/* global Firebase, NetworkGame, GameRoom */

NetworkGame = function(player) {
  'use strict';

  var keyChars = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

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
      publicRoomList.push({
        roomCode: options.roomCode,
        lastActive: options.lastActive
      });
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
    var lastActiveLimit = getServerTime() - 5 * 60 * 1000;
    
    function loadRoom() {
      var roomCode = publicRooms.shift();
      if (roomCode) {
        getRoomInfo(roomCode, function(room) {
          if (_.values(room.players || []).length < room.maxPlayers && !room.started && room.lastActive > lastActiveLimit) {
            publicRoomsInfo.push(room);
          }
        });
      } else {
        cb(publicRoomsInfo);
      }
    }

    loadRoom();
  }

  function joinRoom(roomCode, cb) {
    if (activeRoom.roomCode === roomCode) {
      cb(activeRoom);
    } else {
      getRoomInfo(roomCode, function(room) {
        if (activeRoom) {
          activeRoom.leaveRoom();
        }

        var key = (+new Date()) + '-' + Math.random(); // A very stupid way to do this, but it should work without much logic
        room.players[key] = player;
        activeRoom = new GameRoom(new Firebase(rootPath + 'rooms/' + roomCode), room, player, false, this);
        cb(activeRoom);
      });
    }
  }

  function getRoomInfo(roomCode, cb) {
    var room = new Firebase(rootPath + 'rooms/' + roomCode);
    room.once('value', function(snapshot) {
      cb(snapshot.val());
    });
  }

  function generateKey() {
    var key = '';
    for (var i = 0; i < 5; i++) {
      var rand = Math.floor(Math.random() * keyChars.length);
      key += keyChars[rand];
    }
    return key;
  }

  return {
    getServerTime: getServerTime,
    createRoom: createRoom,
    getPublicRooms: getPublicRooms,
    joinRoom: joinRoom
  };
};