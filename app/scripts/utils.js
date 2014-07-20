var Utils = {
  switchScreen: function(nextScreen) {
    nextScreen.$el.on('transitionEnd', function() {
      ObojiSe.currentScreen = nextScreen;
      if ('onScreenShown' in ObojiSe.currentScreen) {
        ObojiSe.currentScreen.onScreenShown();
      }
    });
    PageTransitions.goToScreen(nextScreen);
  },

  toggleLoadingScreen: function() {
    $('.overlay').toggle();
  }
};