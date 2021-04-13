import React from "react";

import "./Input.css";

const Input = ({ setMessage, sendMessage, sendTyping, message }) => (
  <form className="form">
    <input
      className="input"
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={(event) => {
        setMessage(event.target.value);
        sendTyping();
      }}
      onKeyPress={(event) => {
        if (event.key === 13) sendMessage(event);
      }}
    />
    <button className="sendButton" onClick={(e) => sendMessage(e)}>
      Send
    </button>
  </form>
);

export default Input;
