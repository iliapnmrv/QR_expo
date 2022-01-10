import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "routes/Inventory/styles/styles";
import { useSelector } from "react-redux";
import { analyze } from "services/inventory.service.js";
import ScanDataItem from "./Item/ScanDataItem";

export default function ScanData() {
  const { status } = useSelector(({ inventory }) => inventory.session);
  const { data, sredstvo, prevPosition, remains } = useSelector(
    ({ inventory }) => inventory.scan
  );

  return (
    <View style={styles.prevScan}>
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

          {status ? (
            <TouchableOpacity
              style={[styles.analyzeBtn, styles.button, styles.accept]}
              onPress={() => {
                analyze(data);
              }}
            >
              <Text style={styles.btnTextStyle}>Найти в ведомости</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : (
        <Text style={{ padding: 20 }}>Предыдущих сканирований не было</Text>
      )}
    </View>
  );
}
