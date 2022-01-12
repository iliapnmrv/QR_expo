import React, { useState } from "react";
import { View } from "react-native";
import CustomButton from "components/Buttons/CustomButton";

import Input from "components/Input/Input";
import authService from "services/auth.service.js";
import { styles } from "./AuthScreensStyles";
import { showMessage } from "react-native-flash-message";
import PageHeader from "../../components/PageHeader/PageHeader";

export default function SignInScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const signIn = async () => {
    if (!password || !username) {
      return showMessage({
        message: `Заполните оба поля`,
        type: "danger",
      });
    }
    const loginData = await authService.login(username, password);
    showMessage({
      message: `Добро пожаловать, ${loginData.user.login}`,
      type: "info",
    });
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
    </View>
  );
}
