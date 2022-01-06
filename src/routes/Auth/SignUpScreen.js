import React, { useState } from "react";
import { SafeAreaView, Text } from "react-native";
import CustomButton from "components/Buttons/CustomButton";

import Input from "components/Input/Input";
import authService from "services/auth.service";
import { styles } from "./AuthScreensStyles";

export default function SignInScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const signUp = async () => {
    const regData = await authService.registration(username, password);
    console.log(regData);
    // TODO: в случае успеха, вызвать dispatch(setIsSignedIn(true))
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Регистрация</Text>
      <Input placeholder="Логин" value={username} setValue={setUsername} />
      <Input
        placeholder="Пароль"
        value={password}
        setValue={setPassword}
        secure={true}
      />
      <CustomButton text="Зарегистрироваться" onPress={signUp} type="PRIMARY" />
      <CustomButton
        text="Есть аккаунт? Войдите"
        type="TERTIARY"
        onPress={() => navigation.navigate("SignIn")}
      />
    </SafeAreaView>
  );
}
