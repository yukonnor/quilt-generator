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
import redCircles from "./sketches/red-circles";
import greenTriangles from "./sketches/green-triangles";

const sketches = {
    redCircles: {
        sketch: redCircles,
        name: "Red Circles",
        sketchParams: {
            radius: { value: 50, type: "slider", min: 5, max: 100, label: "Circle Radius" },
            circleColor: { value: "#ff0000", type: "color", label: "Circle Color" },
        },
    },
    greenTriangles: {
        sketch: greenTriangles,
        name: "Green Triangles",
        sketchParams: {
            sideLength: { value: 30, type: "slider", min: 10, max: 200, label: "Side Length" },
            triangleColor: { value: "#00ff00", type: "color", label: "Triangle Color" },
        },
    },
};

function App() {
    const [selectedSketch, setSelectedSketch] = useState("redCircles");
    const [params, setParams] = useState(sketches[selectedSketch].sketchParams);

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

    // Handle sketch selection and set params to selected sketch's default params
    const handleSketchChange = (event) => {
        const sketchName = event.target.value;
        setSelectedSketch(sketchName);
        setParams(sketches[sketchName].sketchParams); // Update params to the new sketch's defaults
    };

    return (
        <>
            <NavBar />
            <Box sx={{ flexGrow: 1 }} id="main-sketch-area">
                <Grid container spacing={2}>
                    <Typography variant="h6" gutterBottom>
                        Sketch:
                    </Typography>
                    <Select value={selectedSketch} onChange={handleSketchChange}>
                        {Object.keys(sketches).map((key) => (
                            <MenuItem key={key} value={key}>
                                {sketches[key].name}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>

                <h1>{sketches[selectedSketch].name}</h1>

                <Grid container spacing={2}>
                    <Grid size={4}>
                        <SketchInputs params={params} onParamChange={handleParamChange} />
                    </Grid>
                    <Grid size={8}>
                        <P5Wrapper sketch={sketches[selectedSketch].sketch} params={params} />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default App;
