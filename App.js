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
  Modal,
  Alert,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";


export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Nothing Scanned! :(')
  const [forceUpdate, forceUpdateId] = useForceUpdate();


  const addDB = (data) =>{
    Alert.alert(
      "QR успешно отсканирован",
      data,
      [
        {
          text: "Отменить",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Добавить в базу данных", onPress: () => analyze(data) }
      ]
    );
  } 



  // Функция загрузки базы данных из папки assets
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
      </View>
      )
  }


 const analyze = (data) => { // анализирование, если такой предмет есть в инвентаризаци
  let arr = data.split("\n") //массив разделенный по новой строке
  // разбор массива
  let kod = arr[0]
  let name = arr[1]
  let trace = arr[2]
  let model = arr[3] // Модель
  let serNom = arr[4] // Серийный номер
  let status
  console.log("Analyzing...")
  db.transaction(
    tx => {
      tx.executeSql(
        'SELECT * FROM qr WHERE kod = ? AND name = ?', 
        [kod, name], 
        (_, result) => {
          if (!result.rows.length) {
            status = 2 //не в учете
            // setStatus("Предмет не в учете")
          }else{
            status = 1 // в учете
            var len = result.rows.length;
            let row = result.rows.item(0);
            console.log(`Вещь в списке под номером ${row.index}`)
          }
          add(kod, name, status, trace, model, serNom)
        },
        (_, error) => console.log(error)
    );
    }
  );
 }

  // 1 действие: проверка предмета на нахождение в бд => изменение статуса
  // 2 действие: добавление в таблицу отсканированных предметов с указанным статусом
  const add = (kod, name, status, trace, model, serNom) => {
    console.log("Adding...")
    // db.transaction(
    //   tx => {
    //     tx.executeSql('INSERT INTO scanned (kod, name, status, trace, model, serNom) VALUES(?, ?, ?, ?, ?, ?)', [kod, name, status, trace, model, serNom], (trans, result) => {
    //       console.log(result.rows._array)
    //   });
    //   }
    // );
  };

  // Scanned bar code 
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data)
    // addDB(data)
    setModalVisible(true)
    console.log("Успешно отсканировано")
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
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => { setModalVisible(!modalVisible) }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.maintext}>{text}</Text>
              <View style={styles.buttons}>
                <TouchableOpacity style={[styles.button, styles.accept]} onPress={() => {
                  setModalVisible(!modalVisible)
                  analyze(text)
                }}>
                  <Text style={styles.textStyle}>Анализировать</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.reject]} onPress={() => {
                  setModalVisible(!modalVisible)
                  console.log("Ничего не анализировалось")
                }}>
                  <Text style={styles.textStyle}>Закрыть</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      {scanned && <Button style={styles.scanBtn} title={'SCAN THIS!'} onPress={() => setScanned(false)} color='lightblue' />}
    </View>
  );
}
function useForceUpdate() {
 const [value, setValue] = useState(0);
 return [() => setValue(value + 1), value];
}

//Styles 
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  buttons:{
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  accept: {
    backgroundColor: '#28a745',
  },
  reject: {
    backgroundColor: '#dc3545',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  maintext: {
    fontSize: 20,
    padding: 5,
    // margin: 30,
  },

  baseText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },

  scanBtn :{
    marginBottom: 20,
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