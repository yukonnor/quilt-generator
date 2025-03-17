// src/components/SketchInputs.jsx
import React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Slider,
  Button,
  ButtonGroup,
  Typography,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import ColorInput from "./ColorInput";

const SketchInputs = ({ params, onParamChange }) => {
  console.log("In SketchInputs. Re-rendering / Params changed:", params);

  // // Local state to track color input value
  // const [colorValue, setColorValue] = useState(params.color.value);

  // // Sync local state with params.color.value when params change
  // useEffect(() => {
  //   setColorValue(params.color.value);
  // }, [params.color.value]);

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

        {/* viewMode */}
        <Typography gutterBottom>View Mode:</Typography>
        <Tooltip title="Shortcut: Q">
          <ToggleButtonGroup
            color="primary"
            exclusive
            value={params.viewMode.value}
            onChange={(_, newMode) => {
              if (newMode !== null) {
                params.viewMode.setMode(newMode);
                onParamChange("viewMode", newMode);
              }
            }}
            aria-label="View Mode"
          >
            <ToggleButton value="design">Design</ToggleButton>
            <ToggleButton value="quilt">Quilt</ToggleButton>
          </ToggleButtonGroup>
        </Tooltip>

        {/* mirrorTypes */}
        <Typography gutterBottom>Mirror Type</Typography>
        <Tooltip title="Shortcut: Z,X,C,V,B">
          <ToggleButtonGroup
            color="primary"
            exclusive
            value={params.mirrorType.value}
            onChange={(_, newMirrorType) => {
              if (newMirrorType !== null) {
                params.mirrorType.updateMirrorType(newMirrorType);
                onParamChange("mirrorType", newMirrorType);
              }
            }}
            aria-label="Mirror Type"
          >
            <ToggleButton value={0}>0</ToggleButton>
            <ToggleButton value={1}>1</ToggleButton>
            <ToggleButton value={2}>2</ToggleButton>
            <ToggleButton value={3}>3</ToggleButton>
            <ToggleButton value={4}>4</ToggleButton>
          </ToggleButtonGroup>
        </Tooltip>

        {/* randomFill */}
        <Typography gutterBottom>Actions:</Typography>
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

        {/* updateAllPieceColors */}
        <Typography gutterBottom></Typography>
        <Tooltip title="Shortcut: tbd">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              if (params.invertColors) {
                params.updateAllPieceColors();
              }
            }}
          >
            Update Block Colors
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

        {/* color */}
        <Typography gutterBottom>Update Color Palette</Typography>
        <ColorInput
          value={params.color.value}
          onChange={(newColor) => {
            if (newColor !== null) {
              onParamChange("color", newColor);
            }
          }}
        />
        <Button
          variant="outlined"
          color="primary"
          onClick={() => params.color.setColor(params.color.value)}
        >
          Set Color
        </Button>

        <Typography gutterBottom></Typography>
        <Button variant="outlined" color="primary" onClick={() => params.color.restoreColors()}>
          Restore Original Color Palette
        </Button>
      </CardContent>
    </Card>
  );
};

export default SketchInputs;
