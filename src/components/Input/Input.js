import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

export default function Input({
  placeholder,
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
          placeholder={
            placeholder == null
              ? `Введите ${text.toLowerCase()}...`
              : placeholder
          }
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
    borderColor: "#F5F5F5",
    borderRadius: 3,
    padding: 10,
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
    color: "#696969",
  },
});
