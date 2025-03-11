import { Piece } from "./models/models";

const quiltCanvas = (p) => {
  let piece;
  let piece1;
  let piece2;
  let piece3;

  p.setup = () => {
    p.createCanvas(800, 800);
    p.background(25);
    piece = new Piece("diagonal", [50, 50], [0, 0], 100, 0, ["blue", "red"]); // Added size
    piece1 = new Piece("diagonal", [50, 50], [0, 1], 100, 1, ["blue", "red"]); // Added size
    piece2 = new Piece("diagonal", [50, 50], [1, 0], 100, 2, ["blue", "red"]); // Added size
    piece3 = new Piece("diagonal", [50, 50], [1, 1], 100, 3, ["blue", "red"]); // Added size
  };

  p.draw = () => {
    piece.draw(p); // Pass `p` instance to Piece
    piece1.draw(p); // Pass `p` instance to Piece
    piece2.draw(p); // Pass `p` instance to Piece
    piece3.draw(p); // Pass `p` instance to Piece
  };
};

export default quiltCanvas;
