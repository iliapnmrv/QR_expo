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

export default function Log({ navigation }) {
  // SELECT * FROM scanned ORDER BY id DESC
  const {
    response: data,
    error,
    isLoading,
    getData,
  } = getDataFromDB("SELECT * FROM scanned ORDER BY id DESC");

  return (
    <DrawerPage
      onRefresh={getData}
      refreshing={isLoading}
      header="Журнал"
      title="Предыдущие сканирования"
      navigation={navigation}
    >
      <ScrollView
        style={{ flex: 1 }}
        horizontal={true}
        persistentScrollbar={true}
        showsHorizontalScrollIndicator={true}
      >
        {isLoading ? (
          <ActivityIndicator
            animating={true}
            size="large"
            style={{ opacity: 1 }}
            color="#0000ff"
          />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.item}>
                <Text style={styles.itemCell}>{++index}</Text>
                <Text style={[styles.itemCell, styles.itemCenterCell]}>
                  {item.name == "Не в учете" ? item.model : item.name}
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
