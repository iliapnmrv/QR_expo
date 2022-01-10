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
      <Text style={styles.text}>{data}</Text>
    </View>
  );
}

//Styles
const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    flex: 1,
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    fontSize: 18,
  },
  text: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontSize: 16,
  },
});
