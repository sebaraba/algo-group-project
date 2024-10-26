const words = ["apple", "grape", "peach", "berry", "melon"];
const targetWord = words[Math.floor(Math.random() * words.length)];
let attempts = 0; // Variable to track the number of attempts
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

function handleDeleteKey() {
    if (currentInputIndex > 0) {
        currentInputIndex--;
        tiles[currentInputIndex].innerText = '';
    }
}

function handleEnterKey() {
    if (currentInputIndex === tiles.length) {
        console.log('Enter key pressed', tiles);
        const inputWord = Array.from(tiles).map(tile => tile.innerText).join('').toLowerCase();
        console.log('Input word:', inputWord);
        const targetLetterCount = countLetterOccurrences(targetWord);

        console.log(inputWord);
        console.log('TARGET WORD:', targetWord);

        attempts++; // Increment attempts on each word submission
        if (inputWord === targetWord) {
            console.log(`Success! You guessed the word in ${attempts} attempts.`);
            tiles.forEach(tile => {
                tile.style.backgroundColor = 'green';
                updateKeyStyle(tile.innerText, 'correct');
            });

            const initial = {attempts: [0, 0, 0, 0, 0, 0]};
            const cookie = getCookie('attempts');
            let attemptsArray = initial.attempts;

            if (cookie) {
                attemptsArray = JSON.parse(cookie).attempts;
            }

            if (attempts <= attemptsArray.length) {
                attemptsArray[attempts - 1]++;
            }

            setCookie('attempts', JSON.stringify({attempts: attemptsArray}), 7);

            // Display the drawer with results
            const drawer = document.getElementById('result-drawer');
            const resultList = document.getElementById('result-list');

            attemptsArray.forEach((count, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = `Words guessed in ${index + 1} attempts: ${count}`;
                resultList.appendChild(listItem);
            });

            drawer.classList.add('open');
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

// Function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') cookie = cookie.substring(1, cookie.length);
        if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length, cookie.length);
    }
    return null;
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
// Close drawer functionality
document.getElementById('close-drawer').addEventListener('click', () => {
    document.getElementById('result-drawer').classList.remove('open');
});

