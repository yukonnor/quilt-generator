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
  viewMode: { value: "design", prevValue: null, setMode: null },
  mirrorType: { value: 4, prevValue: null, updateMirrorType: null },
  color: { value: "#ff0000", prevValue: null, setColor: null },

  // Placeholder for actions / functions / methods to be set in quiltCanvas
  // Values not needed in state.
  randomFill: null,
  invertColors: null,
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
        prevValue: prevParams[key].value, // Set current value to prevValue
        value: value, // Update the value
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
            <P5Wrapper sketch={quiltCanvas} params={params} onParamChange={handleParamChange} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default App;
