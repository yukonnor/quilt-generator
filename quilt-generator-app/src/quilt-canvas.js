import { Piece, Block } from "./models/models";

const quiltCanvas = (p) => {
  let block;
  let mode = "design"; // "quilt_preview"

  p.setup = () => {
    p.createCanvas(800, 800);
    p.background(25);

    block = new Block(8, 8, 50, 50, 70);

    // Assign functions to action buttons found in p.params so they can be accessed externally
    if (p.params) {
      p.params.randomFill = () => block.randomFill("green", "blue");
    }
  };

  p.draw = () => {
    p.background(25);

    if (mode === "design") {
      block.draw_design_mode(p);
    }

    if (mode === "quilt_preview") {
      block.draw_quilt_mode(p, 5, 4);
    }
  };

  p.keyReleased = () => {
    if (p.key === "q") {
      mode = mode === "design" ? "quilt_preview" : "design";
    }

    if (p.keyCode === p.ENTER) {
      block.randomFill("green", "blue");
    }
  };
};

export default quiltCanvas;
