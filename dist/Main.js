"use strict";
// Catch Selectors
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let lightDarkModeIcon = document.querySelector(".dark-light-toggle");
let startButton = document.querySelector(".start-btn");
let difficultylvlSpan = document.querySelector(".message .lvl");
let secondsSpan = document.querySelector(".message .seconds");
let theWord = document.querySelector(".the-word");
let theUpcomingWords = document.querySelector(".upcoming-words");
let inputfield = document.querySelector(".input-word");
let timeLeftSpan = document.querySelector(".time span");
let currentScoreField = document.querySelector(".score-field .your-current-score");
let theTotalScore = document.querySelector(".score-field .total-score");
let finishMessage = document.querySelector(".finish");
let selectDifficultyLevel = document.querySelector(".settings .difficulty-select");
let theNumberOfWordsInput = document.querySelector(".settings .word-count");
let startPopup = document.querySelector(".start-popup");
// Variable identifing
let timerInterval;
let randomWordsArr = [];
let wordsArr;
let lvls;
let GameState;
let wrongAttempts = 0;
// Default Level
let difficultyLevelName;
let defaultLevelTime;
let thearrayOfWords;
let theNumberOfwords;
let currentScore = 0;
let timeLeft;
let maxWrongAttempts;
const url = "words.json";
function fetchWords(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        const data = yield response.json();
        return data;
    });
}
////////////////////////////////////////////////////////////////////////////////////////
const selectDifficulty = function () {
    const theGameDifficulty = selectDifficultyLevel.value;
    return theGameDifficulty;
};
// Disable Paste Event
inputfield.onpaste = () => {
    return false;
};
inputfield.addEventListener("input", function () {
    if (inputfield.value.toLowerCase() === theWord.innerHTML.toLowerCase()) {
        clearInterval(timerInterval);
        gotIt();
    }
});
function getRandomWords(words, count = 10) {
    const shuffled = words.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}
// Generate words function
function generateWords() {
    theUpcomingWords.innerHTML = "";
    timeLeft = defaultLevelTime;
    // Get Random Word From Array
    let theRandomWord = randomWordsArr[Math.floor(Math.random() * randomWordsArr.length)];
    // Get Word Index
    let wordIndex = randomWordsArr.indexOf(theRandomWord);
    // Remove Word From Array
    randomWordsArr.splice(wordIndex, 1);
    // Show The Random Word
    theWord.innerHTML = theRandomWord;
    // Generate upcoming Words
    randomWordsArr.forEach((_, index) => {
        // Create Div Element
        let div = document.createElement("div");
        let txt = document.createTextNode(randomWordsArr[index]);
        div.appendChild(txt);
        theUpcomingWords.appendChild(div);
        startTimer();
    });
}
// Generating New Words
const generateNewWord = function () {
    if (randomWordsArr.length > 0) {
        generateWords();
    }
    else {
        wonGame();
    }
};
function startTimer() {
    clearInterval(timerInterval);
    timeLeft = defaultLevelTime;
    timeLeftSpan.innerHTML = timeLeft.toString();
    timerInterval = setInterval(() => {
        timeLeft--;
        timeLeftSpan.innerHTML = timeLeft.toString();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            compareWords();
        }
    }, 1000);
}
// While true
const gotIt = function () {
    inputfield.value = "";
    currentScore++;
    // Increase Score
    currentScoreField.innerHTML = currentScore.toString();
    generateNewWord();
};
const notIt = function (statue) {
    inputfield.value = "";
    if (statue == true) {
        generateNewWord();
    }
    else {
        loseGame();
    }
};
const wonGame = function () {
    // Empty Input Field
    theWord.innerHTML = "";
    finishMessage.innerHTML = "";
    let span = document.createElement("span");
    span.className = "good";
    let spanText = document.createTextNode(`Congratz`);
    span.appendChild(spanText);
    finishMessage.appendChild(span);
    startPopup.style.display = "block";
    document.querySelector(".success").play();
};
// If Lose the game
const loseGame = function () {
    theWord.innerHTML = "";
    let span = document.createElement("span");
    span.className = "bad";
    let spanText = document.createTextNode("Game Over");
    span.appendChild(spanText);
    finishMessage.innerHTML = "";
    finishMessage.appendChild(span);
    startPopup.style.display = "block";
    document.querySelector(".success").play();
};
const checkTheGameState = function (theStatue) {
    if (difficultyLevelName === "easy" &&
        theWord.innerHTML.toLowerCase() !== inputfield.value.toLowerCase()) {
        wrongAttempts++;
        notIt(theStatue);
    }
    else if (theWord.innerHTML !== inputfield.value) {
        wrongAttempts++;
        notIt(theStatue);
    }
    else if (theWord.innerHTML === inputfield.value &&
        inputfield.value !== "") {
        gotIt();
    }
};
function compareWords() {
    // First check if the answer was wrong when time ran out
    if (inputfield.value.toLowerCase().trim() !== theWord.innerHTML.toLowerCase()) {
        wrongAttempts++;
    }
    console.log(maxWrongAttempts);
    // Determine game state
    if (wrongAttempts == maxWrongAttempts) {
        GameState = false;
        loseGame();
    }
    else if (randomWordsArr.length === 0) {
        wonGame();
    }
    else {
        GameState = true;
        generateNewWord();
    }
    checkTheGameState(GameState);
}
// Start Game
startButton.onclick = function () {
    fetchWords(url).then((wordsData) => {
        wordsArr = wordsData.words;
        lvls = wordsData.settings;
        difficultyLevelName = selectDifficultyLevel.value.toLowerCase();
        defaultLevelTime = lvls[difficultyLevelName];
        console.log(difficultyLevelName);
        thearrayOfWords = wordsArr[difficultyLevelName];
        // Default Level
        wrongAttempts = 0;
        currentScore = 0;
        theUpcomingWords.innerHTML = "";
        finishMessage.innerHTML = "";
        inputfield.value = "";
        currentScoreField.innerHTML = currentScore.toString();
        let wordsNum;
        if (theNumberOfWordsInput.valueAsNumber <= 30) {
            wordsNum = parseInt(theNumberOfWordsInput.value);
        }
        else {
            wordsNum = 30;
        }
        randomWordsArr = getRandomWords(thearrayOfWords, wordsNum);
        theNumberOfwords = randomWordsArr.length;
        difficultylvlSpan.innerHTML = difficultyLevelName;
        secondsSpan.innerHTML = `${defaultLevelTime}`;
        theTotalScore.innerHTML = `${theNumberOfwords}`;
        if (startPopup) {
            startPopup.style.display = "none";
        }
        inputfield.style.display = "block";
        inputfield.focus();
        // Determine maximum allowed mistakes based on difficulty
        if (difficultyLevelName === "easy") {
            maxWrongAttempts = Math.floor(theNumberOfwords * 0.5);
        }
        else if (difficultyLevelName === "normal") {
            maxWrongAttempts = Math.floor(theNumberOfwords * 0.25);
        }
        else if (difficultyLevelName === "hard") {
            maxWrongAttempts = 1;
        }
        else if (difficultyLevelName === "insane") {
            maxWrongAttempts = 1;
        }
        else {
            maxWrongAttempts = 0;
        }
        generateWords();
    });
};
/////////////////////////////////////////////////////////////////////////////////
// Initialize lightMode from localStorage
let lightMode = localStorage.getItem("lightMode") === "true";
// Function to toggle light and dark mode
const setLightDark = function () {
    if (lightMode) {
        lightDarkModeIcon.src = "Images/sun.png";
        document.body.classList.add("light-theme");
    }
    else {
        lightDarkModeIcon.src = "Images/moon.png";
        document.body.classList.remove("light-theme");
    }
};
// Event listener for light/dark mode toggle
lightDarkModeIcon.addEventListener("click", () => {
    lightMode = !lightMode;
    localStorage.setItem("lightMode", lightMode.toString());
    setLightDark();
});
// Initial call to set the correct mode on page load
setLightDark();
