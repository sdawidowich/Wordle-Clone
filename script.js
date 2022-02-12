function makeGameboard() {
    const gameboard = document.querySelector('#gameboard');

    for (let i = 0; i < 30; i++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
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

    function updateBoard(letter, action) {
        if (action === "add") {
            const tile = document.querySelectorAll(".tile");
            tile[numEnteredLetters + 5 * numAttempts].textContent = letter;
        }
        else if (action === "remove") {
            const tile = document.querySelectorAll(".tile");
            tile[numEnteredLetters + 5 * numAttempts].textContent = "";
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
                let isValid = false;
                let attemptStr = attempt.join("").toLocaleLowerCase();

                for (let i = 0; i < validWords.length; i++) {
                    if (attemptStr === validWords[i]) {
                        isValid = true;
                        break;
                    }
                }
                
                if (isValid) {
                    if (attemptStr === solutionWord) {
                        console.log("Winner");
                    }
                    numAttempts++;
                }
                else {
                    
                }
                console.log(isValid);
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
    
    let validWords = readTextFile("word-lists/valid-words.txt").split("\r\n");
    let possibleSolutions = readTextFile("word-lists/possible-solutions.txt").split("\r\n");
    let solutionWord = possibleSolutions[Math.floor(Math.random() * possibleSolutions.length)];

    let attempt = [];
    let numEnteredLetters = 0;
    let numAttempts = 0;

    const keyButtons = document.querySelectorAll(".keyboard-btns");
    keyButtons.forEach((button) => {
        button.addEventListener("click", keyboardClick);
    });
}

makeGameboard();
makeKeyboard();
game();