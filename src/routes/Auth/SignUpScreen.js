import React, { useState } from "react";
import { View } from "react-native";
import CustomButton from "components/Buttons/CustomButton";

import Input from "components/Input/Input";
import authService from "services/auth.service.js";
import { styles } from "./AuthScreensStyles";
import PageHeader from "../../components/PageHeader/PageHeader";

export default function SignInScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const signUp = async () => {
    if (!password || !username) {
      return showMessage({
        message: `Заполните оба поля`,
        type: "danger",
      });
    }
    const regData = await authService.registration(username, password);
    console.log(regData);
    showMessage({
      message: `Добро пожаловать, ${loginData.user.login}`,
      type: "info",
    });
  };
  return (
    <View style={styles.container}>
      <PageHeader text="Регистрация" />
      <View style={styles.wrapper}>
        <Input text="Логин" value={username} setValue={setUsername} />
        <Input
          text="Пароль"
          value={password}
          setValue={setPassword}
          secure={true}
        />
        <CustomButton
          text="Зарегистрироваться"
          onPress={signUp}
          type="PRIMARY"
        />
        <CustomButton
          text="Есть аккаунт? Войдите"
          type="TERTIARY"
          onPress={() => navigation.navigate("SignIn")}
        />
      </View>
    </View>
  );
}
