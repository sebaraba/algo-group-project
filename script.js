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

// Close drawer functionality
document.getElementById('close-drawer').addEventListener('click', () => {
    document.getElementById('result-drawer').classList.remove('open');
});

