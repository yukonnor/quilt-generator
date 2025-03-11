// src/components/SketchInputs.jsx
import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import ColorInput from "./ColorInput";

const SketchInputs = ({ params, onParamChange }) => {
    console.log("SketchInputs params:", params);
    return (
        <Card className="sketch-inputs">
            <CardContent>
                <h3>Sketch Inputs</h3>

                {Object.entries(params).map(([key, { value, type, min, max, label }]) => (
                    <div key={key}>
                        <Typography gutterBottom>{label}</Typography>
                        {type === "slider" && (
                            <Slider
                                value={value}
                                min={min}
                                max={max}
                                valueLabelDisplay="auto"
                                onChange={(e) => onParamChange(key, e.target.value)}
                            />
                        )}
                        {type === "color" && (
                            <ColorInput
                                value={value}
                                onChange={(newColor) => onParamChange(key, newColor)}
                            />
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default SketchInputs;
