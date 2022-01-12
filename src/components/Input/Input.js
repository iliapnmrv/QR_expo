import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

export default function Input({
  placeholder,
  value,
  setValue,
  text,
  secure = false,
}) {
  const [hidePass, setHidePass] = useState(secure);

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
          autoComplete="on"
          value={value ? value.toString() : null}
          onChangeText={setValue}
          style={styles.input}
          secureTextEntry={hidePass ? true : false}
        />

        {secure ? (
          <Icon
            name={hidePass ? "eye-slash" : "eye"}
            size={18}
            color="grey"
            style={{ position: "absolute", right: 10, top: 31 }}
            onPress={() => setHidePass(!hidePass)}
          />
        ) : null}
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
