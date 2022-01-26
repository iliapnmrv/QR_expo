import React, { useState } from "react";
import { View } from "react-native";
import CustomButton from "components/Buttons/CustomButton";

import Input from "components/Input/Input";
import authService from "services/auth.service.js";
import { styles } from "./AuthScreensStyles";
import { showMessage } from "react-native-flash-message";
import PageHeader from "../../components/PageHeader/PageHeader";
import { API_URL } from "../../http";

export default function SignInScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const signIn = async () => {
    try {
      if (!password || !username) {
        return showMessage({
          message: `Заполните оба поля`,
          type: "danger",
        });
      }
      const loginData = await authService.login(username, password);
      if (loginData?.message) {
        throw loginData;
      }
      showMessage({
        message: `Добро пожаловать, ${loginData.user.login}`,
        type: "info",
      });
    } catch (e) {
      if (e.name === "TypeError") {
        showMessage({
          message: `Прошло 3 секунды с момента запроса. Проверьте правильность введенного ip адреса: ${API_URL}`,
          type: "danger",
        });
      } else {
        showMessage({
          message: `${e.message}`,
          type: "danger",
        });
      }
    }
  };
  return (
    <View style={styles.container}>
      <PageHeader text="Вход в аккаунт" />
      <View style={styles.wrapper}>
        <Input text="Логин" value={username} setValue={setUsername} />
        <Input
          text="Пароль"
          value={password}
          setValue={setPassword}
          secure={true}
        />
        <CustomButton text="Войти" onPress={signIn} type="PRIMARY" />
        {/* <CustomButton
          text="Нет аккаунта? Зарегистрируйтесь"
          type="TERTIARY"
          onPress={() => navigation.navigate("SignUp")}
        /> */}
      </View>
      <CustomButton
        text="Настройки"
        type="TERTIARY"
        onPress={() => navigation.navigate("Settings")}
      />
    </View>
  );
}
