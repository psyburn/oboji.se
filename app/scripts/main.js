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