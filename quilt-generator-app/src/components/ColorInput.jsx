import React from "react";
import { MuiColorInput } from "mui-color-input";

const ColorInput = ({ value, onChange }) => {
  const [color, setColor] = React.useState(value ?? "#ffffff");

  // Sync internal state with prop value when it changes
  React.useEffect(() => {
    setColor(value);
  }, [value]);

  const handleChange = (color) => {
    setColor(color);
    onChange(color);
  };

  return <MuiColorInput value={color} onChange={handleChange} />;
};

export default ColorInput;
