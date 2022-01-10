import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Title({ title }) {
  return (
    <>
      <Text style={styles.title}>{title}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#C0C0C0",
    marginTop: 10,
    marginBottom: 5,
    paddingLeft: 10,
  },
});
