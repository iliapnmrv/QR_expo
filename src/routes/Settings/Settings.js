import React, { useState } from "react";
import { View, Text } from "react-native";
import { showMessage } from "react-native-flash-message";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../components/Buttons/CustomButton";
import Input from "../../components/Input/Input";
import PageHeader from "../../components/PageHeader/PageHeader";
import { setIP } from "../../store/actions/settingsAction";
import { styles } from "../Auth/AuthScreensStyles";
import * as Application from "expo-application";

export default function Settings({ navigation }) {
  const { ip: savedIP } = useSelector(({ settings }) => settings);

  const [ip, setIp] = useState(savedIP);
  const dispatch = useDispatch();

  const saveChanges = () => {
    dispatch(setIP(ip));
    showMessage({
      message: `Настройки сохранены`,
      type: "info",
    });
    navigation.goBack();
  };

  return (
    <>
      <View style={styles.container}>
        <PageHeader text="Настройки" />
        <View style={styles.wrapper}>
          <View>
            <Input text="IP адрес сервера" value={ip} setValue={setIp} />
          </View>
          <CustomButton text="Сохранить" onPress={saveChanges} type="PRIMARY" />
        </View>
        <Text style={{ marginTop: 10 }}>
          Версия приложения: {Application.nativeApplicationVersion}
        </Text>
      </View>
    </>
  );
}
