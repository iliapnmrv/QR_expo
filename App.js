import React, { useState, useEffect } from 'react';
import { 
  StyleSheet,
  Text, 
  View, 
  Button, 
  Platform,
  ScrollView, 
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";


export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  // const [statusText, setStatus] = setState(() =>createAlert(statusText))
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Nothing Scanned! :(')
  const [forceUpdate, forceUpdateId] = useForceUpdate();


  const createAlert = (data) =>{
    Alert.alert(
      "QR успешно отсканирован",
      data,
      [
        {
          text: "Отменить",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Добавить в базу данных", onPress: () => console.log("add") }
      ]
    );
  } 
    


    // Функция загрузки базы данных в папки assets
    // бд перетираются при одинаковых названиях (добавляется новая)
  const download = () => {
    FileSystem.downloadAsync(
      Asset.fromModule(require('./assets/sqlite/qr.db')).uri,
      `${FileSystem.documentDirectory}SQLite/qr.db`
    )
    .then(({ uri }) => {
      console.log('Успешная загрузка в: ', uri);
    })
    .catch(error => {
      console.error(error);
    });
  }
  // download()

  // Подключение к бд
  db = SQLite.openDatabase('qr.db');

  // Ask user for camera permission
  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }

  useEffect(() => {
    askForCameraPermission();
  }, []);

   // Check permission & show view
   if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Asking for permission to use the camera.</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>Camera cannot be accessed.</Text>
        <Button title={'Allow Your Camera!'} onPress={() => askForCameraPermission()} />
      </View>)
  }


 const analyze = (data) => { // анализирование, если такой предмет есть в инвентаризаци
  let arr = data.split("\n") //массив разделенный по новой строке
  // разбор массива
  let kod = arr[0]
  let name = arr[1]
  let trace = arr[2]
  let model = arr[3] // Модель
  let serNom = arr[4] // Серийный номер
  let status, newStatusText
  console.log("Analyzing...")
  db.transaction(
    tx => {
      tx.executeSql('SELECT * FROM qr WHERE kod = ? AND name = ?', [kod, name], (trans, result) => {
        console.log(result.rows.length)
        if (!result.rows.length) {
          status = 2 //не в учете
          // setStatus("Предмет не в учете")
        }else{
          status = 1 // в учете
          // setStatus("Предмет в учете")
        }
        console.log(result.rows._array)
        add(kod, name, status, trace, model, serNom)
    });
    }
  );
 }

  // 1 действие: проверка предмета на нахождение в бд => изменение статуса
  // 2 действие: добавление в таблицу отсканированных предметов с указанным статусом
  const add = (kod, name, status, trace, model, serNom) => {
    console.log("Adding...")
    db.transaction(
      tx => {
        tx.executeSql('INSERT INTO scanned (kod, name, status, trace, model, serNom) VALUES(?, ?, ?, ?, ?, ?)', [kod, name, status, trace, model, serNom], (trans, result) => {
          console.log(result.rows._array)
      });
      }
    );
  };
     // Scanned bar code 
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data)
    createAlert(data)
    console.log("Успешно отсканировано")
    analyze(data)
  };

   return (
    <View style={styles.container}>
      <Text style={styles.baseText}>Инвентаризация</Text>
      {Platform.OS === "web" ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.heading}>
            Expo SQlite не поддерживается в браузере!
          </Text>
        </View>
      ) : (
        <>
        </>
      )}
        <View style={styles.barcodebox}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ height: 400, width: 400 }} />
        </View>
        <ScrollView>
          <Text style={styles.maintext}>{text}</Text>
        </ScrollView>
      {scanned && <Button title={'SCAN THIS!'} onPress={() => setScanned(false)} color='lightblue' />}
    </View>
  );
}
function useForceUpdate() {
 const [value, setValue] = useState(0);
 return [() => setValue(value + 1), value];
}

//Styles 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  maintext: {
    fontSize: 22,
    margin: 30,
  },

  baseText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },

  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    // height: 350,
    // width: 200,
    overflow: 'hidden',
    // borderRadius: 50,
    // backgroundColor: 'lightblue'
  },
});