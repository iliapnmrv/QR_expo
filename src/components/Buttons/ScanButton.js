import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "../../routes/Inventory/styles/styles";

export default function ScanButton() {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.buttonMain}
      onPress={() => navigation.navigate("scanner")}
    >
      <MaterialCommunityIcon
        name="qrcode-scan"
        size={30}
        style={{ paddingRight: 10 }}
        color="#909090"
      />

      <Text style={styles.buttonMainText}>
        Нажмите, чтобы отсканировать QR код
      </Text>
    </TouchableOpacity>
  );
}
