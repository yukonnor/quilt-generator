import { useState } from "react";
import "./App.css";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import NavBar from "./components/NavBar";

import SketchInputs from "./components/SketchInputs";
import P5Wrapper from "./components/P5Wrapper";

// Import sketches
import quiltCanvas from "./quilt-canvas";

const sketchParams = {
  radius: {
    value: 50,
    type: "slider",
    min: 5,
    max: 100,
    label: "Circle Radius",
  },
  circleColor: { value: "#ff0000", type: "color", label: "Circle Color" },
  // Placeholder for actions / functions / methods to be set in quiltCanvas
  viewMode: { value: "design", setMode: null },
  randomFill: null,
  invertColors: null,
  mirrorType: { value: 4, updateMirrorType: null },
  updateAllPieceColors: null,
};

function App() {
  const [params, setParams] = useState(sketchParams);

  // Handle changes to any parameter by key
  const handleParamChange = (key, value) => {
    console.log("Param changed:", key, value);
    setParams((prevParams) => ({
      ...prevParams,
      [key]: {
        ...prevParams[key], // Preserve existing parameter structure
        value: value, // Only update the 'value' field
      },
    }));
  };

  return (
    <>
      <NavBar />
      <Box sx={{ flexGrow: 1 }} id="main-sketch-area">
        <h1>Quilt Generator</h1>

        <Grid container spacing={2}>
          <Grid size={4}>
            <SketchInputs params={params} onParamChange={handleParamChange} />
          </Grid>
          <Grid size={8}>
            <P5Wrapper sketch={quiltCanvas} params={params} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default App;
