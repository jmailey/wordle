const keyboardContainer = document.querySelector("[data-keyboard]");
const KeyboardKeys = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

export function buildKeyboardKeys() {
  KeyboardKeys.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.classList.add("keyboardRow");
    keyboardContainer.appendChild(rowEl);

    row.forEach((key) => {
      const keyEl = document.createElement("div");
      if (key === "BACKSPACE") {
        keyEl.classList.add("backspace", "icon");
      } else {
        keyEl.textContent = key;
        keyEl.classList.add("key");
      }
      keyEl.dataset.key = key;
      rowEl.appendChild(keyEl);
    });
  });
}
