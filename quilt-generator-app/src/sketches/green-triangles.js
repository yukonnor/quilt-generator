// greenTriangles.js
const greenTriangles = (p) => {
    p.setup = () => {
        p.createCanvas(600, 600);
        p.background(p.params?.background || 220);
    };

    p.draw = () => {
        const sideLength = p.params?.sideLength.value || 50;
        p.fill(p.params?.triangleColor.value || "#00ff00");
        if (p.mouseIsPressed) {
            p.triangle(
                p.mouseX,
                p.mouseY,
                p.mouseX - sideLength,
                p.mouseY + sideLength,
                p.mouseX + sideLength,
                p.mouseY + sideLength
            );
        }
    };
};

export default greenTriangles;
