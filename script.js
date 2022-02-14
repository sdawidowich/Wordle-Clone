function makeGameboard() {
    const gameboard = document.querySelector('#gameboard');

    for (let i = 0; i < 30; i++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.dataset.rowpos = i % 5;
        gameboard.appendChild(tile);
    }
}

function makeKeyboard() {
    const keyboard = document.querySelectorAll('#keyboard .row');

    let letters = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"]

    for (let letter in letters) {
        const button = document.createElement("button");
        button.classList.add("keyboard-btns");
        button.dataset.key = letters[letter];
        button.textContent = letters[letter];
        if (letter < 10) keyboard[0].appendChild(button);
        else if (letter < 19) keyboard[1].appendChild(button);
        else keyboard[2].appendChild(button);
    }
}


function game() {
    function readTextFile(filePath) {
        let result = null;
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", filePath, false);
        xmlHttp.send();
        if (xmlHttp.status==200) {
            result = xmlHttp.responseText;
        }
        return result;
    }

    function checkValidWord(word) {
        for (let i = 0; i < validWords.length; i++) {
            if (word === validWords[i]) {
                return true;
            }
        }
    }

    function updateBoard(letter, action) {
        if (action === "add") {
            const tile = document.querySelectorAll(".tile");
            tile[numEnteredLetters + 5 * numAttempts].textContent = letter;
            tile[numEnteredLetters + 5 * numAttempts].classList.add("filled");
        }
        else if (action === "remove") {
            const tile = document.querySelectorAll(".tile");
            tile[numEnteredLetters + 5 * numAttempts].textContent = "";
            tile[numEnteredLetters + 5 * numAttempts].classList.remove("filled");
        }
    }
    
    function giveFeedback(word) {
        const tile = document.querySelectorAll(".tile");
        const keyboard = document.querySelectorAll(".keyboard-btns");
        const keyboardArr = Array.from(keyboard);
        let wordArr = word.split("");
        let solutionArr = solutionWord.split("");

        for (let i = 0; i < 5; i++) {
            let foundMatch = false;
            for (let j = 0; j < 5; j++) {
                if (wordArr[i] === solutionArr[j] && i === j) {
                    tile[i + 5 * numAttempts].classList.add("green");
                    keyboard[keyboardArr.findIndex((element) => element.dataset.key === wordArr[i].toLocaleUpperCase())].classList.add("green");
                    solutionArr[j] = " ";
                    foundMatch = true;
                    break;
                }
                else if (wordArr[i] === solutionArr[j]) {
                    tile[i + 5 * numAttempts].classList.add("yellow");
                    keyboard[keyboardArr.findIndex((element) => element.dataset.key === wordArr[i].toLocaleUpperCase())].classList.add("yellow");
                    solutionArr[j] = " ";
                    foundMatch = true;
                    break;
                }
            }
            if (!foundMatch) {
                tile[i + 5 * numAttempts].classList.add("grey");
                keyboard[keyboardArr.findIndex((element) => element.dataset.key === wordArr[i].toLocaleUpperCase())].classList.add("grey");
            }
        }
        if (word === solutionWord) {
            console.log("Winner");
            const keyButtons = document.querySelectorAll(".keyboard-btns");
            keyButtons.forEach((button) => {
                button.removeEventListener("click", keyboardClick);
            });
        }
    }

    function keyboardClick(button) {
        let letter = button.target.dataset.key;
        if (letter === "BACKSPACE") {
            if (numEnteredLetters >= 1) {
                numEnteredLetters--;
                updateBoard(letter, "remove");
                attempt[numEnteredLetters] = undefined;
            }
        }
        else if (letter === "ENTER") {
            if (numEnteredLetters === 5) {
                let attemptStr = attempt.join("").toLocaleLowerCase();
                let isValid = checkValidWord(attemptStr);
                
                if (isValid) {
                    giveFeedback(attemptStr);
                    numAttempts++;
                    numEnteredLetters = 0;
                    attempt = [];
                }
                else {
                    
                }
            }
            else{
                console.log("Not enough letters.");
            }
        }
        else {
            if (numEnteredLetters < 5) {
                attempt[numEnteredLetters] = letter;
                updateBoard(letter, "add");
                numEnteredLetters++;
            }
        }
        
    }
    makeGameboard();
    makeKeyboard();
    
    let validWords = readTextFile("./word-lists/valid-words.txt");
    // Fixes issue when splitting string into array. In github pages, there would not be a \r character
    if (validWords.search("\r") > 0) {
        validWords = validWords.split("\r\n");
    }
    else {
        validWords = validWords.split("\n");
    }

    let possibleSolutions = readTextFile("./word-lists/possible-solutions.txt");
    if (possibleSolutions.search("\r") > 0) {
        possibleSolutions = possibleSolutions.split("\r\n");
    }
    else {
        possibleSolutions = possibleSolutions.split("\n");
    }
    let solutionWord = possibleSolutions[Math.floor(Math.random() * possibleSolutions.length)];

    console.log(validWords);
    console.log(possibleSolutions);

    let attempt = [];
    let numEnteredLetters = 0;
    let numAttempts = 0;

    const keyButtons = document.querySelectorAll(".keyboard-btns");
    keyButtons.forEach((button) => {
        button.addEventListener("click", keyboardClick);
    });
}

game();