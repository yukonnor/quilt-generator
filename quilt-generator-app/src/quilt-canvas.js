import { Block, ColorOptions, PieceOptions } from "./models/models";
import { XRES, YRES, LIGHT_COLORS, DARK_COLORS } from "./models/constants";

const quiltCanvas = (p, onParamChange) => {
  let block;
  let mode = "design"; // "quilt"
  let selectedPieceOption = null;
  let showDesignTools = true;
  let pieceOptions;
  let colorOptions;

  p.setup = () => {
    console.log("Params on startup:", p.params);
    p.createCanvas(XRES, YRES);
    p.background(25);

    // Instantiate the block
    block = new Block(8, 8);

    // Create color options
    colorOptions = new ColorOptions(LIGHT_COLORS, DARK_COLORS);

    // Create piece options
    pieceOptions = new PieceOptions();

    // Assign functions to action buttons found in p.params so they can be accessed externally
    if (p.params) {
      p.params.viewMode.setMode = (clickedMode) => {
        mode = clickedMode;
      };

      p.params.mirrorType.updateMirrorType = (mirrorType) => block.updateMirrorType(mirrorType);

      p.params.color.setColor = (color) => (colorOptions.selectedColor.color = color);

      p.params.randomFill = () => {
        let lightColor = pieceOptions.options[0].color[0];
        let darkColor = pieceOptions.options[0].color[1];
        block.randomFill(lightColor, darkColor);
      };

      p.params.invertColors = () => block.invertColors();

      p.params.updateAllPieceColors = () => {
        let lightColor = pieceOptions.options[0].color[0];
        let darkColor = pieceOptions.options[0].color[1];
        block.updateAllPieceColors(lightColor, darkColor);
      };
    }

    console.log("colorOptions in setup:", colorOptions);
  };

  p.draw = () => {
    p.background(25);

    if (mode === "design") {
      block.drawDesignMode(p);
      pieceOptions.draw(p);
      colorOptions.draw(p);
    }

    if (mode === "quilt") {
      block.drawQuiltMode(p, 5, 4);
    }
  };

  p.mousePressed = () => {
    let pieceClicked = false;

    if (!colorOptions || !colorOptions.options) {
      console.warn("colorOptions is not ready yet.");
      return;
    }

    // If colorOption clicked, update pieceOption colors
    for (let colorOption of colorOptions.options) {
      if (
        p.mouseX >= colorOption.coords[0] &&
        p.mouseX <= colorOption.coords[0] + colorOption.width &&
        p.mouseY >= colorOption.coords[1] &&
        p.mouseY <= colorOption.coords[1] + colorOption.width
      ) {
        pieceOptions.updateColors(colorOption);
        pieceClicked = true;
      }
    }

    // If pieceOption clicked, select the pieceOption
    for (let pieceOption of pieceOptions.options) {
      if (
        p.mouseX >= pieceOption.rect.left &&
        p.mouseX <= pieceOption.rect.right &&
        p.mouseY >= pieceOption.rect.top &&
        p.mouseY <= pieceOption.rect.bottom
      ) {
        pieceOptions.selectPiece(pieceOption);
        pieceClicked = true;
      }
    }

    // If colorOption clicked, select the colorOption
    for (let colorOption of colorOptions.options) {
      if (
        p.mouseX >= colorOption.rect.left &&
        p.mouseX <= colorOption.rect.right &&
        p.mouseY >= colorOption.rect.top &&
        p.mouseY <= colorOption.rect.bottom
      ) {
        colorOptions.selectColor(colorOption);
        onParamChange("color", colorOption.color);
        pieceClicked = true;
      }
    }

    // If block piece clicked, set it to the selected pieceOption
    if (pieceOptions.selectedPiece) {
      for (let row of block.pieces) {
        for (let piece of row) {
          if (
            p.mouseX >= piece.rect.left &&
            p.mouseX <= piece.rect.right &&
            p.mouseY >= piece.rect.top &&
            p.mouseY <= piece.rect.bottom
          ) {
            piece.type = pieceOptions.selectedPiece.type;
            piece.rotation = pieceOptions.selectedPiece.rotation;
            piece.color = [...pieceOptions.selectedPiece.color];
            pieceClicked = true;
          }
        }
      }
    }

    // if clicked outside of the canvas, keep current selections
    if (p.mouseX > XRES || p.mouseX < 0 || p.mouseY >= YRES || p.mouseY < 0) {
      pieceClicked = true;
    }

    // if click didn't collide with anything in the canvas, deselect the selected piece option
    if (!pieceClicked) {
      pieceOptions.selectPiece(null);
      colorOptions.selectColor(null);
    }
  };

  p.keyReleased = () => {
    if (!pieceOptions || !pieceOptions.options) {
      console.warn("pieceOptions is not ready yet.");
      return;
    }

    // RANDOM FILL
    if (p.keyCode === p.ENTER) {
      let lightColor = pieceOptions.options[0].color[0];
      let darkColor = pieceOptions.options[0].color[1];
      block.randomFill(lightColor, darkColor);
    }
    // SWITCH MODES
    if (p.key === "q") {
      mode = mode === "design" ? "quilt" : "design";
    }
    // SWITCH MIRROR TYPES
    if (p.key === "z") {
      block.updateMirrorType(0);
    }
    if (p.key === "x") {
      block.updateMirrorType(1);
    }
    if (p.key === "c") {
      block.updateMirrorType(2);
    }
    if (p.key === "v") {
      block.updateMirrorType(3);
    }
    if (p.key === "b") {
      block.updateMirrorType(4);
    }
    // INVERT COLORS
    if (p.key === "i") {
      block.invertColors();
    }
  };
};

export default quiltCanvas;
