import { Block, ColorOptions } from "./models/models";
import { XRES, YRES, LIGHT_COLORS, DARK_COLORS } from "./models/constants";

const quiltCanvas = (p) => {
  let block;
  let mode = "design"; // "quilt_preview"
  let selectedPieceOption = null;
  let showDesignTools = true;
  let colorOptions;

  p.setup = () => {
    p.createCanvas(XRES, YRES);
    p.background(25);

    // Instantiate the block
    block = new Block(8, 8);

    // Create color options
    colorOptions = new ColorOptions(LIGHT_COLORS, DARK_COLORS);

    // Create piece options

    // Assign functions to action buttons found in p.params so they can be accessed externally
    if (p.params) {
      p.params.randomFill = () => block.randomFill("green", "blue");
      p.params.invertColors = () => block.invertColors();
      p.params.updateMirrorType = (mirrorType) => block.updateMirrorType(mirrorType);
    }
  };

  p.draw = () => {
    p.background(25);

    if (mode === "design") {
      block.drawDesignMode(p);
      colorOptions.draw(p);
    }

    if (mode === "quilt_preview") {
      block.drawQuiltMode(p, 5, 4);
    }
  };

  p.keyReleased = () => {
    // RANDOM FILL
    if (p.keyCode === p.ENTER) {
      block.randomFill("green", "blue");
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
