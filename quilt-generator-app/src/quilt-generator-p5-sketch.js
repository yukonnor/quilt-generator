const quiltGenerator = (p) => {
  p.setup = () => {
    p.createCanvas(800, 800);
    p.background(15);
  };

  p.draw = () => {
    // Access the radius parameter dynamically, default to 50
    const radius = p.params?.radius.value || 50;
    p.fill(p.params?.circleColor.value || "#ff0000");

    // draw ellipses if mouse button is pressed
    p.mouseIsPressed && p.ellipse(p.mouseX, p.mouseY, radius, radius);
  };
};

export default quiltGenerator;
