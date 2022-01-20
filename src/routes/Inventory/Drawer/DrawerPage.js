import React from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Title from "../../../components/Title/Title";
import { getDataFromDB } from "../../../hooks/getDataFromDB";
import BackHome from "./BackHome";

export default function DrawerPage({
  header,
  title,
  children,
  navigation,
  onRefresh,
  refreshing,
}) {
  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <PageHeader text={header} />

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "white",
          padding: 10,
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          paddingBottom: 20,
          height: "100%",
        }}
      >
        <BackHome navigation={navigation} />
        <Title title={title} />
        {children}
      </View>
    </ScrollView>
  );
}
