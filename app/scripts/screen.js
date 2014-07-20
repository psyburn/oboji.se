'use strict';

var Screen = function(options) {
  this._init(options);
  this._setListeners();
};

$.extend(Screen.prototype, {
  _init: function(options) {
    this.$el = $('#' + options.id);
  },
  init: function(options) {
    // game logic
  },
  setListeners: function(options) {
    // listeners
  }
});


var gameMenu = new Screen({
  id: 'game-menu',
  setListeners: function() {
    this.$el.on('click', function(){
      // smth
    })
  }
});
