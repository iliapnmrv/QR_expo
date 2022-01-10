import React from "react";
import { View, Text } from "react-native";
import ScanButton from "components/Buttons/ScanButton";
import { useSelector } from "react-redux";
import { styles } from "routes/Inventory/styles/styles";
import ScanDataItem from "components/ScanData/Item/ScanDataItem";

function Docs({ navigation }) {
  const { data } = useSelector(({ docs }) => docs.scan);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 5,
        justifyContent: "center",
      }}
    >
      <Text>Документооборот</Text>
      <ScanButton navigation={navigation} prevScreen="docs" />

      <View style={styles.prevScan}>
        {data !== null ? (
          <ScanDataItem
            icon="information-outline"
            header={`Информация QR кода`}
            data={data}
          />
        ) : (
          <Text style={{ padding: 20 }}>
            Отсканируйте позицию документооборота, чтобы просмотреть,
            изменить/добавить информацию
          </Text>
        )}
      </View>
    </View>
  );
}

export default Docs;
