import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

export default function ScanDataItem({ icon, header, data }) {
  return (
    <View>
      <View style={styles.header}>
        <MaterialCommunityIcon
          name={icon}
          size={20}
          style={{ marginLeft: 8 }}
        />
        <Text style={styles.headerText}>{header}</Text>
      </View>
      <Text style={[styles.info, styles.biggerFont]}>{data}</Text>
    </View>
  );
}

//Styles
export const styles = StyleSheet.create({
  header: {
    backgroundColor: "#f9f9f9",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    fontSize: 18,
  },
  info: {
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  biggerFont: {
    fontSize: 16,
  },
});
