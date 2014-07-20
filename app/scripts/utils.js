var Utils = {
  switchScreen: function(nextScreen) {
    nextScreen.$el.on('transitionEnd', function() {
      ObojiSe.currentScreen = nextScreen;
    });
    nextScreen.init();
    PageTransitions.goToScreen(nextScreen);
  }
};
