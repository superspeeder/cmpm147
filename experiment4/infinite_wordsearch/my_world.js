"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {}

function p3_setup() {}

let worldSeed;
let worldKey;

function p3_worldKeyChanged(key) {
  worldKey = key;
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 24;
}
function p3_tileHeight() {
  return 12;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

let answers = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() {
}

function letterAt(i, j) {
  let letterid = (Math.floor(noise(i * 10, j * 10) * worldKey.length) + (clicks[[i, j]] | 0)) % worldKey.length;
  return worldKey[letterid];
}

let angleing = Math.atan(2)
let angleing2 = Math.atan(0.5)

function generateWord(i, j, di, dj, t) {
  let letters = []
  for (let k = 0 ; k < t ; k++) {
    letters.push(letterAt(i + di * k, j + dj * k))
  }
  
  return letters.join('');
}

function circleWord() {
  noFill();
  stroke(0,255,0, 200);
  strokeWeight(2);
  let c = th * 0.75
  arc(-th/4, 0, c * 2, c * 2, HALF_PI, PI + HALF_PI, OPEN);
  
  // circle(0, 0, tw * 3);

  let l = (worldKey.length - 0.5) * tw + th/4;
  
  line(0, c, l, c)
  line(0, -c, l, -c)
  arc(l, 0, c * 2, c * 2, -HALF_PI, HALF_PI, OPEN);
}

// function circleWord2() {
//   noFill();
//   stroke(0,255,0, 200);
//   strokeWeight(2);
//   arc(0, 0, th, th, -PI, 0, OPEN);

//   line(th/2, 0, 0, tw * (worldKey.length - 1) - tw / 2)
//   line(-th/2, 0, -th, tw * (worldKey.length - 1) - tw / 2)
//   arc(-th / 2, tw * (worldKey.length - 1) - tw / 2, th, th, 0, PI, OPEN);
// }

function checkWord(i, j) {
  let northWord = generateWord(i, j, 0, -1, worldKey.length);
  let southWord = generateWord(i, j, 0, 1, worldKey.length);
  let westWord = generateWord(i, j, 1, 0, worldKey.length);
  let eastWord = generateWord(i, j, -1, 0, worldKey.length);
  return [northWord == worldKey, southWord == worldKey, westWord == worldKey, eastWord == worldKey]
}

function p3_drawTile(i, j) {
  noStroke();

  fill(255, 200);

  push();

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  

  pop();
}

function p3_drawTile2(i, j) {
  push();
  textAlign(CENTER, CENTER);
  
  let letter = letterAt(i, j);
  if (letter == worldKey[0]) {
    let [n,s,w,e] = checkWord(i, j);
    if (n) {
      push();
      rotate(PI + angleing2);
      circleWord();
      pop();
    }
    if (s) {
      push();
      rotate(angleing2);
      circleWord();
      pop();
    }
    if (w) {
      push();
      rotate(PI - angleing2);
      circleWord();
      pop();
    }
    if (e) {
      push();
      rotate(-angleing2);
      circleWord();
      pop();
    }
  }

  noStroke();
  if ((clicks[[i, j]] | 0) % worldKey.length == 0) {
    fill(0);
  } else {
    fill(38, 143, 189);
  }
  text(letter, 0, 0);
  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {
}
