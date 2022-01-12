import React from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import BackHome from "./BackHome";
import styles from "./Styles/ListStyles";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Title from "../../../components/Title/Title";
import { getDataFromDB } from "../../../hooks/getDataFromDB";

export default function Inside({ navigation }) {
  const {
    response: data,
    error,
    isLoading,
    getData,
  } = getDataFromDB("SELECT * FROM scanned WHERE status = 1 ORDER BY id DESC");

  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={getData} />
      }
    >
      <PageHeader text="В учете" />

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "white",
          padding: 10,
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          paddingBottom: 20,
        }}
      >
        <BackHome navigation={navigation} />
        <Title
          title="Позиции в учете инвентаризационной описи"
          style={styles.sectionHeader}
        />
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
      </View>
    </ScrollView>
  );
}
