/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

/*
YOUR 3 CHALLENGES
Change the game to follow these rules:

1. A player looses his ENTIRE score when he rolls two 6 in a row. After that, it's the next player's turn. (Hint: Always save the previous dice roll in a separate variable)
2. Add an input field to the HTML where players can set the winning score, so that they can change the predefined score of 100. (Hint: you can read that value with the .value property in JavaScript. This is a good oportunity to use google to figure this out :)
3. Add another dice to the game, so that there are two dices now. The player looses his current score when one of them is a 1. (Hint: you will need CSS to position the second dice, so take a look at the CSS code for the first one.)
*/

var scores, roundScore, activePlayer, gamePlaying, previousDice, winningScore;

init();

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function toggleDices(displayType) {
    document.getElementsByClassName('dice')[0].style.display = displayType;
    document.getElementsByClassName('dice')[1].style.display = displayType;
}

document.querySelector('.btn-roll').addEventListener('click', () => {
    if (!gamePlaying) return;
    var dice1 = rollDice();
    var dice2 = rollDice();
    toggleDices('block');
    document.querySelector('.dice1').src = 'dice-' + dice1 + '.png';
    document.querySelector('.dice2').src = 'dice-' + dice2 + '.png';
    
    if ((dice1 === 6 || dice2 === 6) && previousDice) {
        scores[activePlayer] = 0;
        document.querySelector('#score-' + activePlayer).textContent = '0';
        nextPlayer();
    } else if (dice1 !== 1 && dice2 !== 1) {
        roundScore += dice1 + dice2;
        document.querySelector('#current-' + activePlayer).textContent = roundScore;
        previousDice = dice1 === 6 || dice2 === 6;
    } else {
        nextPlayer();
    }

});

document.querySelector('.btn-hold').addEventListener('click', () => {
    if (!gamePlaying) return;
    scores[activePlayer] += roundScore;
    document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

    if (scores[activePlayer] >= winningScore) {
        document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
        toggleDices('none');
        document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
        document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
        gamePlaying = false;
    } else {
        nextPlayer();
    }

});

function nextPlayer() {
    activePlayer === 0? activePlayer = 1: activePlayer = 0;
    roundScore = 0;
    previousDice = false;

    document.getElementById('current-0').textContent = 0;
    document.getElementById('current-1').textContent = 0;

    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');

    toggleDices('none');
}

document.querySelector('.btn-new').addEventListener('click', init);

function init() {
    scores = [0, 0];
    activePlayer = 0;
    roundScore = 0;
    gamePlaying = true;
    previousDice = false;
    winningScore = parseInt(document.querySelector('.in-goal').value) || 100;
    console.log('winning score set to ' + winningScore);

    document.querySelector('.dice').style.display = 'none';
    toggleDices('none');

    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';

    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
}

document.querySelector('.in-goal').addEventListener('change', (e) => {
    winningScore = parseInt(e.target.value) || 100;
    init();
});
