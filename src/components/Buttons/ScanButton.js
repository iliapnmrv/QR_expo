import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

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
        size={35}
        style={{ paddingRight: 10 }}
        color="#909090"
      />
      <View>
        <Text style={styles.scanButtonHeaderText}>Сканировать</Text>
        <Text style={styles.scanButtonMainText}>
          Нажмите, чтобы отсканировать QR код
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scanButton: {
    padding: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    maxHeight: 70,
    backgroundColor: "white",
    borderRadius: 10,
  },
  scanButtonHeaderText: {
    fontSize: 19,
    fontWeight: "600",
  },
  scanButtonMainText: {
    color: "black",
    fontSize: 13,
    fontWeight: "400",
  },
});
