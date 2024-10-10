// Game setup
const players = [
    { name: 'Player 1', position: 0, points: 0, token: document.getElementById('player1') },
    { name: 'Player 2', position: 0, points: 0, token: document.getElementById('player2') },
    { name: 'Player 3', position: 0, points: 0, token: document.getElementById('player3') },
    { name: 'Player 4', position: 0, points: 0, token: document.getElementById('player4') }
];
let currentPlayer = 0;
let gameEnded = false;
const cells = document.querySelectorAll('.cell');
const diceValueElement = document.getElementById('diceValue');
const turnIndicator = document.getElementById('turnIndicator');
const winnerAnnouncement = document.getElementById('winnerAnnouncement');
const winnerText = document.getElementById('winner');

// PRNG Dice Roll
function rollPRNGDice() {
    return Math.floor(Math.random() * 6) + 1;
}

// DRBG Dice Roll (Using Crypto API)
function rollDRBGDice() {
    let array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return (array[0] % 6) + 1;
}

// 3D Dice Roll Animation
function rollDiceAnimation() {
    const dice = document.getElementById('dice');
    dice.classList.add('dice-roll');
    
    // Remove the class after the animation ends
    setTimeout(() => dice.classList.remove('dice-roll'), 1000);
}

// Move the token of the current player
function moveToken(player, diceValue) {
    player.position += diceValue;

    // Limit position to the last cell
    if (player.position >= cells.length) {
        player.position = cells.length - 1;
    }

    // Move token to the new cell
    cells[player.position].appendChild(player.token);

    // Award points for dice roll
    player.points += diceValue;

    // Check if player has won
    if (player.points >= 30) {
        announceWinner(player.name);
    }
}

// Announce the winner
function announceWinner(winnerName) {
    winnerAnnouncement.classList.remove('hidden');
    winnerText.textContent = winnerName;
    gameEnded = true;  // Stop the game
}

// Update the turn indicator
function updateTurnIndicator() {
    players.forEach(player => player.token.classList.remove('active'));  // Remove active class from all
    players[currentPlayer].token.classList.add('active');  // Highlight the current player
    turnIndicator.textContent = `${players[currentPlayer].name}'s Turn`;
}

// Play turn for current player
function playTurn(diceType) {
    if (gameEnded) return;  // Prevent moves after game ends

    rollDiceAnimation();  // Trigger dice animation

    setTimeout(() => {
        let diceValue;
        if (diceType === 'PRNG') {
            diceValue = rollPRNGDice();
        } else {
            diceValue = rollDRBGDice();
        }

        diceValueElement.textContent = diceValue;

        // Move the current player's token
        moveToken(players[currentPlayer], diceValue);

        // Switch to the next player
        currentPlayer = (currentPlayer + 1) % players.length;
        updateTurnIndicator();
    }, 1000); // Delay for dice animation
}

// Reset the game
function resetGame() {
    players.forEach(player => {
        player.position = 0;
        player.points = 0;
        document.getElementById('cell0').appendChild(player.token);  // Move tokens back to the start
    });
    currentPlayer = 0;
    gameEnded = false;
    winnerAnnouncement.classList.add('hidden');  // Hide the winner announcement
    diceValueElement.textContent = '0';  // Reset dice value display
    updateTurnIndicator();  // Set the turn back to Player 1
}

// Event Listeners for Dice Roll
document.getElementById('rollDice').addEventListener('click', () => playTurn('PRNG'));
document.getElementById('rollDiceDRBG').addEventListener('click', () => playTurn('DRBG'));

// Reset Button
document.getElementById('resetGame').addEventListener('click', resetGame);

// Initialize game
updateTurnIndicator();
