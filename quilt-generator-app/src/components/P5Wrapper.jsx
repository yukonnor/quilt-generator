import React, { useEffect, useRef } from "react";
import p5 from "p5";

const P5Wrapper = ({ sketch, params }) => {
  const sketchRef = useRef(null);
  const p5InstanceRef = useRef(null); // Keep a reference to the p5 instance

  // Initialize the p5 sketch once
  useEffect(() => {
    const sketchInstance = (p) => sketch(p, params);
    p5InstanceRef.current = new p5(sketchInstance, sketchRef.current);

    return () => {
      // Clean up the p5 instance on unmount
      p5InstanceRef.current.remove();
    };
  }, [sketch]); // Only run once when the sketch changes

  // Update the params without recreating the p5 instance
  useEffect(() => {
    if (p5InstanceRef.current) {
      // Assign the new params to the current p5 instance
      p5InstanceRef.current.params = params;
    }
  }, [params]); // Only run when params change

  return <div ref={sketchRef} />;
};

export default P5Wrapper;
