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
  return (
    <Card className="quilt-inputs">
      <CardContent>
        <h3>Saved Blocks</h3>

        <Typography gutterBottom></Typography>
        <Button variant="outlined" color="primary" onClick={() => params.color.restoreColors()}>
          Save Block
        </Button>
      </CardContent>
    </Card>
  );
};

export default SavedBlocks;
