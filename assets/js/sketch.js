let wordData;
let placedWords = [];

function preload() {
  wordData = loadJSON('/assets/json/word_freq.json'); // {"data": [["word", freq], ...]}
}

function setup() {
  let canvas = createCanvas(windowWidth / 2, windowHeight / 2);
  canvas.parent('p5-container');
  angleMode(RADIANS);
  textAlign(CENTER, CENTER);
  drawWords();
}

function windowResized() {
  resizeCanvas(windowWidth / 2, windowHeight / 2);
  placedWords = [];
  clear(); // clear the canvas
  drawWords();
}

function drawWords() {
  background(255);
  placedWords = [];

  let words = wordData.data;
  words.sort((a, b) => b[1] - a[1]);

  let centerX = width / 2;
  let centerY = height / 2;

  // Scale font sizes relative to canvas size
  let minSize = min(width, height) * 0.035;
  let maxSize = min(width, height) * 0.12;

  for (let i = 0; i < words.length; i++) {
    let [word, freq] = words[i];
    let fontSize = map(freq, words[words.length - 1][1], words[0][1], minSize, maxSize);
    let angles = [0, PI / 4, PI / 2, (3 * PI) / 4];

    let placed = false;
    let radius = 0;
    let angle = 0;

    for (let tries = 0; tries < 1000; tries++) {
      radius += 0.5;
      angle += 0.3;
      let x = centerX + radius * cos(angle);
      let y = centerY + radius * sin(angle);
      let rotation = random(angles);

      let bbox = getWordBBox(word, fontSize, x, y, rotation);
      if (!isOverlapping(bbox) && isInsideCanvas(bbox)) {
        drawWord(word, fontSize, x, y, rotation);
        placedWords.push(bbox);
        placed = true;
        break;
      }
    }

    if (!placed) {
      console.log('Skipped:', word);
    }
  }
}

function drawWord(word, size, x, y, angle) {
  push();
  translate(x, y);
  rotate(angle);
  textSize(size);
  fill(random(60, 160), random(60, 160), random(60, 160));
  text(word, 0, 0);
  pop();
}

function getWordBBox(word, size, x, y, angle) {
  textSize(size);
  let w = textWidth(word);
  let h = size;

  let rotW = abs(w * cos(angle)) + abs(h * sin(angle));
  let rotH = abs(w * sin(angle)) + abs(h * cos(angle));

  return {
    x: x,
    y: y,
    w: rotW,
    h: rotH
  };
}

function isOverlapping(b) {
  for (let other of placedWords) {
    if (
      abs(b.x - other.x) < (b.w + other.w) / 2 &&
      abs(b.y - other.y) < (b.h + other.h) / 2
    ) {
      return true;
    }
  }
  return false;
}

function isInsideCanvas(b) {
  return (
    b.x - b.w / 2 >= 0 &&
    b.y - b.h / 2 >= 0 &&
    b.x + b.w / 2 <= width &&
    b.y + b.h / 2 <= height
  );
}

// let wordData;
// let placedWords = [];

// function isInsideCanvas(b) {
//   return (
//     b.x - b.w / 2 >= 0 &&
//     b.y - b.h / 2 >= 0 &&
//     b.x + b.w / 2 <= width &&
//     b.y + b.h / 2 <= height
//   );
// }

// function preload() {
//   wordData = loadJSON('/assets/json/word_freqv1.json'); // {"data": [["word", freq], ...]}
// }

// function setup() {
//   let canvas = createCanvas(windowWidth / 2, windowHeight / 2);
//   canvas.parent('p5-container');
//   background(255);
//   textAlign(CENTER, CENTER);
//   angleMode(RADIANS);
//   noLoop();

//   let words = wordData.data;
//   words.sort((a, b) => b[1] - a[1]);

//   let centerX = width / 2;
//   let centerY = height / 2;

//   for (let i = 0; i < words.length; i++) {
//     let [word, freq] = words[i];
//     // let fontSize = map(freq, words[words.length - 1][1], words[0][1], 14, 72);
//     let minSize = min(width, height) * 0.035;  // min font size ~3.5% of canvas
//     let maxSize = min(width, height) * 0.12;   // max font size ~12% of canvas
//     let fontSize = map(freq, words[words.length - 1][1], words[0][1], minSize, maxSize);

//     let angles = [0, PI / 4, PI / 2, (3 * PI) / 4];

//     let placed = false;
//     let radius = 0;
//     let angle = 0;

//     for (let tries = 0; tries < 1000; tries++) {
//       radius += 0.5;
//       angle += 0.3;
//       let x = centerX + radius * cos(angle);
//       let y = centerY + radius * sin(angle);
//       let rotation = random(angles);

//       let bbox = getWordBBox(word, fontSize, x, y, rotation);
//       if (!isOverlapping(bbox) && isInsideCanvas(bbox)) {
//         drawWord(word, fontSize, x, y, rotation);
//         placedWords.push(bbox);
//         placed = true;
//         break;
//       }
//     }

//     if (!placed) {
//       console.log('Skipped:', word);
//     }
//   }
// }


// function drawWord(word, size, x, y, angle) {
//   push();
//   translate(x, y);
//   rotate(angle);
//   textSize(size);
//   fill(random(60, 160), random(60, 160), random(60, 160));
//   text(word, 0, 0);
//   pop();
// }

// function getWordBBox(word, size, x, y, angle) {
//   textSize(size);
//   let w = textWidth(word);
//   let h = size;

//   let rotW = abs(w * cos(angle)) + abs(h * sin(angle));
//   let rotH = abs(w * sin(angle)) + abs(h * cos(angle));

//   return {
//     x: x,
//     y: y,
//     w: rotW,
//     h: rotH
//   };
// }

// function isOverlapping(b) {
//   for (let other of placedWords) {
//     if (
//       abs(b.x - other.x) < (b.w + other.w) / 2 &&
//       abs(b.y - other.y) < (b.h + other.h) / 2
//     ) {
//       return true;
//     }
//   }
//   return false;
// }

// 💡 How It Works:

//     Words are rotated randomly between 0° and 90°.

//     Bounding boxes are estimated (not pixel-perfect).

//     We try up to 500 times to place a word in a non-overlapping spot.

//     The algorithm stops if a word can't be placed (this prevents infinite loops).
// let wordData;

// function preload() {
//   wordData = loadJSON('word_freq.json');
// }

// let placedWords = [];

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   background(255);
//   textAlign(CENTER, CENTER);
//   noLoop();

//   let words = wordData.data;
//   words.sort((a, b) => b[1] - a[1]); // largest first

//   for (let i = 0; i < words.length; i++) {
//     let [word, freq] = words[i];
//     let fontSize = map(freq, words[words.length - 1][1], words[0][1], 12, 72);
//     let angle = random([0, HALF_PI]); // 0° or 90° for simplicity

//     let placed = false;
//     for (let tries = 0; tries < 500; tries++) {
//       let x = random(100, width - 100);
//       let y = random(100, height - 100);

//       let bbox = getWordBBox(word, fontSize, x, y, angle);
//       if (!isOverlapping(bbox)) {
//         drawWord(word, fontSize, x, y, angle);
//         placedWords.push(bbox);
//         placed = true;
//         break;
//       }
//     }

//     if (!placed) {
//       console.log('Could not place:', word);
//     }
//   }
// }

// function drawWord(word, size, x, y, angle) {
//   push();
//   translate(x, y);
//   rotate(angle);
//   textSize(size);
//   fill(random(50, 150), random(50, 150), random(50, 150));
//   text(word, 0, 0);
//   pop();
// }

// function getWordBBox(word, size, x, y, angle) {
//   textSize(size);
//   let w = textWidth(word);
//   let h = size;

//   let box = {
//     x: x,
//     y: y,
//     w: angle === 0 ? w : h,
//     h: angle === 0 ? h : w
//   };

//   return box;
// }

// function isOverlapping(bbox) {
//   for (let other of placedWords) {
//     if (
//       abs(bbox.x - other.x) < (bbox.w + other.w) / 2 &&
//       abs(bbox.y - other.y) < (bbox.h + other.h) / 2
//     ) {
//       return true;
//     }
//   }
//   return false;
// }

// // let wordData = [];

// // function preload() {
// //   wordData = loadJSON('word_freq.json'); // Load the word frequency JSON file
// // }

// // function setup() {
// //   createCanvas(windowWidth, windowHeight);
// //   background(255);
// //   textAlign(CENTER, CENTER);

// //   let words = wordData.data;
// //   words.sort((a, b) => b[1] - a[1]);

// //   for (let i = 0; i < words.length; i++) {
// //     let [word, freq] = words[i];
// //     let fontSize = map(freq, words[words.length - 1][1], words[0][1], 12, 72);
// //     fill(random(50, 150), random(50, 150), random(50, 150));
// //     textSize(fontSize);
// //     let x = random(width);
// //     let y = random(height);
// //     text(word, x, y);
// //   }
// // }
// // function setup() {
// //   createCanvas(windowWidth, windowHeight);
// //   background(255);
// //   textAlign(CENTER, CENTER);

// //   let words = Object.entries(wordData);
// //   words.sort((a, b) => b[1] - a[1]); // Sort by frequency

// //   for (let i = 0; i < words.length; i++) {
// //     let [word, freq] = words[i];
// //     let fontSize = map(freq, words[words.length - 1][1], words[0][1], 12, 72);
// //     fill(random(50, 150), random(50, 150), random(50, 150));
// //     textSize(fontSize);
// //     let x = random(width);
// //     let y = random(height);
// //     text(word, x, y);
// //   }
// // }
