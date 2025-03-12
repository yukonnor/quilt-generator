import {
  DARK_COLORS,
  LIGHT_COLORS,
  BLOCK_POS_OFFSET,
  QUILT_SCALE,
  QUILT_COORDS,
} from "./constants";

export class Piece {
  constructor(type = "placeholder", block_coords, block_pos, width = 50, rotation = 0, color) {
    this.type = type; // "placeholder", "full_dark", "full_light", "diagonal"
    this.block_coords = block_coords; // [x, y]
    this.block_pos = block_pos; // [r, c]
    this.width = width;
    this.rotation = rotation; // 0, 1, 2, 3
    this.color = color; // [light color, dark color]

    this.rect = this.create_rect();
    this.x = this.rect.left;
    this.y = this.rect.top;

    /*
    ROTATION:
    0:  light / dark
    1:  dark \ light
    2:  dark / light
    3:  light \ dark
    */
  }

  create_rect() {
    /* Create a helpful rect property with size and position attributes based off
       of the piece's position in a block  */

    let x_adj = this.block_pos[1] * this.width;
    let y_adj = this.block_pos[0] * this.width;

    let rect = {
      left: this.block_coords[0] + x_adj,
      right: this.block_coords[0] + x_adj + this.width,
      top: this.block_coords[1] + y_adj,
      bottom: this.block_coords[1] + y_adj + this.width,
      width: this.width,
      height: this.width,
    };

    return rect;
  }

  draw(p, provided_rect = null) {
    // console.log("Drawing piece");

    // If rect provided, use it. Otherwise use default rect.
    let rect = provided_rect ? provided_rect : this.rect;

    if (this.type === "placeholder") {
      p.noFill();
      p.stroke(255, 204, 0); // RGB: Yellow   TODO: Use variable
      p.strokeWeight(2);
      p.rect(rect.left, rect.top, rect.width, rect.width);
    } else if (this.type === "full_dark") {
      p.fill(this.color[1]);
      p.noStroke();
      p.rect(rect.left, rect.top, rect.width, rect.width);
    } else if (this.type === "full_light") {
      p.fill(this.color[0]);
      p.noStroke();
      p.rect(rect.left, rect.top, rect.width, rect.width);
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
}

export class Block {
  constructor(rows = 8, cols = 8, x = 0, y = 0, pieceWidth = 50) {
    this.rows = rows;
    this.cols = cols;
    this.x = x;
    this.y = y;
    this.pieceWidth = pieceWidth;
    this.mirrorType = 4; // Available: 0, 1, 2, 3, 4

    this.pieces = this.initBlock(); // create a 2D array of placeholder pieces
    this.randRotationOptions = [0, 1, 2, 3];
    this.width = this.cols * pieceWidth;
    this.height = this.rows * pieceWidth;
  }

  initBlock() {
    // Create a 2D array of placeholder pieces
    let pieces = [];
    for (let r = 0; r < this.rows; r++) {
      pieces.push([]);
      for (let c = 0; c < this.cols; c++) {
        pieces[r].push(new Piece("placeholder", [this.x, this.y], [r, c]));
      }
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
        [(r, c) => [r, this.cols - 1 - c], { 0: 1, 1: 0, 2: 2, 3: 3 }], // Top-right
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

    this.pieces[destR][destC] = new Piece(
      piece.type,
      [this.x, this.y],
      [destR, destC],
      piece.width,
      newRotation,
      piece.color
    );
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

        // get a random piece rotation (for diagonal pieces)
        let rotation =
          this.randRotationOptions[Math.floor(Math.random() * this.randRotationOptions.length)];

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

  invert_colors() {
    // Inverts the colors of the block pieces, keeping the same block design.
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        let piece = this.pieces[row][col];
        let ogLightColor = piece.color[0];
        piece.color = [piece.color[1], ogLightColor];
      }
    }
  }

  update_piece_colors(newLightColor, newDarkColor) {
    // Updates the colors of all of the pieces in the block.
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        let piece = this.pieces[row][col];
        piece.piece.color = [newLightColor, newDarkColor];
      }
    }
  }

  draw_design_mode(p) {
    // Draw a large single block for editing.
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const pieceX = this.x + col * this.pieceWidth;
        const pieceY = this.y + row * this.pieceWidth;
        this.pieces[row][col].drawAt(p, pieceX, pieceY, "design");
      }
    }
  }

  draw_quilt_mode(p, quiltRows, quiltCols) {
    // Draws multiple smaller copies of this block to form a repeating quilt pattern."""
    const quiltX = QUILT_COORDS[0];
    const quiltY = QUILT_COORDS[1];

    for (let qr = 0; qr < quiltRows; qr++) {
      for (let qc = 0; qc < quiltCols; qc++) {
        let blockX = quiltX + qc * this.width * QUILT_SCALE;
        let blockY = quiltY + qr * this.width * QUILT_SCALE;

        for (let row = 0; row < this.rows; row++) {
          for (let col = 0; col < this.cols; col++) {
            let piece = this.pieces[row][col];
            const pieceX = blockX + piece.block_pos[1] * piece.width * QUILT_SCALE;
            const pieceY = blockY + piece.block_pos[0] * piece.width * QUILT_SCALE;
            piece.drawAt(p, pieceX, pieceY, "quilt");
          }
        }
      }
    }
  }
}
