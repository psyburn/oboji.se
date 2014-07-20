/* global Firebase, NetworkGame, GameRoom */

NetworkGame = function(player) {
  'use strict';

  var rootPath = 'https://oboji-se.firebaseio.com/';

  var publicRoomList = new Firebase(rootPath + 'public-rooms');
  var remoteRooms = new Firebase(rootPath + 'rooms');
  var offsetRef = new Firebase(rootPath + '.info/serverTimeOffset');

  var timeOffset;
  offsetRef.on('value', function(snap) {
    timeOffset = snap.val();
  });

  var keyChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

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
    options.players = [player];
    options.scores = [];
    options.games = [];
    if (options.public) {
      publicRoomList.push({
        roomCode: options.roomCode,
        lastActive: options.lastActive
      });
    }
    remoteRooms.set(options);

    if (activeRoom) {
      activeRoom.leaveRoom();
    }
    activeRoom = new GameRoom(new Firebase(rootPath + 'rooms/' + options.roomCode), options, player, true, this);
    return activeRoom;
  }

  function getPublicRooms(cb) {
    var availablePublicRooms = [];
    var publicRoomsInfo = [];
    var lastActiveLimit = getServerTime() - 5 * 60 * 1000;
    for (var i = 0; i < publicRooms.length; i++) {
      if (publicRooms.lastActive > lastActiveLimit) {
        availablePublicRooms.push(publicRooms.roomCode);
      }
    }

    function loadRoom() {
      var roomCode = availablePublicRooms.shift();
      if (roomCode) {
        getRoomInfo(roomCode, function(room) {
          if (room.players.length < room.maxPlayers) {
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
        activeRoom = new GameRoom(new Firebase(rootPath + 'rooms/' + roomCode), room, player, false, this);
        cb(activeRoom);
      });
    }
  }

  function getRoomInfo(roomCode, cb) {
    var room = new Firebase(rootPath + 'rooms/' + roomCode);
    room.on('value', function(snapshot) {
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