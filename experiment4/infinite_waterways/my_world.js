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

let tileset;

function p3_preload() {
  tileset = loadImage("https://cdn.glitch.global/9fd19998-89e0-4b41-8644-4a57b5b88db6/waterways3.png?v=1745960510308");  
}

function drawTile(ti, tj, x, y) {
  image(tileset, (x | 0) * tw, (y | 0) * th, tw, th, ti * 16, tj * 16, 16, 16)
}

function drawTree() {
  drawTile(4, 0, 0, -2)
  drawTile(5, 0, 1, -2)
  drawTile(4, 1, 0, -1)
  drawTile(5, 1, 1, -1)
  drawTile(4, 2, 0, 0)
  drawTile(5, 2, 1, 0)
}

function p3_setup() {
  noSmooth()
  
}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  ridge_threshold = 1.1 - 4 / (key.length + 5)
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 32;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() {}

let scale = 0.2;
let ridge_threshold = 0.7;

// based on description in https://en.wikipedia.org/wiki/Smoothstep
function smoothstep(edge1, edge2, value, left, right) {
  let diff = right - left;
  let n = Math.min(1, Math.max(0, (value - edge1) / (edge2 - edge1)))
  let unmap = n * n * (3 - 2 * n);
  return left + diff * unmap;
}

function noisef(x, y) {
  let ridged = 1.0 - Math.abs(noise(x / scale, y / scale) - 0.5) * 2.0
  return ridged;
}

function iswater(x, y) {
  return noisef(x, y) < ridge_threshold
}

let neighbors = [
  [0,2], // 0000  durl
  [2,3], // 0001
  [1,3], // 0010
  [0,0], // 0011
  [4,3], // 0100
  [3,2], // 0101
  [1,2], // 0110
  [2,2], // 0111
  [3,3], // 1000
  [3,0], // 1001
  [1,0], // 1010
  [2,0], // 1011
  [0,1], // 1100
  [3,1], // 1101
  [1,1], // 1110
  [2,1], // 1111
]

function pickTile(x, y) {
  let left = iswater(x - 1, y) ? 0b1 : 0b0
  let right = iswater(x + 1, y) ? 0b10 : 0b0
  let up = iswater(x, y - 1) ? 0b100 : 0b0
  let down = iswater(x, y + 1) ? 0b1000 : 0b0
  
  let n = left | right | up | down
  return neighbors[n]
}

function p3_drawTile(i, j) {
  noStroke();

  push();

  if (iswater(i,j)) {
    
    let [ti, tj] = pickTile(i, j)
    drawTile(ti, tj)
  } else {
    drawTile(0, 2)
  }


  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    drawTree()
  }

  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  rect(0, 0, tw, th)

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}
