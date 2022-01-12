import React, { useState, useEffect } from "react";
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
import $api from "http/index.js";
import { useDispatch, useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import { setDocsItem } from "../../../store/actions/docs/docsScanDataAction";

export default function DocsEdit({ route, navigation }) {
  const {
    itemData: { qr },
  } = route.params;

  const { item } = useSelector(({ docs }) => docs.scan);
  const { storages, statuses, persons } = useSelector(({ info }) => info);

  const dispatch = useDispatch();

  const [data, setData] = useState();

  console.log("docsItemdata", data);

  useEffect(() => {
    const getItemData = async () => {
      $api
        .get(`total/${qr}`)
        .then(({ data }) => {
          dispatch(setDocsItem(data));
          setData(data);
        })
        .catch((message) => {
          showMessage({
            message: `${message}`,
            type: "danger",
          });
        });
    };
    getItemData();
  }, []);

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
          <Input
            value={item?.info}
            text="Примечания"
            setValue={(info) => setValues(info, "info")}
          />
          <Text>Статус</Text>
          <Picker
            selectedValue={data?.status}
            onValueChange={(status) => setValues(status, "status")}
          >
            {statuses.map((item) => {
              return <Picker.Item label={item.label} value={item.value} />;
            })}
          </Picker>
          <Text>МОЛ</Text>
          <Picker
            selectedValue={data?.person}
            onValueChange={(person) => setValues(person, "person")}
          >
            {persons.map((item) => {
              return <Picker.Item label={item.label} value={item.value} />;
            })}
          </Picker>
          <Text>Место хранения</Text>
          <Picker
            selectedValue={data?.storage}
            onValueChange={(storage) => setValues(storage, "storage")}
          >
            {storages.map((item) => {
              return <Picker.Item label={item.label} value={item.value} />;
            })}
          </Picker>
          <Input
            value={data?.addinfo}
            text="Дополнительная информация"
            setValue={(addinfo) => setValues(addinfo, "addinfo")}
          />

          <Text>Информация</Text>
        </View>
        <CustomButton text="Сохранить" onPress={saveData} />
      </View>
    </ScrollView>
  );
}
