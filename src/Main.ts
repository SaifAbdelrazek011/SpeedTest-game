// Catch Selectors

let lightDarkModeIcon = document.querySelector(
  ".dark-light-toggle"
) as HTMLImageElement;

let startButton = document.querySelector(".start-btn") as HTMLButtonElement;

let difficultylvlSpan = document.querySelector(
  ".message .lvl"
) as HTMLSpanElement;
let secondsSpan = document.querySelector(
  ".message .seconds"
) as HTMLSpanElement;

let theWord = document.querySelector(".the-word") as HTMLDivElement;
let theUpcomingWords = document.querySelector(
  ".upcoming-words"
) as HTMLDivElement;

let inputfield = document.querySelector(".input-word") as HTMLInputElement;

let timeLeftSpan = document.querySelector(".time span") as HTMLSpanElement;
let currentScoreField = document.querySelector(
  ".score-field .your-current-score"
) as HTMLSpanElement;

let theTotalScore = document.querySelector(
  ".score-field .total-score"
) as HTMLSpanElement;
let finishMessage = document.querySelector(".finish") as HTMLDivElement;

let selectDifficultyLevel = document.querySelector(
  ".settings .difficulty-select"
) as HTMLSelectElement;
let theNumberOfWordsInput = document.querySelector(
  ".settings .word-count"
) as HTMLInputElement;

let startPopup = document.querySelector(".start-popup") as HTMLDivElement;
// Variable identifing
let timerInterval: number;
let randomWordsArr: string[] = [];
let wordsArr;
let lvls: { [key: string]: number };
let GameState: boolean;
let wrongAttempts: number = 0;
// Default Level
let difficultyLevelName: string;
let defaultLevelTime: number;

let thearrayOfWords: string[];
let theNumberOfwords: number;
let currentScore: number = 0;
let timeLeft: number;

let maxWrongAttempts: number;

interface Words {
  settings: {
    easy: number;
    normal: number;
    hard: number;
    insane: number;
  };
  words: {
    easy: string[];
    normal: string[];
    hard: string[];
    insane: string[];
  };
}

const url = "words.json";

async function fetchWords(url: string): Promise<Words> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  const data: Words = await response.json();

  return data;
}

////////////////////////////////////////////////////////////////////////////////////////

const selectDifficulty = function (): string {
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

function getRandomWords(words: string[], count: number = 10): string[] {
  const shuffled = words.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Generate words function
function generateWords() {
  theUpcomingWords.innerHTML = "";
  timeLeft = defaultLevelTime;
  // Get Random Word From Array
  let theRandomWord: string =
    randomWordsArr[Math.floor(Math.random() * randomWordsArr.length)];
  // Get Word Index
  let wordIndex: number = randomWordsArr.indexOf(theRandomWord);
  // Remove Word From Array
  randomWordsArr.splice(wordIndex, 1);
  // Show The Random Word
  theWord.innerHTML = theRandomWord;

  // Generate upcoming Words
  randomWordsArr.forEach((_, index) => {
    // Create Div Element
    let div = document.createElement("div") as HTMLDivElement;
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
  } else {
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
const gotIt = function (): void {
  inputfield.value = "";
  currentScore++;
  // Increase Score
  currentScoreField.innerHTML = currentScore.toString();
  generateNewWord();
};
const notIt = function (statue: boolean): void {
  inputfield.value = "";
  if (statue == true) {
    generateNewWord();
  } else {
    loseGame();
  }
};
const wonGame = function (): void {
  // Empty Input Field
  theWord.innerHTML = "";
  finishMessage.innerHTML = "";
  let span = document.createElement("span");
  span.className = "good";
  let spanText = document.createTextNode(`Congratz`);
  span.appendChild(spanText);
  finishMessage.appendChild(span);
  startPopup.style.display = "block";
  (document.querySelector(".success") as HTMLAudioElement).play();
};

// If Lose the game
const loseGame = function (): void {
  theWord.innerHTML = "";
  let span = document.createElement("span");
  span.className = "bad";
  let spanText = document.createTextNode("Game Over");
  span.appendChild(spanText);
  finishMessage.innerHTML = "";
  finishMessage.appendChild(span);
  startPopup.style.display = "block";
  (document.querySelector(".success") as HTMLAudioElement).play();
};

const checkTheGameState = function (theStatue: boolean) {
  if (
    difficultyLevelName === "easy" &&
    theWord.innerHTML.toLowerCase() !== inputfield.value.toLowerCase()
  ) {
    wrongAttempts++;
    notIt(theStatue);
  } else if (theWord.innerHTML !== inputfield.value) {
    wrongAttempts++;
    notIt(theStatue);
  } else if (
    theWord.innerHTML === inputfield.value &&
    inputfield.value !== ""
  ) {
    gotIt();
  }
};

function compareWords() {
  // First check if the answer was wrong when time ran out
  if (
    inputfield.value.toLowerCase().trim() !== theWord.innerHTML.toLowerCase()
  ) {
    wrongAttempts++;
  }

  // Determine game state
  if (wrongAttempts == maxWrongAttempts) {
    GameState = false;
    loseGame();
  } else if (randomWordsArr.length === 0) {
    wonGame();
  } else {
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

    thearrayOfWords = wordsArr[difficultyLevelName as keyof typeof wordsArr];

    // Default Level
    wrongAttempts = 0;
    currentScore = 0;
    theUpcomingWords.innerHTML = "";
    finishMessage.innerHTML = "";
    inputfield.value = "";
    currentScoreField.innerHTML = currentScore.toString();
    let wordsNum: number;
    if (theNumberOfWordsInput.valueAsNumber <= 30) {
      wordsNum = parseInt(theNumberOfWordsInput.value);
    } else {
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
    } else if (difficultyLevelName === "normal") {
      maxWrongAttempts = Math.floor(theNumberOfwords * 0.25);
    } else if (difficultyLevelName === "hard") {
      maxWrongAttempts = 1;
    } else if (difficultyLevelName === "insane") {
      maxWrongAttempts = 1;
    } else {
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
  } else {
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
