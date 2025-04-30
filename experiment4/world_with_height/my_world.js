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

let tileImage, tileImage2, tileImage3;

function p3_preload() {
  tileImage = loadImage("https://cdn.glitch.global/d1907359-c60e-4ab8-a7df-a212b7c75bd3/tile.png?v=1745813094814");
  tileImage2 = loadImage("https://cdn.glitch.global/d1907359-c60e-4ab8-a7df-a212b7c75bd3/tile2.png?v=1745814224887");
  tileImage3 = loadImage("https://cdn.glitch.global/d1907359-c60e-4ab8-a7df-a212b7c75bd3/tile4.png?v=1745886423938");
}

function p3_setup() {
  // noCursor();
}

let worldSeed;
let worldScale = 1;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  worldScale = key.length + 1;
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  if (keyIsDown(SHIFT)) {
    clicks[key] = -1 + (clicks[key] | 0);
  } else {
    clicks[key] = 1 + (clicks[key] | 0);    
  }
}

function p3_drawBefore() {
}

function p3_resetChanges() {
  clicks = {}
}

// based on description in https://en.wikipedia.org/wiki/Smoothstep
function smoothstep(edge1, edge2, value, left, right) {
  let diff = right - left;
  let n = Math.min(1, Math.max(0, (value - edge1) / (edge2 - edge1)))
  let unmap = n * n * (3 - 2 * n);
  return left + diff * unmap;
}

function level(i, j) {
  return heightmap(i, j) + (clicks[[i, j]] | 0)
}

function heightmap(i, j) {
  return smoothstep(0.4, 0.6, noise(i / (10 * worldScale), j / (10 * worldScale), 200), 0, 10) + smoothstep(0.4, 0.6, noise(i / 50, j / 50, 200), 2, 16) * Math.pow(noise(i / worldScale, j / worldScale), 2)
}

function p3_drawTile(i, j, mi, mj) {
  noSmooth()
  noStroke();

  let h = level(i, j);

  let minha = Math.floor(Math.min(Math.min(level(i - 1, j), level(i + 1, j)), Math.min(level(i, j - 1), level(i, j + 1)))) - 1;
  
  push();
  
  if (i == mi && j == mj) {
    tint(127);
  } else {
    noTint();
  }
  
  for (let hn = minha ; hn <= h ; hn++) {
    image(tileImage, -tw, -2.5 * th - (th * 1.5 * hn));
  }
  
  image(tileImage2, -tw, -2.5 * th - (th * 1.5 * (Math.floor(h) + 1)));    
  
  pop();
}

function p3_drawSelectedTile(i, j) {  
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}
