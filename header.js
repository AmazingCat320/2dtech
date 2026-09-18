const fonts = [
    "'Palette Mosaic', sans-serif",
    "'Lobster', sans-serif",
    "'Barriecito', sans-serif",
    "'Sedgwick Ave Display', cursive"
]

const typingSpeed = 180;     // ms between each typed character
const pauseBeforeErase = 1200; // ms to hold the fully-typed word before erasing
const erasingSpeed = 90;      // ms between each erased character

const el = document.getElementById("typed-text");
let fontIndex = 0;

// Each segment: its text, and the CSS class to color it with
const segments = [
    { text: "2D",    class: "header-title-1" },
    { text: "tech",  class: "header-title-2" },
    { text: ".",  class: "header-title-3" },
    { text: "net",  class: "header-title-4" }
];

// Reconstruct textToType from the segments, so you never have to keep two
// sources of truth (the full string, and the pieces) in sync by hand
const textToType = segments.map(s => s.text).join("");

function buildHTML(index) {
    let remaining = index;   // how many characters we still need to reveal
    let html = "";

    for (const segment of segments) {
        if (remaining <= 0) break;   // nothing left to type — stop adding segments

        const visibleLength = Math.min(remaining, segment.text.length);
        const visibleText = segment.text.slice(0, visibleLength);

        html += `<span class="${segment.class}">${visibleText}</span>`;
        remaining -= visibleLength;
    }

    return html;
}

function typeText(text, index, callback) {
if (index <= text.length) {
    el.innerHTML = buildHTML(index);
    setTimeout(() => typeText(text, index + 1, callback), typingSpeed);
} else {
    callback();
    }
}

function eraseText(text, index, callback) {
    if (index >= 0) {
        el.innerHTML = buildHTML(index);
        setTimeout(() => eraseText(text, index - 1, callback), erasingSpeed);
    } else {
        callback();
    }
}

// ---------- 4. THE MAIN LOOP: type -> pause -> erase -> next font -> repeat ----------
function runCycle() {
    el.style.fontFamily = fonts[fontIndex];

    typeText(textToType, 0, () => {
    setTimeout(() => {
        eraseText(textToType, textToType.length, () => {
        fontIndex = (fontIndex + 1) % fonts.length;   // wrap around after the 10th font
        runCycle();   // start the next font's cycle
        });
    }, pauseBeforeErase);
    });
}

runCycle();   // kick off the whole thing