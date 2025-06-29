import { Block, ColorOptions, PieceOptions } from "./models/models";
import { XRES, YRES, LIGHT_COLORS, DARK_COLORS } from "./models/constants";

const blockPreviewCanvas = (p, setParams, savedBlock) => {
  let block;
  let mode = "design"; // "quilt"
  let selectedPieceOption = null;
  let showDesignTools = true;
  let pieceOptions;
  let colorOptions;

  p.setup = () => {
    // console.log("Params on startup:", p.params);
    p.createCanvas(XRES, YRES);
    p.background(25);

    // Instantiate the block
    block = Block.deserialize(savedBlock);

    // Create color options
    colorOptions = new ColorOptions(LIGHT_COLORS, DARK_COLORS);

    // Create piece options
    pieceOptions = new PieceOptions();
  };

  p.draw = () => {
    p.background(25);

    if (mode === "design") {
      block.drawDesignMode(p);
    }

    if (mode === "quilt") {
      block.drawQuiltMode(p, 5, 4);
    }
  };

  p.keyReleased = () => {
    if (!pieceOptions || !pieceOptions.options) {
      console.warn("pieceOptions is not ready yet.");
      return;
    }

    // SWITCH MODES
    if (p.key === "q") {
      mode = mode === "design" ? "quilt" : "design";

      // for safety, deselect selected pieces while in quilt mode
      pieceOptions.selectPiece(null);
      colorOptions.selectColor(null);
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

export default blockPreviewCanvas;
