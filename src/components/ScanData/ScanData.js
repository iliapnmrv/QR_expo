import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import ScanDataItem from "./Item/ScanDataItem";

export default function ScanData() {
  const { status } = useSelector(({ inventory }) => inventory.session);
  const { data, sredstvo, prevPosition, remains } = useSelector(
    ({ inventory }) => inventory.scan
  );

  return (
    <>
      <View style={styles.scanData}>
        {data !== null ? (
          <View>
            <ScanDataItem
              icon="information-outline"
              header={`Информация QR кода ${sredstvo}`}
              data={data}
            />
            {prevPosition ? (
              <ScanDataItem
                icon="clipboard-list-outline"
                header="Позиция сканирования"
                data={prevPosition}
              />
            ) : null}
            {remains != null && remains ? (
              <ScanDataItem
                icon="magnify-scan"
                header="Осталось"
                data={remains}
              />
            ) : null}
          </View>
        ) : (
          <Text style={{ padding: 20 }}> Предыдущих сканирований не было </Text>
        )}
      </View>
    </>
  );
}
//Styles
const styles = StyleSheet.create({
  scanData: {
    backgroundColor: "white",
    borderRadius: 15,
    paddingBottom: 5,
  },
});
