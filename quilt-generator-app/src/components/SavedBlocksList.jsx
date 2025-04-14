import React from "react";
import { Grid2, Button, List, ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const SavedBlocksList = ({ savedBlocks, loadBlock, handleDeleteBlock }) => {
  return (
    <Grid2 container spacing={2}>
      <List>
        {savedBlocks.map((block, index) => (
          <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteBlock(index)}>
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
  );
};

export default SavedBlocksList;
