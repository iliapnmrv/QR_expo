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
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";

function HomeScreen({navigation}) {
  
  // Подключение к бд
  db = SQLite.openDatabase('qr.db');

  // Данные сессии
  const [sessionInfo, setSessionInfo] = useState("Сессия закрыта  ");
  const [sessionBtn, setSessionBtn] = useState("Открыть сессию");
  const [sessionStatus, setSessionStatus] = useState(false);
  //  setState модельных окон
  const [modalVisible, setModalVisible] = useState(false);
  const [scanModalVisible, setScanModalVisible] = useState(false);
  const [sessionModalVisible, setSessionModalVisible] = useState(false);

  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Nothing Scanned! :(')
  const [scanRes, setScanRes] = useState()
  const [itemsRemain, setItemsRemain] = useState()
  const [forceUpdate, forceUpdateId] = useForceUpdate();

  changeSession = (data) =>{
    if (!data) {
      setSessionStatus(!data)
      setSessionInfo("Сессия открыта")
      setSessionBtn("Закрыть сессию")
    }else{
      setSessionStatus(!data)
      setSessionInfo("Сессия закрыта")
      setSessionBtn("Открыть сессию")
    }
  }

  // Scanned bar code 
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data)
    setModalVisible(true)
    console.log("Успешно отсканировано")
  };

  analyze = (data) => { // анализирование, если такой предмет есть в инвентаризаци
    let arr = data.split("\n") //массив разделенный по новой строке
    // разбор массива
    let kod = arr[0] // номенкулатурный номер
    let name = arr[1] // наименование
    let trace = arr[2] // номер прослеживаемости
    let model = arr[3] // Модель
    let serNom = arr[4] // Серийный номер
    let status
    console.log("Analyzing...")
    db.transaction(
      tx => {
        tx.executeSql(
          'SELECT * FROM qr WHERE kod = ? AND name = ? AND kolvo > 0 ORDER BY kolvo', 
          [kod, name], 
          (_, result) => {
            if (!result.rows.length) { // если не нашлось таких записей
              db.transaction(
                tx => {
                  tx.executeSql(
                    'SELECT * FROM qr WHERE kod = ? AND name = ?', 
                    [kod, name], 
                    (_, result) => {
                      if (!result.rows.length) { // если не нашлось таких записей
                        status = 2 // не в учете
                        setScanRes("Позиция не в учете")
                      }else{
                        status = 3 // сверх учета
                        setScanRes("Позиция сверх учета")
                      }
                    },
                    (_, error) => console.log(error)
                );
                }
              );
            }else{
              status = 1 // в учете
              let row = result.rows.item(0);
              setScanRes(`Позиция: ${row.index}`)
              substractItem(row.index)
            }
            addScan(kod, name, status, trace, model, serNom)
            setScanModalVisible(true) // модальное окно с результатом проверки
            setItemsRemain(null)
          },
          (_, error) => console.log(error)
      );
      }
    );
  }
  
  substractItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'UPDATE qr SET kolvo = kolvo - 1 WHERE `index` = ?', 
          [id], 
          (_, result) => {
            console.log('updated')
          },
          (_, error) => console.log(error)
      );
      }
    );
    db.transaction(
      tx => {
        tx.executeSql(
          'SELECT * FROM qr WHERE `index` = ?', 
          [id], 
          (_, result) => {
            let row = result.rows.item(0);
            if (!row.kolvo) { //если не остается остатка
              setItemsRemain(`Последняя позиция в строке ${row.index}`)
            }else{
              setItemsRemain(`Осталось ${row.kolvo} в строке ${row.index}`)
            }
          },
          (_, error) => console.log(error)
      );
      }
    );
  }

  // 1 действие: проверка предмета на нахождение в бд => изменение статуса
  // 2 действие: добавление в таблицу отсканированных предметов с указанным статусом
  addScan = (kod, name, status, trace, model, serNom) => {
    console.log("Adding...")
    db.transaction(
      tx => {
        tx.executeSql(
          'INSERT INTO scanned (kod, name, status, trace, model, serNom) VALUES(?, ?, ?, ?, ?, ?)', 
          [kod, name, status, trace, model, serNom], 
          (_, result) => {
            console.log("Успешно добавлено")
          },
          (_, error) => console.log(error)
        );
      }
    );
  };

  return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
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
        <View style={styles.sessionInfo}>
          <Text style={sessionStatus ? styles.active : styles.danger}>{sessionInfo}</Text>
          <Button title={sessionBtn} onPress={() => { sessionStatus ? setSessionModalVisible(true) : changeSession(sessionStatus)}} />
        </View>
        <View style={styles.barcodebox}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ height: 400, width: 400 }} />
        </View>
        {/* Подтверждение закрытия сессии */}
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={sessionModalVisible}
            onRequestClose={() => { setSessionModalVisible(!sessionModalVisible) }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.maintext}>Вы точно хотите закрыть инвентаризационную сессию?</Text>
                <View style={styles.buttons}>
                  <TouchableOpacity style={[styles.button, styles.accept] } onPress={() => {
                    setSessionModalVisible(!sessionModalVisible)
                    changeSession(sessionStatus)
                  }}>
                    <Text style={styles.btnTextStyle}>Да, закрыть</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.reject]} onPress={() => { setSessionModalVisible(!sessionModalVisible) }}>
                    <Text style={styles.btnTextStyle}>Отменить</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        {/* Результаты анализирования */}
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={scanModalVisible}
            onRequestClose={() => { setScanModalVisible(!scanModalVisible) }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.maintext}>{scanRes}</Text>
                <Text style={styles.maintext}>{itemsRemain}</Text>
                <View style={styles.buttons}>
                  <TouchableOpacity style={[styles.button, styles.reject]} onPress={() => { setScanModalVisible(!scanModalVisible) }}>
                    <Text style={styles.btnTextStyle}>Закрыть</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        {/* Результаты сканирования QR */}
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
                  <TouchableOpacity style={[styles.button, styles.accept, sessionStatus ? null : styles.none] } onPress={() => {
                    setModalVisible(!modalVisible)
                    analyze(text)
                  }}>
                    <Text style={styles.btnTextStyle}>Анализировать</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.reject]} onPress={() => {
                    setModalVisible(!modalVisible)
                  }}>
                    <Text style={styles.btnTextStyle}>Закрыть</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        {scanned && <Button style={styles.scanBtn} title={'Сканировать'} onPress={() => setScanned(false)} color='lightblue' />}
        </ScrollView>
      </View>
  );
}

function App() {
  const Stack = createNativeStackNavigator();
  const [hasPermission, setHasPermission] = useState(null);

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


   return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Инвентаризация" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;

function useForceUpdate() {
 const [value, setValue] = useState(0);
 return [() => setValue(value + 1), value];
}

//Styles 
const styles = StyleSheet.create({
  none: {
    display: 'none',
  },

  sessionInfo:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  buttons:{
    flexDirection: "row",
    justifyContent: "center",
    width: "90%",
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginRight: 10,
    marginLeft: 10,
  },
  active:{
    color: '#28a745',
  },
  danger:{
    color: '#dc3545',
  },
  accept: {
    backgroundColor: '#28a745',
  },
  reject: {
    backgroundColor: '#dc3545',
  },
  btnTextStyle: {
    color: "white"
  },
  modalView: {
    justifyContent: 'center',
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
    width: '80%',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 5,
  },

  maintext: {
    fontSize: 20,
    padding: 5,
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
    overflow: 'hidden',
  },
});