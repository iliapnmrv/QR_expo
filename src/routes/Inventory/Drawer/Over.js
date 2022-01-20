import React from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import styles from "./Styles/ListStyles";
import { getDataFromDB } from "../../../hooks/getDataFromDB";
import DrawerPage from "./DrawerPage";

export default function Over({ navigation }) {
  //  SELECT * FROM scanned WHERE status = 3
  const {
    response: data,
    error,
    isLoading,
    getData,
  } = getDataFromDB("SELECT * FROM scanned WHERE status = 3");

  return (
    <DrawerPage
      onRefresh={getData}
      refreshing={isLoading}
      header="Сверх учета"
      title="Позиции сверх учета инвентаризационной описи"
      navigation={navigation}
    >
      <ScrollView
        style={{ flex: 1 }}
        horizontal={true}
        persistentScrollbar={true}
        showsHorizontalScrollIndicator={true}
      >
        {isLoading ? (
          <ActivityIndicator color="#0000ff" />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.item}>
                <Text style={styles.itemCell}>{++index}</Text>
                <Text style={[styles.itemCell, styles.itemCenterCell]}>
                  {item.name}
                </Text>
                <Text style={styles.itemCell}>{item.invNom.substr(-5)}</Text>
              </View>
            )}
          />
        )}
      </ScrollView>
    </DrawerPage>
  );
}
