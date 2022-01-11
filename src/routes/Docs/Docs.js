import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import ScanButton from "components/Buttons/ScanButton";
import { useSelector } from "react-redux";
import ScanDataItem from "components/ScanData/Item/ScanDataItem";
import { styles } from "./styles/styles";
import PageHeader from "components/PageHeader/PageHeader";
import { generalStyles } from "../../styles/base/general";
import CustomButton from "../../components/Buttons/CustomButton";
import Title from "../../components/Title/Title";

function Docs({ navigation }) {
  const { data } = useSelector(({ docs }) => docs.scan);
  console.log(data);
  const [invNom, name, model, sernom] = data.split("\n");
  const qrNumber = invNom.slice(-5);

  const getItemData = async () => {
    const itemData = {
      type: invNom[0],
      qr: qrNumber,
      name,
      model,
      sernom,
    };
    navigation.navigate("docsEdit", {
      itemData,
    });
  };

  useEffect(() => {
    // name
    const getAnalysis = async () => {};
    getAnalysis();
  }, [data]);

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
              <ScanDataItem
                icon="information-outline"
                header="Результат анализирования"
                data="analysis"
              />
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
    </ScrollView>
  );
}

export default Docs;
