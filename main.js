import { buildKeyboardKeys } from "./keys.js";
import Words from "./words.js";
const gridColumns = 5;
let currentGuess = "";
const usedKeys = new Map();

const keyboard = document.querySelector(".keyboard");

buildKeyboardKeys();

const randomNum = Math.floor(Math.random() * Words.length + 1);
const answer = Words[randomNum];
console.log(answer);
function handleBackspace() {
  const filledTiles = [...document.querySelectorAll(".tile[data-fill=grow]")];
  const lastTile = filledTiles[filledTiles.length - 1];
  if (lastTile) {
    lastTile.removeAttribute("data-fill");
    lastTile.textContent = "";
    currentGuess = currentGuess.slice(0, -1);
  }
}

function fillCurrentTile(key) {
  const currentTile = document.querySelector(".tile:not([data-fill])");
  currentTile.textContent = key.toUpperCase();
  currentTile.dataset.fill = "grow";
  currentTile.dataset.key = key;
  currentGuess += key;
}

function onLastCardFlipped() {
  currentGuess.split("").forEach((key) => {
    const currentKey = document.querySelector(
      `.keyboardRow > div[data-key=${key}]`
    );

    if (currentKey.classList.contains("isPresent")) {
      currentKey.classList.remove("isPresent");
    }
    if (!currentKey.classList.contains("correctPosition"))
      currentKey.classList.add(usedKeys.get(key));
  });

  if (currentGuess === answer.toUpperCase()) {
    const tileToBounce = [
      ...document.querySelectorAll(".gameGrid > .correctPosition"),
    ].slice(-5);

    let delay = 0;

    tileToBounce.forEach((tile) => {
      tile.dataset.fill = "bounce";

      tile.style = `animation-delay: ${delay}ms`;
      delay += 100;
    });
  }

  resetGuess();
}

const resetGuess = () => (currentGuess = "");

function flipTile(tile, delay) {
  tile.style = `animation-delay: ${delay}ms`;
  tile.dataset.fill = "flip";
}

function checkGuess() {
  if (currentGuess.length < gridColumns) return false;
  const tilesToFlip = [...document.querySelectorAll("[data-fill='grow']")];
  let delay = 0;

  tilesToFlip.forEach((tile, tileIndex) => {
    storeKey(tile, tileIndex);
    flipTile(tile, delay);
    delay += 300;

    if (tileIndex === tilesToFlip.length - 1) {
      tile.addEventListener("animationend", onLastCardFlipped);
    }
  });
}

function storeKey(tile, tileIndex) {
  const word = answer.toUpperCase();
  const key = tile.dataset.key;

  if (word.includes(key)) {
    if (key === word[tileIndex]) {
      usedKeys.set(key, "correctPosition");
      tile.classList.add("correctPosition");
    } else {
      usedKeys.set(key, "isPresent");
      tile.classList.add("isPresent");
    }
  } else {
    usedKeys.set(key, "notPresent");
    tile.classList.add("notPresent");
  }
}

document.addEventListener("keydown", (e) => {
  const keyRegEx = new RegExp("^[A-Z]{1}$", "i");
  const key = e.key.toUpperCase();
  if (key === "ENTER") {
    checkGuess();
  }
  if (key === "BACKSPACE") {
    handleBackspace();
  }
  if (!keyRegEx.test(key) || currentGuess.length === gridColumns) return;
  fillCurrentTile(key);
});

function keyboardClick(e) {
  const key = e.target.dataset.key;
  if (key) {
    if (key === "ENTER") {
      checkGuess();
    } else if (key === "BACKSPACE") {
      handleBackspace();
    } else {
      console.log(key);
      fillCurrentTile(key);
    }
  }
}

keyboard.addEventListener("click", keyboardClick);
