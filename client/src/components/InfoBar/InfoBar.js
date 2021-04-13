import React from "react";

import onlineIcon from "../../assets/onlineIcon.png";
import closeIcon from "../../assets/closeIcon.png";

import "./InfoBar.css";

const InfoBar = ({ room, showTyping }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <img className="onlineIcon" src={onlineIcon} alt="Online" />
      <h3>{room}</h3>
      <p className="typingText">{showTyping}</p>
      {showTyping && (
        <div class="load-3">
          <div class="line"></div>
          <div class="line"></div>
          <div class="line"></div>
        </div>
      )}
    </div>
    <div className="rightInnerContainer">
      <a href="/">
        <img src={closeIcon} alt="Close" />
      </a>
    </div>
  </div>
);

export default InfoBar;
