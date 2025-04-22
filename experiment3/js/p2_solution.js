/* exported generateGrid, drawGrid */
/* global placeTile, circle */

const HORIZONTAL = 0;
const VERTICAL = 1;

class BspRoomNode {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.children = null;
    this.splitDirection = random() > 0.5 ? HORIZONTAL : VERTICAL;
  }

  split() {
    if (this.splitDirection == HORIZONTAL) {
      let dxSplit = floor(
        clamp(
          randomGaussian(this.width / 2, this.width / 6),
          ceil(this.width / 4),
          floor((3 * this.width) / 4)
        )
      );
      let left = new BspRoomNode(this.x, this.y, dxSplit, this.height);
      let right = new BspRoomNode(
        this.x + dxSplit,
        this.y,
        this.width - dxSplit,
        this.height
      );
      left.splitDirection = VERTICAL;
      right.splitDirection = VERTICAL;
      this.children = [left, right];
    } else {
      let dySplit = floor(
        clamp(
          randomGaussian(this.height / 2, this.height / 6),
          ceil(this.height / 4),
          floor((3 * this.height) / 4)
        )
      );
      let top = new BspRoomNode(this.x, this.y, this.width, dySplit);
      let bottom = new BspRoomNode(
        this.x,
        this.y + dySplit,
        this.width,
        this.height - dySplit
      );
      top.splitDirection = HORIZONTAL;
      bottom.splitDirection = HORIZONTAL;
      this.children = [top, bottom];
    }
  }

  splitDeep(n) {
    this.split();
    n--;
    if (n > 0) {
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].splitDeep(n);
      }
    }
  }

  leaves() {
    if (this.children === null) {
      return [this];
    }

    let leaves = [];
    for (let i = 0; i < this.children.length; i++) {
      leaves = leaves.concat(this.children[i].leaves());
    }

    return leaves;
  }
}

function gridCheck(grid, i, j, target) {
  return (
    target === null ||
    (i >= 0 &&
      i < grid.length &&
      j >= 0 &&
      j < grid[0].length &&
      grid[i][j] == target)
  );
}

let rules = {
  ".": null,
  "#": {
    base: [20, 21],
    rules: [
      // outer corners
      {
        p: { left: ".", right: "#", up: "#", down: "." },
        t: [8, 1],
      },
      {
        p: { left: "#", right: ".", up: "#", down: "." },
        t: [9, 1],
      },
      {
        p: { left: ".", right: "#", up: ".", down: "#" },
        t: [8, 0],
      },
      {
        p: { left: "#", right: ".", up: ".", down: "#" },
        t: [9, 0],
      },

      // inner corners
      {
        p: { left: null, right: "#", up: "#", down: null },
        t: [5, 2],
      },
      {
        p: { left: null, right: "#", up: null, down: "#" },
        t: [5, 0],
      },
      {
        p: { left: "#", right: null, up: "#", down: null },
        t: [7, 2],
      },
      {
        p: { left: "#", right: null, up: null, down: "#" },
        t: [7, 0],
      },

      // edges
      {
        p: { left: "#", right: "#", up: null, down: "." },
        t: [6, 0],
      },
      {
        p: { left: "#", right: "#", up: ".", down: null },
        t: [6, 2],
      },
      {
        p: { left: null, right: ".", up: "#", down: "#" },
        t: [5, 1],
      },
      {
        p: { left: ".", right: null, up: "#", down: "#" },
        t: [7, 1],
      },
    ],
  },
  "_": {
    base: [20, 23],
  }
};

function checkRule(grid, i, j, p) {
  return (
    gridCheck(grid, i, j - 1, p.left) &&
    gridCheck(grid, i, j + 1, p.right) &&
    gridCheck(grid, i - 1, j, p.up) &&
    gridCheck(grid, i + 1, j, p.down)
  );
}

function autotileTile(grid, i, j) {
  const t = grid[i][j];
  if (rules[t] === undefined || rules[t] === null) {
    return null;
  }

  const atRules = rules[t];

  if (atRules.rules === undefined) {
    return atRules.base;
  }

  let base = atRules.base;
  for (let n = 0; n < atRules.rules.length; n++) {
    if (checkRule(grid, i, j, atRules.rules[n].p)) {
      return [base[0] + atRules.rules[n].t[0], base[1] + atRules.rules[n].t[1]];
    }
  }

  return base;
}

function placeTileAutotile(grid, i, j) {
  const t = autotileTile(grid, i, j);
  if (t === null) {
    return;
  }

  const [ti, tj] = t;

  placeTile(i, j, ti, tj);
}

// Place a room on the grid
function placeRoom(grid, left, top, right, bottom) {
  left = max(0, left);
  right = min(right, grid[0].length - 1);
  top = max(0, top);
  bottom = min(bottom, grid.length - 1);
  for (let x = left; x <= right; x++) {
    for (let y = top; y <= bottom; y++) {
      if (x == left || x == right || y == top || y == bottom) {
        grid[y][x] = "#";
      } else {
        grid[y][x] = ".";
      }
    }
  }
}

// simple clamp function
function clamp(v, mi, ma) {
  return min(max(v, mi), ma);
}

// Generate a path between two rooms
function generatePathway(grid, startLeaf, endLeaf, value) {
  let iDistance = endLeaf.center[0] - startLeaf.center[0];
  let jDistance = endLeaf.center[1] - startLeaf.center[1];

  const minI = min(startLeaf.center[0], endLeaf.center[0]);
  const maxI = max(startLeaf.center[0], endLeaf.center[0]);
  const minJ = min(startLeaf.center[1], endLeaf.center[1]);
  const maxJ = max(startLeaf.center[1], endLeaf.center[1]);

  // Paths are drawn longest-side first
  if (abs(iDistance) > abs(jDistance)) {
    const j = startLeaf.center[1];

    for (let i = minI; i <= maxI; i++) {
      if (
        !(i == startLeaf.center[0] && j == startLeaf.center[1]) &&
        !(i == endLeaf.center[0] && j == endLeaf.center[1])
      ) {
        grid[i][j] = value;
      }
    }

    const i2 = endLeaf.center[0];

    for (let j2 = minJ; j2 <= maxJ; j2++) {
      if (
        !(i2 == startLeaf.center[0] && j2 == startLeaf.center[1]) &&
        !(i2 == endLeaf.center[0] && j2 == endLeaf.center[1])
      ) {
        grid[i2][j2] = value;
      }
    }
  } else {
    const i = startLeaf.center[0];

    for (let j = minJ; j <= maxJ; j++) {
      if (
        !(i == startLeaf.center[0] && j == startLeaf.center[1]) &&
        !(i == endLeaf.center[0] && j == endLeaf.center[1])
      ) {
        grid[i][j] = value;
      }
    }

    const j2 = endLeaf.center[1];

    for (let i2 = minI; i2 <= maxI; i2++) {
      if (
        !(i2 == startLeaf.center[0] && j2 == startLeaf.center[1]) &&
        !(i2 == endLeaf.center[0] && j2 == endLeaf.center[1])
      ) {
        grid[i2][j2] = value;
      }
    }
  }
}

// Helper function to calculate the length of a path (used to determine closest room for connecting rooms)
function pathDistance(room1, room2) {
  let di = abs(room2.center[0] - room1.center[0]);
  let dj = abs(room2.center[1] - room1.center[1]);
  return di + dj - 1;
}

// Recursively connects closest rooms by traversing the bsp tree. The i argument is used to count iterations (which I used when debugging this to test the room generation)
function connectRooms(grid, room1, room2, i) {
  if (room1.children !== null) {
    i = connectRooms(grid, room1.children[0], room1.children[1], i);
  }

  if (room2.children !== null) {
    i = connectRooms(grid, room2.children[0], room2.children[1], i);
  }

  let closestRooms = null;
  let closestRoomDistance = null;
  let r1leaves = room1.leaves();
  let r2leaves = room2.leaves();

  // There is almost certainly a more efficient way to do this, but given the low number of rooms we have this works fine.
  for (let n = 0; n < r1leaves.length; n++) {
    for (let m = 0; m < r2leaves.length; m++) {
      if (closestRooms === null) {
        closestRooms = [r1leaves[n], r2leaves[m]];
        closestRoomDistance = pathDistance(closestRooms[0], closestRooms[1]);
      } else {
        let r1 = r1leaves[n];
        let r2 = r2leaves[m];

        let d = pathDistance(r1, r2);
        if (d < closestRoomDistance) {
          closestRooms = [r1, r2];
          closestRoomDistance = d;
        }
      }
    }
  }

  {
    let r1 = closestRooms[0];
    let r2 = closestRooms[1];

    let xd = min(
      abs(r1.bounds.left - r2.bounds.right),
      abs(r2.bounds.left - r1.bounds.right)
    );
    let yd = min(
      abs(r1.bounds.top - r2.bounds.bottom),
      abs(r2.bounds.top - r1.bounds.bottom)
    );
    console.log(xd, yd);
    if (xd < yd) {
      let overlapSpace = [
        max(r1.bounds.top, r2.bounds.top),
        min(r1.bounds.bottom, r2.bounds.bottom),
      ];
      let centerY = floor((overlapSpace[1] + overlapSpace[0]) / 2);
      console.log(overlapSpace, centerY);

      if (r1.bounds.right < r2.bounds.left) {
        for (let j = r1.bounds.right; j <= r2.bounds.left; j++) {
          grid[centerY][j] = "+";
        }
      } else {
        for (let j = r2.bounds.left; j <= r1.bounds.right; j++) {
          grid[centerY][j] = "+";
        }
      }
    } else {
      let overlapSpace = [
        max(r1.bounds.left, r2.bounds.left),
        min(r1.bounds.right, r2.bounds.right),
      ];
      let centerX = floor((overlapSpace[1] + overlapSpace[0]) / 2);

      console.log(overlapSpace, centerX);

      if (r1.bounds.bottom < r2.bounds.top) {
        for (let i = r1.bounds.bottom; i <= r2.bounds.top; i++) {
          grid[i][centerX] = "+";
        }
      } else {
        for (let i = r2.bounds.top; i <= r1.bounds.bottom; i++) {
          grid[i][centerX] = "+";
        }
      }
    }
  }

  return i + 1;
}

// Helper function used when expanding rooms to keep them from intersecting
function anyInRectAreNot(grid, minCorner, maxCorner, values) {
  if (
    minCorner[0] < 0 ||
    minCorner[1] < 0 ||
    maxCorner[0] >= grid[0].length ||
    maxCorner[1] >= grid.length
  ) {
    return true;
  }

  for (let i = minCorner[1]; i <= maxCorner[1]; i++) {
    for (let j = minCorner[0]; j <= maxCorner[0]; j++) {
      if (!values.includes(grid[i][j])) {
        return true;
      }
    }
  }

  return false;
}

// Tries to grow a room by 1 tile in each direction. Returns the new bounds of the room and whether or not any changes were made.
function growRoom(grid, room, roomBounds) {
  let leftReal = room.center[1] - roomBounds.left;
  let rightReal = room.center[1] + roomBounds.right;
  let upReal = room.center[0] - roomBounds.up;
  let downReal = room.center[0] + roomBounds.down;

  let proposedLeft = leftReal - 1;
  let proposedRight = rightReal + 1;
  let proposedUp = upReal - 1;
  let proposedDown = downReal + 1;

  let reverted = 0;

  // check if each direction's proposed change is allowed, and revert it if not
  if (
    proposedLeft < 0 ||
    anyInRectAreNot(
      grid,
      [proposedLeft - 1, upReal - 1],
      [proposedLeft, downReal + 1],
      ["_", "+"]
    )
  ) {
    proposedLeft = leftReal;
    reverted++;
  }

  if (
    proposedRight >= grid[0].length ||
    anyInRectAreNot(
      grid,
      [proposedRight, upReal - 1],
      [proposedRight + 1, downReal + 1],
      ["_", "+"]
    )
  ) {
    proposedRight = rightReal;
    reverted++;
  }

  if (
    proposedUp < 0 ||
    anyInRectAreNot(
      grid,
      [leftReal - 1, proposedUp - 1],
      [rightReal + 1, proposedUp],
      ["_", "+"]
    )
  ) {
    proposedUp = upReal;
    reverted++;
  }

  if (
    proposedDown >= grid.length ||
    anyInRectAreNot(
      grid,
      [leftReal - 1, proposedDown],
      [rightReal + 1, proposedDown + 1],
      ["_", "+"]
    )
  ) {
    proposedDown = downReal;
    reverted++;
  }

  let newBounds = {
    left: room.center[1] - proposedLeft,
    right: proposedRight - room.center[1],
    up: room.center[0] - proposedUp,
    down: proposedDown - room.center[0],
  };
  return [newBounds, reverted != 4];
}

function isPathGood(grid, i, j) {
  let ic = 1;
  let jc = 1;
  for (let d = 1; d < 3; d++) {
    if (gridCheck(grid, i + d, j, "+")) {
      ic++;
    }

    if (gridCheck(grid, i - d, j, "+")) {
      ic++;
    }

    if (gridCheck(grid, i, j + d, "+")) {
      jc++;
    }

    if (gridCheck(grid, i, j - d, "+")) {
      jc++;
    }
  }

  return ic == 3 || jc == 3;
}

function fixPathTile(grid, i, j) {
  if (gridCheck(grid, i - 1, j, "_") && gridCheck(grid, i + 1, j, "_")) {
    grid[i - 1][j] = "?";
    grid[i + 1][j] = "?";
  }

  if (gridCheck(grid, i, j - 1, "_") && gridCheck(grid, i, j + 1, "_")) {
    grid[i][j - 1] = "?";
    grid[i][j + 1] = "?";
  }

  if (isPathGood(grid, i, j)) {
    return;
  }

  if (gridCheck(grid, i - 1, j, "#") && gridCheck(grid, i + 1, j, "#")) {
    grid[i - 1][j] = "+";
    grid[i + 1][j] = "+";
  }

  if (gridCheck(grid, i, j - 1, "#") && gridCheck(grid, i, j + 1, "#")) {
    grid[i][j - 1] = "+";
    grid[i][j + 1] = "+";
  }
}

function fixPathways(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == "+") {
        fixPathTile(grid, i, j);
      }
    }
  }

  for (let i = 0 ; i < grid.length ; i++) {
    for (let j = 0; j < grid[i].length ; j++) {
      if (grid[i][j] == "+") {
        grid[i][j] = ".";
      } else if (grid[i][j] == "?") {
        grid[i][j] = "#";
      }
    }
  }
}

// Main generation function
function generateGrid(numCols, numRows) {
  // create the base grid
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }

  // generate the main "room" node and do two splits (generates 4 rooms)
  let mainRoom = new BspRoomNode(0, 0, numCols, numRows);
  mainRoom.splitDeep(2);

  const leaves = mainRoom.leaves();
  let roomsRoomBounds = [];

  // iterate over all leaves in the tree and pick a center point for the room. Also store the initial room bounds.
  for (let n = 0; n < leaves.length; n++) {
    const leaf = leaves[n];
    let i = clamp(
      floor(leaf.y + leaf.height / 2) + floor(random(2)),
      max(3, leaf.y + 1),
      min(numRows - 3, leaf.y + leaf.height - 2)
    );
    let j = clamp(
      floor(leaf.x + leaf.width / 2) + floor(random(2)),
      max(3, leaf.x + 1),
      min(numCols - 3, leaf.x + leaf.width - 2)
    );
    grid[i][j] = "#";
    leaf.center = [i, j];
    roomsRoomBounds.push({ left: 0, right: 0, up: 0, down: 0 });
  }

  // Grow the rooms as much as possible (max iterations should allow all space to be taken if possible, quits early if an iteration makes no changes to any rooms)
  const maxIterations = 20;
  let iterations = 0;

  while (iterations < maxIterations) {
    iterations++;

    let iterChanges = 0;
    for (let n = 0; n < leaves.length; n++) {
      let [newBounds, anyChanges] = growRoom(
        grid,
        leaves[n],
        roomsRoomBounds[n]
      );
      roomsRoomBounds[n] = newBounds;
      let center = leaves[n].center;
      if (anyChanges) {
        placeRoom(
          grid,
          center[1] - newBounds.left,
          center[0] - newBounds.up,
          center[1] + newBounds.right,
          center[0] + newBounds.down
        );
        iterChanges++;
      } else {
        leaves[n].bounds = {
          left: center[1] - newBounds.left,
          right: center[1] + newBounds.right,
          top: center[0] - newBounds.up,
          bottom: center[0] + newBounds.down,
        };
      }
    }

    if (iterChanges == 0) {
      break;
    }
  }

  // Connect all the rooms together ahead of time (the paths will be improved after room placement)
  connectRooms(grid, mainRoom.children[0], mainRoom.children[1], 0);

  fixPathways(grid);
  
  return grid;
}

function tilePosFromCanvasPos(x, y) {
  return [floor(x / 16), floor(y / 16)]
}

function rayCast(grid, origin, direction) {
  let pos = [origin[0], origin[1]];
  let tpos = tilePosFromCanvasPos(pos[0], pos[1]);
  
  let steps = 0;
  
  while (!gridCheck(grid, tpos[1], tpos[0], "_") && !gridCheck(grid, tpos[1], tpos[0], "*") && steps++ < 400) {
    pos[0] += direction[0];
    pos[1] += direction[1];
    tpos = tilePosFromCanvasPos(pos[0], pos[1]);
  }
  
//   if (direction[0] < 0) {
//     pos[0] = ceil(pos[0] / 16) * 16;
//   } else {
//     pos[0] = floor(pos[0] / 16) * 16;
//   }
  
  
//   if (direction[1] < 0) {
//     pos[1] = ceil(pos[1] / 16) * 16;
//   } else {
//     pos[1] = floor(pos[1] / 16) * 16;
//   }
  
  return pos
}


function drawGrid(grid) {
  background(64);
  
  circle(mouseX, mouseY, 4);

  noStroke();
  fill(255,218, 189, 140)
  
  
  const n = 2048;
  let lastPoint = null;
  beginShape();
  
  for (let t = 0 ; t <= n ; t++) {
    let dx = cos((t / n) * TWO_PI);
    let dy = sin((t / n) * TWO_PI);
    let hit = rayCast(grid, [mouseX, mouseY], [dx, dy]);
  
    if (lastPoint !== null) {
      vertex(hit[0], hit[1])
    }
    
    lastPoint = hit;
  }
  
  endShape();

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      placeTileAutotile(grid, i, j);
    }
  }
  
}
