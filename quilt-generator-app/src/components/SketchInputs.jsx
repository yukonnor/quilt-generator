// src/components/SketchInputs.jsx
import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ColorInput from "./ColorInput";

const SketchInputs = ({ params, onParamChange }) => {
  console.log("SketchInputs params:", params);
  return (
    <Card className="quilt-inputs">
      <CardContent>
        <h3>Quilt Inputs</h3>

        {/* radius */}
        <Typography gutterBottom>{params.radius.label}</Typography>
        <Slider
          value={params.radius.value}
          min={params.radius.min}
          max={params.radius.max}
          valueLabelDisplay="auto"
          onChange={(e) => onParamChange("radius", e.target.value)}
        />

        {/* circleColor */}
        <ColorInput
          value={params.circleColor.value}
          onChange={(newColor) => onParamChange("circleColor", newColor)}
        />

        {/* randomFill */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (params.randomFill) {
              params.randomFill(); // Call randomFill if it exists
            } else {
              console.log("randomFill function doesn't exist yet...");
            }
          }}
        >
          Randomize!
        </Button>
      </CardContent>
    </Card>
  );
};

export default SketchInputs;
