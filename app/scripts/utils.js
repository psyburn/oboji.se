var Utils = {
  switchScreen: function(currentScreen, nextScreen) {
    nextScreen.on('transitionEnd', function() {
      ObojiSe.currentScreen = nextScreen;
      ObojiSe.currentScreen.init();
    });
  }
};
