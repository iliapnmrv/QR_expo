import React from "react";
import { View, Text } from "react-native";
import ScanButton from "components/Buttons/ScanButton";

function Docs({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Документооборот</Text>
      <ScanButton navigation={navigation} />
    </View>
  );
}

export default Docs;
