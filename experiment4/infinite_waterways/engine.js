"use strict";

/* global p5 */
/* exported preload, setup, draw, mouseClicked */

// Project base code provided by {amsmith,ikarth}@ucsc.edu


let tile_width_step_main; // A width step is half a tile's width
let tile_height_step_main; // A height step is half a tile's height

// Global variables. These will mostly be overwritten in setup().
let tile_rows, tile_columns;
let camera_offset;
let camera_velocity;

function preload() {
  if (window.p3_preload) {
    window.p3_preload();
  }
}

function setup() {
  let canvas = createCanvas(800, 400);
  canvas.parent("container");

  camera_offset = new p5.Vector(-width / 2, height / 2);
  camera_velocity = new p5.Vector(0, 0);

  if (window.p3_setup) {
    window.p3_setup();
  }

  let label = createP();
  label.html("World key: ");
  label.parent("container");

  let input = createInput("xyzzy");
  input.parent(label);
  input.input(() => {
    rebuildWorld(input.value());
  });

  createP("Arrow keys scroll. Clicking changes tiles.").parent("container");

  rebuildWorld(input.value());
}

function rebuildWorld(key) {
  if (window.p3_worldKeyChanged) {
    window.p3_worldKeyChanged(key);
  }
  tile_width_step_main = window.p3_tileWidth ? window.p3_tileWidth() : 32;
  tile_height_step_main = window.p3_tileHeight ? window.p3_tileHeight() : 14.5;
  tile_columns = Math.ceil(width / tile_width_step_main);
  tile_rows = Math.ceil(height / tile_height_step_main);
}

function mouseClicked() {
  let mouseWorld = [mouseX + camera_offset.x, mouseY + camera_offset.y];
  let world_pos = [Math.floor(mouseWorld[0] / tile_width_step_main), Math.floor(mouseWorld[1] / tile_height_step_main)];

  
  if (window.p3_tileClicked) {
    window.p3_tileClicked(world_pos[0], world_pos[1]);
  }
  return false;
}

function draw() {
  // Keyboard controls!
  if (keyIsDown(LEFT_ARROW)) {
    camera_velocity.x -= 1;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    camera_velocity.x += 1;
  }
  if (keyIsDown(DOWN_ARROW)) {
    camera_velocity.y += 1;
  }
  if (keyIsDown(UP_ARROW)) {
    camera_velocity.y -= 1;
  }

  let camera_delta = new p5.Vector(0, 0);
  camera_velocity.add(camera_delta);
  camera_offset.add(camera_velocity);
  camera_velocity.mult(0.95); // cheap easing
  if (camera_velocity.mag() < 0.01) {
    camera_velocity.setMag(0);
  }
  
  camera_offset = new p5.Vector(Math.floor(camera_offset.x), Math.floor(camera_offset.y));

  background(100);

  if (window.p3_drawBefore) {
    window.p3_drawBefore();
  }

  let world_offset = {x: camera_offset.x / tile_width_step_main, y: camera_offset.y / tile_height_step_main}; 
  let world_corner = {x: Math.floor(world_offset.x), y: Math.floor(world_offset.y) };
  
  push();
  translate(-camera_offset.x, -camera_offset.y);
  

  for (let y = -3 ; y <= tile_rows + 2 ; y++) {
    for (let x = tile_columns + 2 ; x >= -3 ; x--) {
      let wx = x + world_corner.x;
      let wy = y + world_corner.y;
      push();
      translate(wx * tile_width_step_main, wy * tile_height_step_main);
      if (window.p3_drawTile) {
        window.p3_drawTile(wx, wy);
      }
      pop();
    }
  }
  
  let mouseWorld = [mouseX + camera_offset.x, mouseY + camera_offset.y];
  let selectedTile = [Math.floor(mouseWorld[0] / tile_width_step_main), Math.floor(mouseWorld[1] / tile_height_step_main)];

  drawTileDescription(selectedTile, [selectedTile[0] * tile_width_step_main, selectedTile[1] * tile_height_step_main]);

  pop();
  
  if (window.p3_drawAfter) {
    window.p3_drawAfter();
  }
}


function drawTileDescription([world_x, world_y], [screen_x, screen_y]) {
  push();
  translate(screen_x, screen_y);
  if (window.p3_drawSelectedTile) {
    window.p3_drawSelectedTile(world_x, world_y, screen_x, screen_y);
  }
  pop();
}

// Draw a tile, mostly by calling the user's drawing code.
function drawTile([world_x, world_y], [camera_x, camera_y]) {
  // let [screen_x, screen_y] = worldToScreen(
  //   [world_x, world_y],
  //   [camera_x, camera_y]
  // );
  push();
  translate(0 - camera_x, camera_y);
  if (window.p3_drawTile) {
    window.p3_drawTile(world_x, world_y);
  }
  pop();
}
