import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import ScanButton from "components/Buttons/ScanButton";
import { useDispatch, useSelector } from "react-redux";
import ScanDataItem from "components/ScanData/Item/ScanDataItem";
import { styles } from "./styles/styles";
import PageHeader from "components/PageHeader/PageHeader";
import { generalStyles } from "../../styles/base/general";
import CustomButton from "../../components/Buttons/CustomButton";
import Title from "../../components/Title/Title";
import authService from "../../services/auth.service";
import $api from "http/index.js";
import {
  setDocsAnalysis,
  setDocsItem,
} from "../../store/actions/docs/docsScanDataAction";
import { showMessage } from "react-native-flash-message";
import {
  changeOwnersData,
  changePersonsData,
  changeStatusesData,
  changeStoragesData,
} from "../../store/actions/infoAction";
import { setIsSignedin } from "../../store/actions/authAction";

function Docs({ navigation }) {
  const dispatch = useDispatch();
  const { data, item, analysis } = useSelector(({ docs }) => docs.scan);
  const { storages, statuses, persons, owners } = useSelector(
    ({ info }) => info
  );
  const {
    user: { login, role },
  } = useSelector(({ auth }) => auth);
  const [invNom, name, model, sernom] = data.split("\n");
  const qr = invNom.slice(-5);

  const [refreshing, setRefreshing] = useState(false);

  console.log("item", item);

  const getItemData = async () => {
    const itemData = {
      qr,
    };
    navigation.navigate("docsEdit", {
      itemData,
    });
  };

  const getItemInfo = () => {
    setRefreshing(true);

    setDocsAnalysis(null);
    $api
      .post(`analysis/`, { name, model })
      .then(({ data }) => dispatch(setDocsAnalysis(data)))
      .catch((message) => {
        showMessage({
          message: `${message}`,
          type: "danger",
        });
        dispatch(setIsSignedin(false));
      });
    setDocsItem(null);
    $api
      .get(`total/${qr}`)
      .then(({ data }) => {
        dispatch(setDocsItem(data));
      })
      .catch((message) => {
        showMessage({
          message: `${message}`,
          type: "danger",
        });
        dispatch(setIsSignedin(false));
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  useEffect(() => {
    if (!name) {
      showMessage({
        message: `Возможно, вы отсканировали неподходящий QR код`,
        type: "info",
      });
      return;
    }
    getItemInfo();
  }, [data]);

  useEffect(() => {
    const getInfo = async () => {
      const storages = await $api
        .get(`storages`)
        .then(({ data }) => data)
        .catch((message) => {
          showMessage({
            message: `${message}`,
            type: "danger",
          });
          dispatch(setIsSignedin(false));
        });
      dispatch(changeStoragesData(storages));

      const persons = await $api
        .get(`persons`)
        .then(({ data }) => data)
        .catch((message) => {
          showMessage({
            message: `${message}`,
            type: "danger",
          });
        });
      dispatch(changePersonsData(persons));

      const statuses = await $api
        .get(`statuses`)
        .then(({ data }) => data)
        .catch((message) => {
          showMessage({
            message: `${message}`,
            type: "danger",
          });
        });
      dispatch(changeStatusesData(statuses));

      const owners = await $api
        .get(`owners`)
        .then(({ data }) => data)
        .catch((message) => {
          showMessage({
            message: `${message}`,
            type: "danger",
          });
        });
      dispatch(changeOwnersData(owners));
    };
    getInfo();
  }, []);

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getItemInfo} />
        }
      >
        <View style={[generalStyles.page, { paddingBottom: 64 }]}>
          <PageHeader text="Документооборот" />
          <ScanButton navigation={navigation} prevScreen="docs" />
          <Title title="Сканирование" />

          <View
            style={{
              backgroundColor: "white",
              borderRadius: 15,
            }}
          >
            {data ? (
              <>
                <ScanDataItem
                  icon="information-outline"
                  header={`Информация QR кода ${qr}`}
                  data={data}
                />
                {analysis ? (
                  <ScanDataItem
                    icon="compare-vertical"
                    header="Результат анализирования"
                    data={`В наличии: ${analysis?.inStock?.kolvo}
${
  analysis?.listed?.kolvo
    ? `Числится: ${analysis?.listed?.kolvo}`
    : `Не числится`
}`}
                  />
                ) : null}
                {item.info ||
                item.addinfo ||
                item.person ||
                item.owner ||
                item.storage ||
                item.status ? (
                  <ScanDataItem
                    icon="information-variant"
                    header="Информация по позиции"
                    data={`Примечания: ${
                      item.info ? item.info : "Примечания отсутствуют"
                    }
${
  role == "admin"
    ? `Доп. информация: ${item.addinfo ? item.addinfo : "Нет данных"}`
    : null
} 
МОЛ: ${
                      persons
                        .map((person) => {
                          if (person.value == item.person) return person.label;
                        })
                        .join("") || "Нет данных"
                    }
Владелец: ${
                      owners
                        .map((owner) => {
                          if (owner.value == item.owner) return owner.label;
                        })
                        .join("") || "Нет данных"
                    }
Место нахождения: ${
                      storages
                        .map((storage) => {
                          if (storage.value == item.storage)
                            return storage.label;
                        })
                        .join("") || "Нет данных"
                    }
Статус: ${
                      statuses
                        .map((status) => {
                          if (status.value === item.status) return status.label;
                        })
                        .join("") || "Нет данных"
                    }`}
                  />
                ) : (
                  <CustomButton
                    text="По позиции нет информации. Добавить?"
                    onPress={getItemData}
                    type="TERTIARY"
                  />
                )}
              </>
            ) : (
              <Text style={{ padding: 20 }}>
                Отсканируйте позицию документооборота, чтобы просмотреть,
                изменить/добавить информацию
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
      {data ? (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            alignSelf: "center",
            width: "100%",
            paddingHorizontal: 15,
          }}
        >
          <CustomButton text="Изменить данные" onPress={getItemData} />
        </View>
      ) : null}
    </>
  );
}

export default Docs;
