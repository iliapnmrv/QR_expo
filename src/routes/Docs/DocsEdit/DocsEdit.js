import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import CustomButton from "../../../components/Buttons/CustomButton";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Title from "../../../components/Title/Title";
import { generalStyles } from "../../../styles/base/general";
import Input from "../../../components/Input/Input";
import Icon from "react-native-vector-icons/FontAwesome5";

export default function DocsEdit({ route, navigation }) {
  const {
    itemData: { type, qr, name, model, sernom },
  } = route.params;

  const [data, setData] = useState({
    type,
    qr,
    name,
    model,
    sernom,
  });

  const setValues = (value, name) => {
    setData((prevState) => ({ ...prevState, [name]: value }));
  };

  const saveData = () => {
    // сохранение данных на сервер
    navigation.goBack();
  };

  return (
    <ScrollView>
      <View style={generalStyles.page}>
        <PageHeader text="Изменение информации" />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Title title={`Позиция: ${qr}`} />
          <Icon
            name="times"
            size={30}
            color="#696969"
            onPress={() => navigation.goBack()}
            style={{ marginRight: 10 }}
          />
        </View>

        <View
          style={{
            backgroundColor: "white",
            borderRadius: 15,
            padding: 10,
          }}
        >
          <Text>Дополнительная информация</Text>
          <Input
            value={data.qr}
            text="Номер QR"
            setValue={(value) => setValues(value, "qr")}
          />
          <Input
            value={data.sernom}
            text="Серийный номер"
            setValue={(value) => setValues(value, "sernom")}
          />
          <Input
            value={data.model}
            text="Модель"
            setValue={(value) => setValues(value, "model")}
          />

          <Text>Информация</Text>
        </View>
        <CustomButton text="Сохранить" onPress={saveData} />
      </View>
    </ScrollView>
  );
}
