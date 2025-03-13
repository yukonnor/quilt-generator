// src/components/SketchInputs.jsx
import React from "react";
import { Card, CardContent, Slider, Button, ButtonGroup, Typography, Tooltip } from "@mui/material";
import ColorInput from "./ColorInput";

const SketchInputs = ({ params, onParamChange }) => {
  console.log("SketchInputs params:", params);
  return (
    <Card className="quilt-inputs">
      <CardContent>
        <h3>Quilt Inputs</h3>

        {/* radius */}
        {/* <Typography gutterBottom>{params.radius.label}</Typography>
        <Slider
          value={params.radius.value}
          min={params.radius.min}
          max={params.radius.max}
          valueLabelDisplay="auto"
          onChange={(e) => onParamChange("radius", e.target.value)}
        /> */}

        {/* circleColor */}
        {/* <ColorInput
          value={params.circleColor.value}
          onChange={(newColor) => onParamChange("circleColor", newColor)}
        /> */}

        {/* randomFill */}
        <Typography gutterBottom></Typography>
        <Tooltip title="Shortcut: ENTER">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              if (params.randomFill) {
                params.randomFill();
              } else {
                console.log("randomFill function doesn't exist yet...");
              }
            }}
          >
            Randomize
          </Button>
        </Tooltip>

        {/* invertColors */}
        <Typography gutterBottom></Typography>
        <Tooltip title="Shortcut: I">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              if (params.invertColors) {
                params.invertColors();
              }
            }}
          >
            Invert Colors
          </Button>
        </Tooltip>

        {/* mirrorTypes */}
        <Typography gutterBottom>Mirror Type</Typography>
        <Tooltip title="Shortcut: Z,X,C,V,B">
          <ButtonGroup>
            <Button
              onClick={() => {
                if (params.updateMirrorType) {
                  params.updateMirrorType(0);
                }
              }}
            >
              0
            </Button>
            <Button
              onClick={() => {
                if (params.updateMirrorType) {
                  params.updateMirrorType(1);
                }
              }}
            >
              1
            </Button>
            <Button
              onClick={() => {
                if (params.updateMirrorType) {
                  params.updateMirrorType(2);
                }
              }}
            >
              2
            </Button>
            <Button
              onClick={() => {
                if (params.updateMirrorType) {
                  params.updateMirrorType(3);
                }
              }}
            >
              3
            </Button>
            <Button
              onClick={() => {
                if (params.updateMirrorType) {
                  params.updateMirrorType(4);
                }
              }}
            >
              4
            </Button>
          </ButtonGroup>
        </Tooltip>
      </CardContent>
    </Card>
  );
};

export default SketchInputs;
