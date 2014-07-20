window.ObojiSe = {
  currentScreen: null
};

console.log('\'Allo \'Allo!');
var GameScreens = {
  gameMenu: 'game-menu',
  optionsScreen: 'options-screen',
  networkGameMenu: 'network-game-menu',
  networkGameLobby: 'network-game-lobby',
  gameScreen: 'game-screen'
};

$(function() {
  PageTransitions.switchPage(GameScreens.gameScreen);

  setTimeout(function() {
    $('.color1').css({
      backgroundColor: 'orangered'
    });
  }, 500);

  setTimeout(function() {
    $('.game-topbar').addClass('hide');
    $('.color1').addClass('shrink');
  }, 3000);
});
