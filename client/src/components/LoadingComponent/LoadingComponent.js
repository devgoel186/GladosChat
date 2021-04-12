import React from "react";
import "./LoadingComponent.css";

const LoadingComponent = () => {
  return (
    <div class="cs-loader">
      <div class="cs-loader-inner">
        <h1 class="loading-text">Loading</h1>
        <label>●</label>
        <label>●</label>
        <label>●</label>
        <label>●</label>
        <label>●</label>
        <label>●</label>
      </div>
    </div>
  );
};

export default LoadingComponent;
