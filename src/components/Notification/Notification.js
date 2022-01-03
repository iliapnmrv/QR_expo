import React from "react";
import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";

export default function Notification({ title, message }) {
  const [exit, setExit] = useState(false);
  const [width, setWidth] = useState(0);
  const [intervalId, setIntervalId] = useState();

  const handleStartTimer = () => {
    const id = setInterval(() => {
      setWidth((prev) => {
        if (prev < 100) {
          return prev + 0.5;
        }
        clearInterval(id);
        return prev;
      });
    }, 20);
    setIntervalId(id);
  };

  const handlePauseTimer = () => {
    clearInterval(intervalId);
  };

  const handleCloseNotification = () => {
    handlePauseTimer();
    setExit(true);
    setTimeout(() => {
      props.dispatch({
        type: "REMOVE_NOTIFICATION",
        id: props.id,
      });
    }, 400);
  };

  useEffect(() => {
    if (width === 100) {
      handleCloseNotification();
    }
  }, [width]);

  useEffect(() => {
    handleStartTimer();
  }, []);
  return (
    <View onMouseEnter={handlePauseTimer} onMouseLeave={handleStartTimer}>
      <Text>{title}</Text>
      <Text>{message}</Text>
    </View>
  );
}
