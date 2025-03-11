import { useState } from "react";
import "./App.css";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import NavBar from "./components/NavBar";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import SketchInputs from "./components/SketchInputs";
import P5Wrapper from "./components/P5Wrapper";

// Import sketches
import quiltGenerator from "./quilt-generator-p5-sketch";

const sketchParams = {
  radius: {
    value: 50,
    type: "slider",
    min: 5,
    max: 100,
    label: "Circle Radius",
  },
  circleColor: { value: "#ff0000", type: "color", label: "Circle Color" },
};

function App() {
  const [params, setParams] = useState(sketchParams);

  // Handle changes to any parameter by key
  const handleParamChange = (key, value) => {
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
            <P5Wrapper sketch={quiltGenerator} params={params} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default App;
