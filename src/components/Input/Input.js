import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

export default function Input({
  placeholder = "Введите...",
  value,
  setValue,
  secure = false,
}) {
  return (
    <>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        style={styles.input}
        secureTextEntry={secure}
      />
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 3,
    padding: 10,
  },
});
