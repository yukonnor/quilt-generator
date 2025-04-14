import { useState } from "react";
import "./App.css";
import useLocalStorageState from "./hooks/useLocalStorage";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import NavBar from "./components/NavBar";
import SavedBlocks from "./components/SavedBlocks";

import SketchInputs from "./components/SketchInputs";
import P5Wrapper from "./components/P5Wrapper";

// Import sketches
import quiltCanvas from "./quilt-canvas";

const sketchParams = {
  // Note: Actions / functions / methods set in quiltCanvas
  viewMode: "design",
  setViewMode: null,
  mirrorType: 4,
  updateMirrorType: null,
  color: "#ff0000",
  setColor: null,
  restoreColors: null,
  randomFill: null,
  invertColors: null,
  updateAllPieceColors: null,
  saveBlock: null,
  loadBlock: null,
  deleteBlock: null,
};

function App() {
  const [params, setParams] = useState(sketchParams);
  const [savedBlocks, setSavedBlocks] = useLocalStorageState("savedBlocks", []);

  // Handle changes to any parameter by key
  const handleParamChange = (key, value) => {
    console.log("Param changed:", key, value);
    setParams((prevParams) => ({
      ...prevParams,
      [key]: value,
    }));

    console.log("New params:", params);
  };

  // Function to let users download blocks from Local Storage to JSON file
  const downloadSavedBlocks = () => {
    const blob = new Blob([JSON.stringify(savedBlocks, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "saved_blocks.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
            <P5Wrapper sketch={quiltCanvas} params={params} setParams={setParams} />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }} id="saved-blocks">
        <Grid container spacing={2}>
          <Grid size={12}>
            <SavedBlocks
              savedBlocks={savedBlocks}
              setSavedBlocks={setSavedBlocks}
              saveBlock={params.saveBlock}
              loadBlock={params.loadBlock}
              deleteBlock={params.deleteBlock}
              downloadSavedBlocks={downloadSavedBlocks}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default App;
