import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import CustomButton from "../../../components/Buttons/CustomButton";

export default function BackHome({ navigation }) {
  return (
    <>
      <CustomButton
        type="TERTIARY"
        text="Вернуться на главную"
        onPress={() => navigation.goBack()}
        icon="angle-left"
      />
    </>
  );
}

const styles = StyleSheet.create({});
