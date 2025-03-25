import React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  ButtonGroup,
  Typography,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

const SavedBlocks = ({ savedBlocks, saveBlock, loadBlock, downloadSavedBlocks }) => {
  console.log("savedBlocks:", savedBlocks);
  const handleSaveBlock = () => {
    const blockName = prompt("Enter a name for this block:", `Block ${savedBlocks.length + 1}`);
    if (blockName) {
      saveBlock(blockName);
    }
  };

  return (
    <Card className="quilt-inputs">
      <CardContent>
        <h3>Saved Blocks</h3>

        <Typography gutterBottom></Typography>
        <Button variant="outlined" color="primary" onClick={handleSaveBlock}>
          Save Block
        </Button>
      </CardContent>
    </Card>
  );
};

export default SavedBlocks;
