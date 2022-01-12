import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
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
import { setDocsAnalysis } from "../../store/actions/docs/docsScanDataAction";
import { showMessage } from "react-native-flash-message";
import {
  changePersonsData,
  changeStatusesData,
  changeStoragesData,
} from "../../store/actions/infoAction";

function Docs({ navigation }) {
  const dispatch = useDispatch();
  const { data, analysis } = useSelector(({ docs }) => docs.scan);
  const [invNom, name, model, sernom] = data.split("\n");
  const qrNumber = invNom.slice(-5);

  const getItemData = async () => {
    const itemData = {
      qr: qrNumber,
    };
    navigation.navigate("docsEdit", {
      itemData,
    });
  };

  const logout = async () => {
    authService.logout();
  };

  useEffect(() => {
    const getAnalysis = async () => {
      setDocsAnalysis(null);
      if (name) {
        $api
          .get(`analysis/${name}`)
          .then(({ data }) => dispatch(setDocsAnalysis(data)))
          .catch((message) => {
            showMessage({
              message: `${message}`,
              type: "danger",
            });
          });
      } else {
        showMessage({
          message: `Возможно, вы отсканировали неподходящий QR код`,
          type: "info",
        });
      }
    };
    getAnalysis();
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
    };
    getInfo();
  }, []);

  return (
    <ScrollView>
      <View style={generalStyles.page}>
        <PageHeader text="Документооборот" />
        <ScanButton navigation={navigation} prevScreen="docs" />
        <Title title="Сканирование" />

        <View
          style={{
            backgroundColor: "white",
            borderRadius: 15,
            paddingBottom: 5,
          }}
        >
          {data ? (
            <>
              <ScanDataItem
                icon="information-outline"
                header={`Информация QR кода ${qrNumber}`}
                data={data}
              />
              {analysis ? (
                <ScanDataItem
                  icon="compare-vertical"
                  header="Результат анализирования"
                  data={`В наличии: ${analysis?.inStock.kolvo}
${
  analysis?.listed?.kolvo
    ? `Числится: ${analysis?.listed?.kolvo}`
    : `Не числится`
}`}
                />
              ) : null}
            </>
          ) : (
            <Text style={{ padding: 20 }}>
              Отсканируйте позицию документооборота, чтобы просмотреть,
              изменить/добавить информацию
            </Text>
          )}
        </View>
        {data ? (
          <CustomButton
            text="Изменить данные"
            onPress={getItemData}
            type="PRIMARY"
          />
        ) : null}
      </View>
      {/* <CustomButton text="Выйти из аккаунта" onPress={logout} type="TERTIARY" /> */}
    </ScrollView>
  );
}

export default Docs;
