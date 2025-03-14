import { Block, ColorOptions, PieceOptions } from "./models/models";
import { XRES, YRES, LIGHT_COLORS, DARK_COLORS } from "./models/constants";

const quiltCanvas = (p) => {
  let block;
  let mode = "design"; // "quilt_preview"
  let selectedPieceOption = null;
  let showDesignTools = true;
  let pieceOptions;
  let colorOptions;

  p.setup = () => {
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
      p.params.randomFill = () => {
        let lightColor = pieceOptions.pieceOptions[0].color[0];
        let darkColor = pieceOptions.pieceOptions[0].color[1];
        block.randomFill(lightColor, darkColor);
      };
      p.params.invertColors = () => block.invertColors();
      p.params.updateMirrorType = (mirrorType) => block.updateMirrorType(mirrorType);
      p.params.updateAllPieceColors = () => {
        let lightColor = pieceOptions.pieceOptions[0].color[0];
        let darkColor = pieceOptions.pieceOptions[0].color[1];
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

    if (mode === "quilt_preview") {
      block.drawQuiltMode(p, 5, 4);
    }
  };

  p.mousePressed = () => {
    if (colorOptions) {
      for (let colorOption of colorOptions.options) {
        if (
          p.mouseX >= colorOption.coords[0] &&
          p.mouseX <= colorOption.coords[0] + colorOption.width &&
          p.mouseY >= colorOption.coords[1] &&
          p.mouseY <= colorOption.coords[1] + colorOption.width
        ) {
          pieceOptions.updateColors(colorOption);
        }
      }
    }
  };

  p.keyReleased = () => {
    // RANDOM FILL
    if (p.keyCode === p.ENTER) {
      let lightColor = pieceOptions.pieceOptions[0].color[0];
      let darkColor = pieceOptions.pieceOptions[0].color[1];
      block.randomFill(lightColor, darkColor);
    }
    // SWITCH MODES
    if (p.key === "q") {
      mode = mode === "design" ? "quilt_preview" : "design";
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
