import React from "react";
import {
  Button,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
} from "react-native";

export default function CustomButton({ text, onPress, type }) {
  return (
    <>
      <TouchableOpacity
        style={[styles.container, styles[`container_${type}`]]}
        activeOpacity={0.65}
        onPress={() => onPress()}
      >
        <Text style={[styles.text, styles[`text_${type}`]]}>{text}</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 10,
    alignItems: "center",
    borderRadius: 3,
    marginVertical: 10,
  },

  container_PRIMARY: {
    backgroundColor: "#3B71F3",
  },
  container_TERTIARY: {},
  text_PRIMARY: {
    fontWeight: "bold",
    color: "white",
  },
  text_TERTIARY: {
    color: "gray",
  },
});
