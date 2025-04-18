import {
  XRES,
  YRES,
  HIGHLIGHT_COLOR,
  DARK_COLORS,
  LIGHT_COLORS,
  BLOCK_COORDS,
  QUILT_SCALE,
  QUILT_COORDS,
  DEFAULT_PIECE_WIDTH,
  NUM_PIECE_OPTIONS,
} from "./constants";

export class Piece {
  constructor(
    type = "placeholder",
    x,
    y,
    width,
    rotation = 0,
    color = [LIGHT_COLORS[0], DARK_COLORS[1]]
  ) {
    this.type = type; // "placeholder", "full_dark", "full_light", "diagonal"
    this.x = x;
    this.y = y;
    this.width = width;
    this.rotation = rotation; // 0, 1, 2, 3
    this.color = color; // [light color, dark color]

    this.rect = this.createRect();

    /*
    ROTATION:
    0:  light / dark
    1:  dark \ light
    2:  dark / light
    3:  light \ dark
    */
  }

  createRect() {
    /* Create a helpful rect property with size and position attributes based off
       of the piece's position in a block  */

    let rect = {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.width,
      width: this.width,
      height: this.width,
    };

    return rect;
  }

  draw(p, providedRect = null) {
    // console.log("Drawing piece");

    // If rect provided, use it. Otherwise use default rect.
    let rect = providedRect ? providedRect : this.rect;

    if (this.type === "placeholder") {
      p.noFill();
      p.stroke(HIGHLIGHT_COLOR); // RGB: Yellow   TODO: Use variable
      p.strokeWeight(2);
      p.rect(rect.left, rect.top, rect.width, rect.height);
    } else if (this.type === "full_dark") {
      p.fill(this.color[1]);
      p.noStroke();
      p.rect(rect.left, rect.top, rect.width, rect.height);
    } else if (this.type === "full_light") {
      p.fill(this.color[0]);
      p.noStroke();
      p.rect(rect.left, rect.top, rect.width, rect.height);
    } else if (this.type === "diagonal") {
      this.drawDiagonal(p, rect);
    }
  }

  drawDiagonal(p, rect) {
    const { left, right, top, bottom, width, height } = rect;

    const diagonalPatterns = {
      // [x1, y1, x2, y2, x3, y3]
      top_left: [left, top, right, top, left, bottom], //         |*/
      top_right: [left, top, right, top, right, bottom], //       \*|
      bottom_right: [left, bottom, right, top, right, bottom], // /*|
      bottom_left: [left, top, right, bottom, left, bottom], //   |*\
    };

    const rotationPatterns = {
      // 0: light / dark
      0: {
        light: diagonalPatterns["top_left"],
        dark: diagonalPatterns["bottom_right"],
      },
      // 1: dark \ light
      1: {
        light: diagonalPatterns["top_right"],
        dark: diagonalPatterns["bottom_left"],
      },
      // 2:  dark / light
      2: {
        light: diagonalPatterns["bottom_right"],
        dark: diagonalPatterns["top_left"],
      },
      // 3:  light \ dark
      3: {
        light: diagonalPatterns["bottom_left"],
        dark: diagonalPatterns["top_right"],
      },
    };

    // Translate piece rotation type to x,y coords.
    let lightTriCoordArray = rotationPatterns[this.rotation].light;
    let darkTriCoordArray = rotationPatterns[this.rotation].dark;

    // draw light triange
    p.fill(this.color[0]);
    p.noStroke();
    p.triangle(...lightTriCoordArray);

    // draw dark triange
    p.fill(this.color[1]);
    p.noStroke();
    p.triangle(...darkTriCoordArray);
  }

  drawAt(p, x, y, drawMode = "design") {
    // Draw a piece at a specific temporary location.

    // Ensure integer values for width based on draw mode
    const newWidth =
      drawMode === "design" ? Math.round(this.width) : Math.round(this.width * QUILT_SCALE);
    const newX = Math.round(x);
    const newY = Math.round(y);

    // Create a temporary rectangle for drawing
    const tempRect = {
      left: newX,
      right: newX + newWidth,
      top: newY,
      bottom: newY + newWidth,
      width: newWidth,
      height: newWidth,
    };

    // Pass the temp_rect to the draw function
    this.draw(p, tempRect);
  }

  serialize() {
    return {
      type: this.type,
      x: this.x,
      y: this.y,
      width: this.width,
      rotation: this.rotation,
      color: this.color,
    };
  }

  static deserialize(data) {
    return new Piece(data.type, data.x, data.y, data.width, data.rotation, data.color);
  }
}

export class Block {
  constructor(
    rows = 8,
    cols = 8,
    coords = BLOCK_COORDS,
    pieceWidth = DEFAULT_PIECE_WIDTH,
    pieces = null
  ) {
    this.rows = rows;
    this.cols = cols;
    this.coords = coords; // [x, y] of top left of block
    this.pieceWidth = pieceWidth;
    this.mirrorType = 4; // Available: 0, 1, 2, 3, 4
    this.pieces = pieces ? pieces : this.initBlock();
    this.x = coords[0];
    this.y = coords[1];
    this.width = this.cols * pieceWidth;
    this.height = this.rows * pieceWidth;
  }

  initBlock() {
    // Create a 2D array of placeholder pieces
    let pieces = [];
    for (let r = 0; r < this.rows; r++) {
      let rowPieces = [];
      for (let c = 0; c < this.cols; c++) {
        let x = this.coords[0] + c * this.pieceWidth;
        let y = this.coords[1] + r * this.pieceWidth;
        rowPieces.push(new Piece("placeholder", x, y, this.pieceWidth, "white"));
      }
      pieces.push(rowPieces);
    }
    return pieces;
  }

  mirrorPieces() {
    /**
     * Mirrors the pieces set in the top-left quadrant to the other quadrants
     * of the block based on the mirror type.
     */

    // Define how each quadrant should mirror the top-left quadrant
    const mirrorTypeTransformations = [
      // [(r,c) => [new_row, new_col], rotation_map]
      // Mirror Type 0 (duplicate)
      [
        [(r, c) => [r, c + this.cols / 2], { 0: 0, 1: 1, 2: 2, 3: 3 }], // Top-right
        [(r, c) => [r + this.rows / 2, c], { 0: 0, 1: 1, 2: 2, 3: 3 }], // Bottom-left
        [(r, c) => [r + this.rows / 2, c + this.cols / 2], { 0: 0, 1: 1, 2: 2, 3: 3 }], // Bottom-right
      ],
      // Mirror Type 1 (classic mirror)
      [
        [(r, c) => [r, this.cols - 1 - c], { 0: 1, 1: 0, 2: 3, 3: 2 }], // Top-right
        [(r, c) => [this.rows - 1 - r, c], { 0: 3, 1: 2, 2: 1, 3: 0 }], // Bottom-left
        [(r, c) => [this.rows - 1 - r, this.cols - 1 - c], { 0: 2, 1: 3, 2: 0, 3: 1 }], // Bottom-right
      ],
      // Mirror Type 2 (vertical mirror)
      [
        [(r, c) => [r, this.cols - 1 - c], { 0: 1, 1: 0, 2: 3, 3: 2 }], // Top-right
        [(r, c) => [r + this.rows / 2, c], { 0: 0, 1: 1, 2: 2, 3: 3 }], // Bottom-left
        [(r, c) => [r + this.rows / 2, this.cols - 1 - c], { 0: 1, 1: 0, 2: 3, 3: 2 }], // Bottom-right
      ],
      // Mirror Type 3 (horizontal mirror)
      [
        [(r, c) => [r, c + this.cols / 2], { 0: 0, 1: 1, 2: 2, 3: 3 }], // Top-right
        [(r, c) => [this.rows - 1 - r, c], { 0: 3, 1: 2, 2: 1, 3: 0 }], // Bottom-left
        [(r, c) => [this.rows - 1 - r, c + this.cols / 2], { 0: 3, 1: 2, 2: 1, 3: 0 }], // Bottom-right
      ],
      // Mirror Type 4 (spiral)
      [
        [(r, c) => [c, this.cols - 1 - r], { 0: 1, 1: 2, 2: 3, 3: 0 }], // Top-right
        [(r, c) => [this.rows - 1 - c, r], { 0: 3, 1: 0, 2: 1, 3: 2 }], // Bottom-left
        [(r, c) => [this.rows - 1 - r, this.cols - 1 - c], { 0: 2, 1: 3, 2: 0, 3: 1 }], // Bottom-right
      ],
    ];

    for (let r = 0; r < this.rows / 2; r++) {
      for (let c = 0; c < this.cols / 2; c++) {
        for (let [transform, rotationMap] of mirrorTypeTransformations[this.mirrorType]) {
          let [newR, newC] = transform(r, c);
          this._mirrorPiece(r, c, newR, newC, rotationMap);
        }
      }
    }
  }

  _mirrorPiece(srcR, srcC, destR, destC, rotationMap) {
    // Helper function to create and set a mirrored piece in the block based on the destination and rotation map
    // from mirrorPieces()

    let piece = this.pieces[srcR][srcC];
    let newRotation = rotationMap[piece.rotation];

    let x = this.coords[0] + destC * this.pieceWidth;
    let y = this.coords[1] + destR * this.pieceWidth;

    this.pieces[destR][destC] = new Piece(piece.type, x, y, piece.width, newRotation, piece.color);
  }

  updateMirrorType(newMirrorType) {
    /**
     * Updates the mirror type and redraws the block.
     */
    this.mirrorType = newMirrorType;
    this.mirrorPieces();
  }

  randomFill(lightColor, darkColor) {
    /**
     * Fill the top left quadrant of the block with random pieces, based on current color settings.
     * The top left quadrant will then be mirrored to fill in the rest of the block.
     */
    for (let r = 0; r < this.rows / 2; r++) {
      for (let c = 0; c < this.cols / 2; c++) {
        // get a random piece type
        let pieceType = ["full_dark", "full_light", "diagonal"][Math.floor(Math.random() * 3)];

        // get a random piece rotation (4 possible rotations for diagonal pieces)
        let rotation = Math.floor(Math.random() * 4);

        this.pieces[r][c] = new Piece(
          pieceType,
          [this.x, this.y],
          [r, c],
          this.pieceWidth,
          rotation,
          [lightColor, darkColor]
        );
      }
    }
    this.mirrorPieces();
  }

  invertColors() {
    // Inverts the colors of the block pieces, keeping the same block design.
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        let piece = this.pieces[row][col];
        let ogLightColor = piece.color[0];
        piece.color = [piece.color[1], ogLightColor];
      }
    }
  }

  updateAllPieceColors(newLightColor, newDarkColor) {
    // Updates the colors of all of the pieces in the block.
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        let piece = this.pieces[row][col];
        piece.color[0] = newLightColor;
        piece.color[1] = newDarkColor;
      }
    }
  }

  drawDesignMode(p) {
    // Draw a large single block for editing.
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const pieceX = this.x + col * this.pieceWidth;
        const pieceY = this.y + row * this.pieceWidth;
        this.pieces[row][col].drawAt(p, pieceX, pieceY, "design");
      }
    }
  }

  drawQuiltMode(p, quiltRows, quiltCols) {
    // Draws multiple smaller copies of this block to form a repeating quilt pattern."""
    const quiltX = QUILT_COORDS[0];
    const quiltY = QUILT_COORDS[1];

    for (let qr = 0; qr < quiltRows; qr++) {
      for (let qc = 0; qc < quiltCols; qc++) {
        // Calculate where this block should start in quilt mode
        const blockX = quiltX + qc * this.width * QUILT_SCALE;
        const blockY = quiltY + qr * this.height * QUILT_SCALE;

        for (let row = 0; row < this.rows; row++) {
          for (let col = 0; col < this.cols; col++) {
            let piece = this.pieces[row][col];

            // Scale the piece's position relative to the block's position
            const pieceX = blockX + col * this.pieceWidth * QUILT_SCALE;
            const pieceY = blockY + row * this.pieceWidth * QUILT_SCALE;

            piece.drawAt(p, pieceX, pieceY, "quilt");
          }
        }
      }
    }
  }

  saveToLocalStorage(blockName) {
    if (!blockName) {
      console.error("Block name is required to save.");
      return;
    }
    // Retrieve existing saved blocks
    let savedBlocks = JSON.parse(localStorage.getItem("savedBlocks")) || [];

    // Save current block data under the given name
    let blockData = this.serialize();
    blockData.name = blockName; // Store the block name inside the object

    // Add new block to the array
    savedBlocks.push(blockData);

    // Save back to localStorage
    localStorage.setItem("savedBlocks", JSON.stringify(savedBlocks));

    console.log(`Block "${blockName}" saved.`);
  }

  static loadFromLocalStorage(index) {
    let savedBlocks = JSON.parse(localStorage.getItem("savedBlocks")) || {};
    if (!savedBlocks[index]) {
      console.error(`Block index ${index} not found in localStorage.`);
      return null;
    }

    console.log("Block data being loaded:", savedBlocks[index]);

    const deserializedBlock = Block.deserialize(savedBlocks[index]);

    console.log("deserializedBlock:", deserializedBlock);

    return deserializedBlock; // Convert back to a Block instance
  }

  static deleteFromLocalStorage(index) {
    try {
      let savedBlocks = JSON.parse(localStorage.getItem("savedBlocks")) || [];
      if (index < 0 || index >= savedBlocks.length) {
        console.warn("Invalid index for deletion.");
        return false;
      }

      savedBlocks.splice(index, 1);
      localStorage.setItem("savedBlocks", JSON.stringify(savedBlocks));
      return true;
    } catch (err) {
      console.error("Failed to delete block from localStorage:", err);
      return false;
    }
  }

  serialize() {
    return {
      block: {
        rows: this.rows,
        cols: this.cols,
        coords: this.coords,
        pieceWidth: this.pieceWidth,
        pieces: this.pieces.map((row) => row.map((piece) => piece.serialize())),
        options: { mirrorType: this.mirrorType },
      },
    };
  }

  static deserialize(data) {
    return new Block(
      data.block.rows,
      data.block.cols,
      data.block.coords,
      data.block.pieceWidth,
      data.block.pieces.map((row) => row.map((pieceData) => Piece.deserialize(pieceData)))
    );
  }
}

export class PieceOptions {
  constructor() {
    this.coords = [XRES - BLOCK_COORDS[0] - DEFAULT_PIECE_WIDTH, BLOCK_COORDS[1]];
    this.width = DEFAULT_PIECE_WIDTH;
    this.options = this.createPieceOptions();
    this.selectedPiece = null;
  }
  createPieceOptions() {
    let options = [];

    for (let i = 0; i < NUM_PIECE_OPTIONS; i++) {
      let type, rotation;

      // Create the two solid block types:
      if (i === 0) {
        type = "full_light";
        rotation = 0;
      } else if (i === 1) {
        type = "full_dark";
        rotation = 0;
      }
      // Create the four diagonal block types
      else {
        type = "diagonal";
        rotation = i - 2;
      }

      let x = this.coords[0];
      let y = this.coords[1] + i * this.width;
      let newPiece = new Piece(type, x, y, this.width, rotation);
      options.push(newPiece);
    }

    return options;
  }

  draw(p) {
    for (let i = 0; i < NUM_PIECE_OPTIONS; i++) {
      this.options[i].draw(p);
    }

    // draw an outline around the selected piece
    if (this.selectedPiece) {
      let piece = this.selectedPiece;
      p.noFill();
      p.stroke(HIGHLIGHT_COLOR); // RGB: Yellow   TODO: Use variable
      p.strokeWeight(2);
      p.rect(piece.rect.left - 1, piece.rect.top - 1, piece.rect.width + 1, piece.rect.width + 1);
    }
  }

  updateColors(colorOptionObj) {
    for (let i = 0; i < NUM_PIECE_OPTIONS; i++) {
      if (colorOptionObj.colorType === "dark") {
        this.options[i].color[1] = colorOptionObj.color;
      }
      if (colorOptionObj.colorType === "light") {
        this.options[i].color[0] = colorOptionObj.color;
      }
    }
  }

  selectPiece(pieceOption) {
    this.selectedPiece = pieceOption;
  }
}

export class ColorOption {
  constructor(color, colorType, coords) {
    this.coords = coords; // [x, y]
    this.color = color;
    this.colorType = colorType; // 'dark' or 'light'
    this.width = DEFAULT_PIECE_WIDTH;
    this.rect = this.createRect();
  }

  createRect() {
    /* Create a helpful rect property with size and position attributes based off
       of the color option's position */

    let rect = {
      left: this.coords[0],
      right: this.coords[0] + this.width,
      top: this.coords[1],
      bottom: this.coords[1] + this.width,
      width: this.width,
      height: this.width,
    };

    return rect;
  }

  draw(p) {
    // console.log(`Drawing color option: ${this.color} at ${this.coords}.`);
    const rect = this.rect;
    p.fill(this.color);
    p.noStroke();
    p.rect(rect.left, rect.top, rect.width, rect.width);
  }
}

export class ColorOptions {
  constructor(lightColors = LIGHT_COLORS, darkColors = DARK_COLORS) {
    this.coords = [BLOCK_COORDS[0], 8 * DEFAULT_PIECE_WIDTH + BLOCK_COORDS[1] * 2]; // [x,y] pos of color options block
    this.options = [];
    this.selectedColor = null;
    this.createColorOptions(lightColors, darkColors);
  }

  createColorOptions(lightColors = LIGHT_COLORS, darkColors = DARK_COLORS) {
    let options = [];

    for (let i = 0; i < lightColors.length; i++) {
      let x = this.coords[0] + i * DEFAULT_PIECE_WIDTH;
      let y = this.coords[1];

      let newColorOption = new ColorOption(lightColors[i], "light", [x, y]);
      options.push(newColorOption);
    }

    for (let i = 0; i < darkColors.length; i++) {
      let x = this.coords[0] + i * DEFAULT_PIECE_WIDTH;
      let y = this.coords[1] + DEFAULT_PIECE_WIDTH; // one row below dark colors

      let newColorOption = new ColorOption(darkColors[i], "dark", [x, y]);
      options.push(newColorOption);
    }

    this.options = options;
  }

  draw(p) {
    for (let i = 0; i < this.options.length; i++) {
      // draw each color option block
      this.options[i].draw(p);
    }

    // draw an outline around the selected color
    if (this.selectedColor) {
      let colorOption = this.selectedColor;
      p.noFill();
      p.stroke(HIGHLIGHT_COLOR); // RGB: Yellow   TODO: Use variable
      p.strokeWeight(2);
      p.rect(
        colorOption.rect.left - 1,
        colorOption.rect.top - 1,
        colorOption.rect.width + 1,
        colorOption.rect.width + 1
      );
    }
  }

  selectColor(colorOption) {
    this.selectedColor = colorOption;
  }
}
