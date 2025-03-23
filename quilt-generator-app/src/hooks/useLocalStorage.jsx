import React, { useState, useEffect } from "react";

const useLocalStorageState = (key, defaultValue) => {
  // rather than passing in an init value to useState, you can also use a func that returns init value
  // in this case, the function checks localStorage, if nothing there returns defaultValue
  const [state, setState] = useState(() => {
    let value;
    try {
      value = JSON.parse(window.localStorage.getItem(key)) || defaultValue;
    } catch (e) {
      console.log(e);
      value = defaultValue;
    }
    return value;
  });

  // if the value of key or state changes, update the value in localStorage
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

export default useLocalStorageState;
