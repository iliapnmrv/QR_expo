import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../routes/Inventory/styles/styles";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { analyze } from "../../services/inventory.service.js";

export default function ScanData() {
  const { status } = useSelector(({ session }) => session);
  const { data, sredstvo, prevPosition, remains } = useSelector(
    ({ scan }) => scan
  );

  return (
    <View style={styles.prevScan}>
      {data !== null ? (
        <View>
          <View>
            <View style={styles.secondHeader}>
              <MaterialCommunityIcon
                name="information-outline"
                size={20}
                style={{ marginLeft: 8 }}
              />
              <Text style={styles.secondHeaderText}>
                Информация QR кода {sredstvo}
              </Text>
            </View>
            <Text style={styles.info}>{data}</Text>
          </View>
          {prevPosition ? (
            <View>
              <View style={styles.secondHeader}>
                <MaterialCommunityIcon
                  name="clipboard-list-outline"
                  size={20}
                  style={{ marginLeft: 8 }}
                />
                <Text style={styles.secondHeaderText}>
                  Позиция сканирования
                </Text>
              </View>
              <Text style={[styles.info, styles.biggerFont]}>
                {prevPosition}
              </Text>
            </View>
          ) : null}
          {remains != "null" && remains ? (
            <View>
              <View style={styles.secondHeader}>
                <MaterialCommunityIcon
                  name="magnify-scan"
                  size={20}
                  style={{ marginLeft: 8 }}
                />
                <Text style={styles.secondHeaderText}>Осталось</Text>
              </View>
              <Text style={[styles.info, styles.biggerFont]}>{remains}</Text>
            </View>
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
