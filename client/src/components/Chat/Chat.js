import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import LoadingComponent from "../LoadingComponent/LoadingComponent";

let socket;
let ENDPOINT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/"
    : "https://glados-chat-app-server.herokuapp.com/";

const Chat = ({ location }) => {
  const [loading, setLoading] = useState(true);
  const [showTyping, setShowTyping] = useState("");
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit("join", { name, room }, () => {});
  }, [location.search]);

  useEffect(() => {
    console.log("H");
    socket.on("loaded", () => {
      setLoading(false);
    });
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
      setShowTyping("");
    });
    socket.on("typing", (data) => {
      data.name.length >= 13
        ? setShowTyping(`${data.name.slice(0, 12)}... is typing`)
        : setShowTyping(`${data.name} is typing`);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => {
        setMessage("");
      });
    }
  };

  const sendTyping = () => {
    socket.emit("typing");
  };

  // console.log(message, messages);

  return (
    <div className="outerContainer">
      <div className="container">
        {!loading ? (
          <>
            <InfoBar room={room} showTyping={showTyping} />
            <Messages messages={messages} name={name} />
            <Input
              setMessage={setMessage}
              sendMessage={sendMessage}
              sendTyping={sendTyping}
              name={name}
              message={message}
            />
          </>
        ) : (
          <LoadingComponent />
        )}
      </div>
    </div>
  );
};

export default Chat;
