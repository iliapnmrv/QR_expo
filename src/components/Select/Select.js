import React from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function Select({
  text,
  value,
  onChange,
  values,
  enabled = true,
}) {
  return (
    <>
      <Text>{text}</Text>
      <View
        style={{
          height: 55,
          borderWidth: 1,
          borderColor: "#F5F5F5",
          borderRadius: 3,
        }}
      >
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          enabled={enabled}
          style={{
            height: 44,
            width: "100%",
            color: !enabled ? "#BDBDBD" : "black",
            fontSize: 15,
          }}
        >
          {values.map((item) => {
            return <Picker.Item label={item.label} value={item.value} />;
          })}
        </Picker>
      </View>
    </>
  );
}
