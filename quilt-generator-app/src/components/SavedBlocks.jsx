import React from "react";
import { Grid2, Card, CardContent, Button, Typography } from "@mui/material";

const SavedBlocks = ({
  savedBlocks,
  setSavedBlocks,
  saveBlock,
  loadBlock,
  downloadSavedBlocks,
}) => {
  console.log("savedBlocks:", savedBlocks);

  const handleSaveBlock = () => {
    const blockName = prompt("Enter a name for this block:", `Block ${savedBlocks.length + 1}`);
    if (blockName) {
      saveBlock(blockName);
    }
    let updatedSavedBlocks = JSON.parse(localStorage.getItem("savedBlocks"));
    setSavedBlocks(updatedSavedBlocks);
  };

  return (
    <Card className="quilt-inputs">
      <CardContent>
        <h3>Saved Blocks</h3>
        <Button variant="outlined" color="primary" onClick={handleSaveBlock}>
          Save Block
        </Button>

        <Grid2 container spacing={2} sx={{ maxHeight: 300, overflowY: "auto" }}>
          {savedBlocks.map((block, index) => (
            <Grid2 xs={6} sm={4} md={3} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1">{block.name}</Typography>
                  <Button variant="outlined" size="small" onClick={() => loadBlock(block)}>
                    Load
                  </Button>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>

        <Button variant="outlined" color="secondary" onClick={() => downloadSavedBlocks(block)}>
          Download Saved Blocks
        </Button>
      </CardContent>
    </Card>
  );
};

export default SavedBlocks;
