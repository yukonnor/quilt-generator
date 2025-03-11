export class Piece {
  constructor(
    type = "placeholder",
    block_coords,
    block_pos,
    width = 50,
    rotation = 0,
    color
  ) {
    this.type = type; // "placeholder", "full_dark", "full_light", "diagonal"
    this.block_coords = block_coords; // [x, y]
    this.block_pos = block_pos; // [r, c]
    this.width = width;
    this.rotation = rotation; // 0, 1, 2, 3
    this.color = color; // [dark color, light color]

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

  draw(p) {
    // console.log("Drawing piece");
    if (this.type === "full_dark") {
      p.fill(this.color[0]);
      p.rect(this.x, this.y, this.width, this.width);
    } else if (this.type === "full_light") {
      p.fill(this.color[1]);
      p.rect(this.x, this.y, this.width, this.width);
    } else if (this.type === "diagonal") {
      // Draw two triangles for diagonal split
      p.fill(this.color[0]);
      p.triangle(
        this.x,
        this.y,
        this.x + this.width,
        this.y,
        this.x,
        this.y + this.width
      );

      p.fill(this.color[1]);
      p.triangle(
        this.x + this.width,
        this.y,
        this.x + this.width,
        this.y + this.width,
        this.x,
        this.y + this.width
      );
    }
  }
}
