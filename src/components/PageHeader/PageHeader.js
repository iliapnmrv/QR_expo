import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PageHeader({ text }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{text}</Text>
    </View>
  );
}

//Styles
const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    marginTop: 30,
  },
  headerText: {
    width: "100%",
    fontSize: 22,
    paddingHorizontal: 20,
  },
});
