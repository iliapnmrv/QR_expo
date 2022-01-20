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

export default function Inside({ navigation }) {
  const {
    response: data,
    error,
    isLoading,
    getData,
  } = getDataFromDB("SELECT * FROM scanned WHERE status = 1 ORDER BY id DESC");

  return (
    <DrawerPage
      onRefresh={getData}
      refreshing={isLoading}
      header="В учете"
      title="Позиции в учете инвентаризационной описи"
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
                  {item.name}
                </Text>
                <Text style={styles.itemCell}>{item.invNom.substr(-5)}</Text>
                <Text style={styles.itemCell}>{item.pos}</Text>
                <Text style={styles.itemCell}>{item.place}</Text>
              </View>
            )}
          />
        )}
      </ScrollView>
    </DrawerPage>
  );
}
