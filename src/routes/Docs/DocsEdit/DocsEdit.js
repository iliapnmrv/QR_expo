import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert } from "react-native";
import CustomButton from "../../../components/Buttons/CustomButton";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Title from "../../../components/Title/Title";
import { generalStyles } from "../../../styles/base/general";
import Input from "../../../components/Input/Input";
import Icon from "react-native-vector-icons/FontAwesome5";
import $api from "http/index.js";
import { useDispatch, useSelector } from "react-redux";
import {
  setDocsItem,
  setPrevSelect,
} from "../../../store/actions/docs/docsScanDataAction";
import Select from "../../../components/Select/Select";
import { showMessage } from "react-native-flash-message";
import { LOGS_CATALOG } from "../../../constants/constants";

export default function DocsEdit({ route, navigation }) {
  const {
    itemData: { qr },
  } = route.params;

  const { item, prevSelect } = useSelector(({ docs }) => docs.scan);
  const {
    user: { login, role },
  } = useSelector(({ auth }) => auth);
  const { storages, statuses, persons } = useSelector(({ info }) => info);

  const dispatch = useDispatch();

  const [data, setData] = useState(item);

  const setValues = (value, name) => {
    setData((prevState) => ({ ...prevState, [name]: value }));
  };

  const newItemData = {
    person: data.person,
    storage: data.storage,
    status: data.status,
    info: data.info,
    addinfo: data.addinfo,
  };

  const initialData = {
    person: item.person,
    storage: item.storage,
    status: item.status,
    info: item.info,
    addinfo: item.addinfo,
  };

  const hasChanges = () => {
    if (JSON.stringify(initialData) === JSON.stringify(newItemData)) {
      showMessage({
        message: "Информация не была изменена",
        type: "info",
      });
      return false;
    }
    return true;
  };

  const confirmActions = () => {
    const changes = hasChanges();
    if (changes) {
      Alert.alert(
        "Выйти без сохранения?",
        "Введенные данные не будут сохранены",
        [
          {
            text: "Остаться",
            style: "cancel",
          },
          {
            text: "Не сохранять",
            onPress: () => {
              navigation.goBack();
              showMessage({
                message: "Вы не сохранили информацию",
                type: "info",
              });
            },
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const saveData = async () => {
    navigation.goBack();

    const allInfo = {
      person: persons,
      storage: storages,
      status: statuses,
    };

    const changes = hasChanges();
    if (!changes) {
      return;
    }

    dispatch(setDocsItem({ ...item, ...newItemData }));

    dispatch(
      setPrevSelect({
        person: data.person == null ? prevSelect.person : data.person,
        storage: data.storage == null ? prevSelect.storage : data.storage,
        status: data.status == null ? prevSelect.status : data.status,
      })
    );

    let updatedData = Object.keys(newItemData).reduce((diff, key) => {
      if (initialData[key] === newItemData[key]) return diff;
      return {
        ...diff,
        [key]: newItemData[key],
      };
    }, {});
    let logs = "",
      prevState;
    for (const key in updatedData) {
      if (allInfo[key]) {
        if (initialData[key]) {
          allInfo[key].forEach((elem) => {
            if (elem.value === initialData[key]) {
              return (prevState = elem.label);
            }
          });
        }
        allInfo[key].forEach((elem) => {
          if (elem.value === updatedData[key]) {
            logs = ` ${logs} ${LOGS_CATALOG[key]}: ${
              initialData[key] == null ? "" : prevState
            } -> ${elem.label},`;
          }
        });
      } else {
        logs = ` ${logs} ${LOGS_CATALOG[key]}: ${
          initialData[key] == null ? "" : initialData[key]
        } -> ${updatedData[key]},`;
      }
    }

    const updatedLogs = await $api.post(`logs/`, {
      qr,
      user: login,
      text: logs.slice(0, -1),
    });

    const updatedInfo = await $api.post(`info/${qr}`, {
      info: data.info,
    });

    const updatedStatus = await $api.post(`status/${qr}`, {
      status: data.status,
    });

    const updatedPerson = await $api.post(`person/${qr}`, {
      person: data.person,
    });

    const updatedStorage = await $api.post(`storage/${qr}`, {
      storage: data.storage,
    });

    const updatedAddinfo = await $api.post(`addinfo/${qr}`, {
      addinfo: data.addinfo,
    });

    showMessage({
      message: "Данные успешно обновлены",
      type: "info",
    });
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
            onPress={confirmActions}
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
            value={data?.info}
            text="Примечания"
            setValue={(info) => setValues(info, "info")}
          />
          {role === "admin" ? (
            <Input
              placeholder="Введите дополнительную информацию..."
              value={data?.addinfo}
              text="Дополнительная информация"
              setValue={(addinfo) => setValues(addinfo, "addinfo")}
            />
          ) : null}

          <Select
            text="Статус"
            name="status"
            enabled={role === "admin" ? true : false}
            value={data?.status}
            onChange={(status) => setValues(status, "status")}
            values={statuses}
          />
          <Select
            text="МОЛ"
            name="person"
            enabled={role === "admin" ? true : false}
            value={data?.person}
            onChange={(person) => setValues(person, "person")}
            values={persons}
          />
          <Select
            text="Место хранения"
            name="storage"
            value={data?.storage}
            onChange={(storage) => setValues(storage, "storage")}
            values={storages}
          />
        </View>
        <CustomButton text="Сохранить" onPress={saveData} />
      </View>
    </ScrollView>
  );
}
