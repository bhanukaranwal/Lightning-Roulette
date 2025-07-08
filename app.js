document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const balanceElement = document.getElementById('balance');
    const messageElement = document.getElementById('message');
    const spinButton = document.getElementById('spin-button');
    const clearButton = document.getElementById('clear-button');
    const bettingArea = document.getElementById('betting-area');
    const historyElement = document.getElementById('history');
    const wheel = document.querySelector('.roulette-wheel');
    const chipsContainer = document.querySelector('.chips');

    // Game State
    let balance = 1000;
    let bets = {}; // { 'betType-value': amount } e.g., { 'straight-10': 50, 'color-red': 100 }
    let currentChipValue = 50;
    let spinning = false;

    // Game Constants
    const numbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

    function createBettingTable() {
        // Main grid for numbers
        const numbersGrid = document.createElement('div');
        numbersGrid.className = 'numbers-grid';

        // Zero
        const zeroCell = document.createElement('div');
        zeroCell.className = 'number-cell zero-cell';
        zeroCell.innerText = '0';
        zeroCell.dataset.betType = 'straight';
        zeroCell.dataset.betValue = '0';
        numbersGrid.appendChild(zeroCell);

        // 1-36
        for (let i = 1; i <= 36; i++) {
            const cell = document.createElement('div');
            cell.className = 'number-cell';
            if (redNumbers.includes(i)) cell.classList.add('red');
            if (blackNumbers.includes(i)) cell.classList.add('black');
            cell.innerText = i;
            cell.dataset.betType = 'straight';
            cell.dataset.betValue = i;
            numbersGrid.appendChild(cell);
        }

        // Outside Bets
        const outsideBets = document.createElement('div');
        outsideBets.className = 'outside-bets';
        
        const betOptions = [
            { type: 'dozen', value: '1-12', text: '1st 12' }, { type: 'dozen', value: '13-24', text: '2nd 12' }, { type: 'dozen', value: '25-36', text: '3rd 12' },
            { type: 'column', value: '1', text: '2 to 1' }, { type: 'column', value: '2', text: '2 to 1' }, { type: 'column', value: '3', text: '2 to 1' },
            { type: 'even-odd', value: 'even', text: 'Even' }, { type: 'even-odd', value: 'odd', text: 'Odd' },
            { type: 'color', value: 'red', text: 'Red' }, { type: 'color', value: 'black', text: 'Black' }
        ];

        betOptions.forEach(opt => {
            const betDiv = document.createElement('div');
            betDiv.className = 'bet-option';
            betDiv.dataset.betType = opt.type;
            betDiv.dataset.betValue = opt.value;
            betDiv.innerText = opt.text;
            outsideBets.appendChild(betDiv);
        });
        
        numbersGrid.appendChild(outsideBets);
        bettingArea.appendChild(numbersGrid);

        // Add event listeners for all betting cells
        document.querySelectorAll('[data-bet-type]').forEach(cell => {
            cell.addEventListener('click', () => placeBet(cell.dataset.betType, cell.dataset.betValue, cell));
        });
    }

    function placeBet(type, value, element) {
        if (spinning) return;
        if (balance < currentChipValue) {
            showMessage("Insufficient balance!");
            return;
        }

        balance -= currentChipValue;
        const betKey = `${type}-${value}`;
        bets[betKey] = (bets[betKey] || 0) + currentChipValue;
        
        updateBalance();
        showMessage(`Bet $${currentChipValue} on ${value}`);
        
        // Add a visual chip to the element
        const chip = document.createElement('div');
        chip.className = 'bet-chip';
        chip.innerText = `$${bets[betKey]}`;
        
        // Remove old chip if exists
        const oldChip = element.querySelector('.bet-chip');
        if (oldChip) oldChip.remove();
        
        element.appendChild(chip);
    }
    
    function spin() {
        if (spinning || Object.keys(bets).length === 0) {
            showMessage("Please place a bet first!");
            return;
        }
        spinning = true;
        clearHighlights();

        const lightningNumbers = generateLightningNumbers();
        highlightLightningNumbers(lightningNumbers);

        const winningNumber = numbers[Math.floor(Math.random() * numbers.length)];
        const winningAngle = -(numbers.indexOf(winningNumber) * (360 / numbers.length));
        const rotation = 360 * 5 + winningAngle; // 5 full spins + final position

        wheel.style.transform = `rotate(${rotation}deg)`;

        setTimeout(() => {
            calculateWinnings(winningNumber, lightningNumbers);
            updateHistory(winningNumber);
            spinning = false;
        }, 4000);
    }

    function calculateWinnings(winningNumber, lightningNumbers) {
        let totalWinnings = 0;
        let winMessage = `Winning Number: ${winningNumber}. No wins.`;

        for (const betKey in bets) {
            const [type, value] = betKey.split('-');
            const betAmount = bets[betKey];
            let isWin = false;
            let payoutMultiplier = 0;

            switch (type) {
                case 'straight':
                    if (parseInt(value) === winningNumber) {
                        isWin = true;
                        // Lightning win check
                        if (lightningNumbers[winningNumber]) {
                            payoutMultiplier = lightningNumbers[winningNumber];
                            winMessage = `⚡ LIGHTNING WIN on ${winningNumber}! You won $${betAmount * payoutMultiplier}!`;
                        } else {
                            payoutMultiplier = 36; // Standard straight-up
                        }
                    }
                    break;
                case 'color':
                    if (value === 'red' && redNumbers.includes(winningNumber)) isWin = true;
                    if (value === 'black' && blackNumbers.includes(winningNumber)) isWin = true;
                    payoutMultiplier = 2;
                    break;
                case 'even-odd':
                    if (winningNumber !== 0) {
                        if (value === 'even' && winningNumber % 2 === 0) isWin = true;
                        if (value === 'odd' && winningNumber % 2 !== 0) isWin = true;
                    }
                    payoutMultiplier = 2;
                    break;
                // Add cases for dozen, column etc.
            }
            
            if (isWin) {
                const winAmount = betAmount * payoutMultiplier;
                totalWinnings += winAmount;
                if (winMessage.includes('No wins')) { // Don't overwrite lightning message
                    winMessage = `You won $${winAmount} on ${type} ${value}!`;
                }
            }
        }
        
        balance += totalWinnings;
        showMessage(winMessage);
        updateBalance();
        clearBets(false); // Clear bets but don't refund
    }
    
    function clearBets(refund = true) {
        if (spinning) return;
        if (refund) {
            const totalBetValue = Object.values(bets).reduce((sum, amount) => sum + amount, 0);
            balance += totalBetValue;
        }
        bets = {};
        document.querySelectorAll('.bet-chip').forEach(chip => chip.remove());
        updateBalance();
        showMessage("Bets cleared.");
    }

    // Helper functions (generateLightningNumbers, highlightLightningNumbers, etc.)
    function generateLightningNumbers() {
        const lightning = {};
        const numCount = Math.floor(Math.random() * 5) + 1;
        const availableNumbers = [...Array(37).keys()];
        for (let i = 0; i < numCount; i++) {
            const numIndex = Math.floor(Math.random() * availableNumbers.length);
            const number = availableNumbers.splice(numIndex, 1)[0];
            const multiplier = [50, 100, 200, 500, 1000][Math.floor(Math.random() * 5)];
            lightning[number] = multiplier;
        }
        return lightning;
    }

    function highlightLightningNumbers(lightningNumbers) {
        for (const number in lightningNumbers) {
            const cell = document.querySelector(`.number-cell[data-bet-value='${number}']`);
            if (cell) {
                cell.classList.add('lightning');
                cell.title = `Lightning Multiplier: ${lightningNumbers[number]}x`;
            }
        }
    }
    
    function clearHighlights() {
        document.querySelectorAll('.lightning').forEach(el => el.classList.remove('lightning'));
    }

    function updateBalance() { balanceElement.innerText = balance; }
    function showMessage(msg) { messageElement.innerText = msg; }

    function updateHistory(number) {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerText = number;
        if (redNumbers.includes(number)) item.classList.add('red');
        else if (blackNumbers.includes(number)) item.classList.add('black');
        else item.classList.add('zero');
        
        historyElement.prepend(item);
        if (historyElement.children.length > 10) {
            historyElement.lastChild.remove();
        }
    }

    // Event Listeners
    chipsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('chip')) {
            document.querySelector('.chip.active').classList.remove('active');
            e.target.classList.add('active');
            currentChipValue = parseInt(e.target.dataset.value);
        }
    });
    
    spinButton.addEventListener('click', spin);
    clearButton.addEventListener('click', () => clearBets(true));

    // Initialize Game
    createBettingTable();
    updateBalance();
});
