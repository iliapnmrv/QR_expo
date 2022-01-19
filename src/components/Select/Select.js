import React, { useState } from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";
import CustomButton from "../Buttons/CustomButton";

export default function Select({
  text,
  name,
  value,
  onChange,
  values,
  enabled = true,
}) {
  const { prevSelect } = useSelector(({ docs }) => docs.scan);

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
          onValueChange={(value) => onChange(value)}
          enabled={enabled}
          style={{
            height: 44,
            width: "100%",
            color: !enabled ? "#BDBDBD" : "black",
            fontSize: 15,
          }}
        >
          <Picker.Item value="" label={`Введите ${text.toLowerCase()}...`} />
          {values
            .sort((a, b) => {
              if (a.label === b.label) return 0;
              if (a.label > b.label) return 1;
              if (a.label < b.label) return -1;
            })
            .sort((a) => {
              if (prevSelect[name] === a.value) return -1;
            })
            .map((item, i) => {
              return (
                <Picker.Item label={item.label} value={item.value} key={i} />
              );
            })}
        </Picker>
      </View>
      {value === null ? (
        <CustomButton
          type="TERTIARY"
          text={`Предыдущее значение: ${values
            .map((item) => {
              if (prevSelect[name] === item.value) {
                return item.label;
              }
            })
            .join("")}`}
          onPress={() => onChange(prevSelect[name])}
        />
      ) : null}
    </>
  );
}
