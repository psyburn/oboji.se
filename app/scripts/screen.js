var Screen = function() {
  return {
    init: function() {
      $('.screen').hide();
      $('#game-menu').show();
    },

    changeScreen: function(screenID) {
      $('.screen').hide();
      $('#' + screenID).show();
    }
  }
}

var menuScreen = new Screen();
menuScreen.init();
