import { Piece, Block } from "./models/models";

const quiltCanvas = (p) => {
  let block;

  p.setup = () => {
    p.createCanvas(800, 800);
    p.background(25);

    block = new Block(8, 8, 50, 50, 70);
    block.randomFill("green", "blue");
    block.mirrorPieces();
  };

  p.draw = () => {
    // block.draw_design_mode(p);
    block.draw_quilt_mode(p, 5, 4);
  };
};

export default quiltCanvas;
