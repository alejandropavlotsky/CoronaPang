window.onload = () => {
	document.getElementById('start-button').onclick = () => {
		document.getElementById('game-intro').style.display = 'none';
		document.getElementById('canvas').style.display = 'block';
		game.init('canvas');
	};
};
