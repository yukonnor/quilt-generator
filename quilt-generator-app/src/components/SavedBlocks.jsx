import React from "react";
import {
  Grid2,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import SavedBlocksList from "./SavedBlocksList";

const SavedBlocks = ({
  savedBlocks,
  setSavedBlocks,
  saveBlock,
  loadBlock,
  deleteBlock,
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

  const handleDeleteBlock = (index) => {
    try {
      const success = deleteBlock(index); // Returns `true` or `false` from deleteBlock
      if (!success) {
        throw new Error("Delete operation failed.");
      }

      const updatedBlocks = savedBlocks.filter((_, i) => i !== index);
      setSavedBlocks(updatedBlocks);
    } catch (error) {
      console.error("Error deleting block:", error);
      alert("Something went wrong while deleting the block.");
    }
  };

  return (
    <Card className="quilt-inputs">
      <CardContent>
        <h3>Saved Blocks</h3>
        <Button variant="outlined" color="primary" onClick={handleSaveBlock}>
          Save Block
        </Button>

        <SavedBlocksList
          savedBlocks={savedBlocks}
          loadBlock={loadBlock}
          handleDeleteBlock={handleDeleteBlock}
        />

        <Button variant="outlined" color="secondary" onClick={() => downloadSavedBlocks()}>
          Download Saved Blocks
        </Button>
      </CardContent>
    </Card>
  );
};

export default SavedBlocks;
