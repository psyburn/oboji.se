'use strict';

var ObojiSe = {
  currentScreen: null
};

var Screen = function(options) {
  this._init(options);
};

_.extend(Screen.prototype, {
  _init: function(options) {
    this.$el = $('#' + options.id);
  },
  init: function(options) {
    //game logic
  }
}

var Utils = {
  switchScreen: function(currentScreen, nextScreen) {
    nextScreen.on('transitionEnd', function() {
      ObojiSe.currentScreen = nextScreen;
      ObojiSe.currentScreen.init();
    });
  }
};


var gameMenu = new Screen({
  id: 'game-menu'
});
