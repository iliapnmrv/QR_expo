import React from "react";
import { Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { styles } from "./styles/ScanButton.styles";

export default function ScanButton({ navigation, prevScreen }) {
  const goToScanner = () => {
    navigation.navigate("scanner", {
      prevScreen,
    });
  };
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.scanButton}
      onPress={goToScanner}
    >
      <MaterialCommunityIcon
        name="qrcode-scan"
        size={30}
        style={{ paddingRight: 10 }}
        color="#909090"
      />
      <Text style={styles.scanButtonText}>
        Нажмите, чтобы отсканировать QR код
      </Text>
    </TouchableOpacity>
  );
}
