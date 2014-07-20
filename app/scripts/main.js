'use strict';
window.ObojiSe = {
  currentScreen: null
};

if (!localStorage.getItem('username')) {
  localStorage.setItem('username', window.prompt('Kako se zoveš?'));
}

var GameScreens = {
  gameMenu: 'game-menu',
  optionsScreen: 'options-screen',
  networkGameMenu: 'network-game-menu',
  networkGameLobby: 'network-game-lobby',
  gameScreen: 'game-screen'
};


function setRandomColor() {
  $('.pt-page').each(function() {
    var $this = $(this);
    $this.css({
      backgroundColor: randomColor()
    });
  });
};

window.setInterval(setRandomColor,
  20*1000
);

setRandomColor();


  $(window).on('beforeunload', function() {
    return 'You have attempted to leave this game. You still need workout. Please stay.';
  });
