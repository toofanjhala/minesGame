document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const message = document.getElementById('message');
    const moneyDisplay = document.getElementById('moneyDisplay');
    const startGameButton = document.getElementById('startGame');
    const bombsInput = document.getElementById('bombs');
    const amountInput = document.getElementById('amount');

    let currentAmount = 0;
    let bombIndices;
    let gameStarted = false;

    startGameButton.addEventListener('click', startGame);

    function startGame() {
        const numBombs = parseInt(bombsInput.value);
        const amount = parseInt(amountInput.value);

        if (isNaN(numBombs) || numBombs < 2 || numBombs > 12) {
            alert('Please select a valid number of bombs.');
            return;
        }

        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        bombIndices = getRandomBombIndices(numBombs);
        currentAmount = amount;
        gameStarted = true;

        setupBoard();
        gameBoard.classList.remove('hidden');
        gameBoard.classList.remove('disabled');
    }

    function setupBoard() {
        gameBoard.innerHTML = '';
        message.textContent = '';
        moneyDisplay.textContent = `Money: $${currentAmount}`;
        
        const cells = Array(25).fill('diamond');
        bombIndices.forEach(index => cells[index] = 'bomb');
        
        cells.forEach((cell, index) => {
            const div = document.createElement('div');
            div.classList.add('cell');
            div.dataset.type = cell;
            div.addEventListener('click', () => handleCellClick(div, cell));
            gameBoard.appendChild(div);
        });
    }

    function getRandomBombIndices(numBombs) {
        const indices = Array.from({ length: 25 }, (_, i) => i);
        for (let i = indices.length - 1; i > indices.length - 1 - numBombs; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        return indices.slice(-numBombs);
    }

    function handleCellClick(cell, type) {
        if (!gameStarted || cell.classList.contains('bomb') || cell.classList.contains('diamond')) {
            return; // Cell already clicked or game not started
        }
        
        if (type === 'bomb') {
            cell.classList.add('bomb');
            cell.textContent = '💣';
            currentAmount = 0;
            moneyDisplay.textContent = `Money: $${currentAmount}`;
            message.textContent = `Game over! You hit a bomb.`;
            gameBoard.classList.add('disabled');
            bombsInput.value = ''; // Reset bomb selection
            amountInput.value = 0; // Reset amount input
            gameStarted = false;
        } else {
            cell.classList.add('diamond');
            cell.textContent = '💎';
            currentAmount += 10;
            moneyDisplay.textContent = `Money: $${currentAmount}`;
            message.textContent = `Good choice! Your bet amount is now: $${currentAmount}`;
        }

        cell.removeEventListener('click', () => handleCellClick(cell, type));
    }
});
