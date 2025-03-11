import { Piece } from "./models/models";

const quiltCanvas = (p) => {
  let piece;

  p.setup = () => {
    p.createCanvas(800, 800);
    p.background(25);
    piece = new Piece("diagonal", [50, 50], [0, 0], 100, 0, ["blue", "red"]); // Added size
  };

  p.draw = () => {
    piece.draw(p); // Pass `p` instance to Piece
  };
};

export default quiltCanvas;
