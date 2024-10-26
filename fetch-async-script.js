
// Function to fetch a random word from an API
async function fetchRandomWord() {
    try {
        const response = await fetch('https://random-word-api.herokuapp.com/word?length=5'); // Replace with the actual API URL
        const data = await response.json();

        return data[0]; // Adjust based on the API response structure
    } catch (error) {
        console.error('Error fetching the word:', error);
        return null;
    }
}

// Initialize the game
async function initializeGame() {
    const word = await fetchRandomWord();
    if (word) {
        return word.toLowerCase();
        // Start the game logic here if needed
    } else {
        console.error('Failed to fetch the target word.');
    }
}

// Call the initializeGame function to start the game
const targetWord = initializeGame().then((word) => word);
console.log('TARGET WORD:', targetWord);
async function startGame() {
    const targetWord = await initializeGame();
    console.log('TARGET WORD:', targetWord);

    const words = ["apple", "grape", "peach", "berry", "melon"];
    // const targetWord = words[Math.floor(Math.random() * words.length)];
    let attempts = 0;
    const maxAttempts = 6;
    let currentRow = 0;
    let currentInputIndex = 0;
    let rows = document.querySelectorAll('.game-container .row');
    let tiles = rows[currentRow].querySelectorAll('.tile');

    function handleKeyPress(letter) {
        const isLetter = /^[a-zA-Z]$/.test(letter); //regex to check if the input is a letter

        if (currentInputIndex < tiles.length && isLetter) {
            tiles[currentInputIndex].innerText = letter;
            currentInputIndex++;
        }
    }

    function updateKeyStyle(letter, status) {
        const key = document.querySelector(`.key[data-key="${letter.toUpperCase()}"]`);
        if (key) {
            key.classList.remove('correct', 'present', 'absent');
            key.classList.add(status);
        }
    }

    // vector de aparitii
    function countLetterOccurrences(word) {
        const letterCount = {};
        for (const letter of word) {
            if (letterCount[letter]) {
                letterCount[letter]++;
            } else {
                letterCount[letter] = 1;
            }
        }
        return letterCount;
    }

    function handleEnterKey() {
        if (currentInputIndex === tiles.length) {
            const inputWord = Array.from(tiles).map(tile => tile.innerText).join('').toLowerCase();
            const targetLetterCount = countLetterOccurrences(targetWord);

            console.log(inputWord);
            console.log('TARGET WORD:', targetWord);

            if (inputWord === targetWord) {
                console.log('Success! You guessed the word.');
                tiles.forEach(tile => {
                    tile.style.backgroundColor = 'green';
                    updateKeyStyle(tile.innerText, 'correct');
                });
            } else {
                for (let i = 0; i < inputWord.length; i++) {
                    const letter = inputWord[i];
                    if (letter === targetWord[i]) {
                        tiles[i].style.backgroundColor = 'green';
                        updateKeyStyle(letter, 'correct');
                        targetLetterCount[letter]--;
                    } else if (targetWord.includes(letter) && targetLetterCount[letter] > 0) {
                        tiles[i].style.backgroundColor = 'yellow';
                        updateKeyStyle(letter, 'present');
                        targetLetterCount[letter]--;
                    } else {
                        tiles[i].style.backgroundColor = 'gray';
                        updateKeyStyle(letter, 'absent');
                    }
                }
                currentRow++;
                if (currentRow < rows.length) {
                    currentInputIndex = 0;
                    tiles = rows[currentRow].querySelectorAll('.tile');
                } else {
                    console.log('All rows completed');
                }
            }
        }
    }

    function handleDeleteKey() {
        if (currentInputIndex > 0) {
            currentInputIndex--;
            tiles[currentInputIndex].innerText = '';
        }
    }

    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.addEventListener('click', () => {
            const letter = key.innerText;
            handleKeyPress(letter);
        });
    });

    document.addEventListener('keydown', (event) => {
        const letter = event.key.toUpperCase();
        if (event.key === 'Enter') {
            handleEnterKey();
        } else if (event.key === 'Backspace') {
            handleDeleteKey();
        } else if (letter >= 'A' && letter <= 'Z') {
            handleKeyPress(letter);
        }
    });
}

// Start the game
startGame();
