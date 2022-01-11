import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

export default function Input({
  placeholder = "Введите...",
  value,
  setValue,
  text,
  secure = false,
}) {
  return (
    <>
      <View style={styles.formItem}>
        {text ? <Text style={styles.text}>{text}</Text> : null}
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={setValue}
          style={styles.input}
          secureTextEntry={secure}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  formItem: {
    marginVertical: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 3,
    padding: 10,
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
    color: "#696969",
  },
});
