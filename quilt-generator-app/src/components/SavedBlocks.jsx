import React from "react";
import {
  Grid2,
  Card,
  CardContent,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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

        <Grid2 container spacing={2}>
          <List>
            {savedBlocks.map((block, index) => (
              <ListItem
                secondaryAction={
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                }
                key={block.name}
              >
                <ListItemText primary={block.name} />
                <Button variant="outlined" size="small" onClick={() => loadBlock(index)}>
                  Load
                </Button>
              </ListItem>
            ))}
          </List>
        </Grid2>

        <Button variant="outlined" color="secondary" onClick={() => downloadSavedBlocks(block)}>
          Download Saved Blocks
        </Button>
      </CardContent>
    </Card>
  );
};

export default SavedBlocks;
