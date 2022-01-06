import React, { useState } from "react";
import { SafeAreaView, Text } from "react-native";
import CustomButton from "components/Buttons/CustomButton";

import Input from "components/Input/Input";
import authService from "services/auth.service";
import { styles } from "./AuthScreensStyles";

export default function SignInScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const signIn = async () => {
    const loginData = await authService.login(username, password);
    console.log(loginData);
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Вход в аккаунт</Text>
      <Input placeholder="Логин" value={username} setValue={setUsername} />
      <Input
        placeholder="Пароль"
        value={password}
        setValue={setPassword}
        secure={true}
      />
      <CustomButton text="Войти" onPress={signIn} type="PRIMARY" />
      <CustomButton
        text="Нет аккаунта? Зарегистрируйтесь"
        type="TERTIARY"
        onPress={() => navigation.navigate("SignUp")}
      />
    </SafeAreaView>
  );
}
