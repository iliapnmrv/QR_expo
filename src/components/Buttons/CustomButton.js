import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

export default function CustomButton({
  text,
  onPress,
  type = "PRIMARY",
  icon,
}) {
  return (
    <>
      <TouchableOpacity
        style={[styles.container, styles[`container_${type}`]]}
        activeOpacity={0.65}
        onPress={() => onPress()}
      >
        {icon ? (
          <Icon name={icon} size={20} color="#1E90FF" style={styles.icon} />
        ) : null}
        <Text style={[styles.text, styles[`text_${type}`]]}>{text}</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
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
  icon: {
    paddingHorizontal: 20,
  },
});
