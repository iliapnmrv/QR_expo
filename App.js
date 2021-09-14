import React, { useState, useEffect } from 'react';
import { 
  StyleSheet,
  Text, 
  View, 
  Button, 
  Platform,
  ScrollView, 
  TouchableOpacity,
  Modal,
  Alert
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Asset } from "expo-asset";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from 'expo-media-library';

function HomeScreen({navigation}) {


  // ------ Сессии
  // Данные сессии
  const [sessionStatus, setSessionStatus] = useState(false);
  const [sessionInfo, setSessionInfo] = useState("Сессия закрыта");
  const [sessionBtn, setSessionBtn] = useState("Открыть сессию");

  // получает статус сессии
  const getSessionStatus = async () => {
    try {
      const result = await AsyncStorage.getItem('session');
      return result;
    } catch(e) {
      console.log('error', e);
    };
  };

  // устанавливает статус сессии
  const setSessionInStorage = async (sessionVal) => {
    try {
      let val = JSON.stringify(sessionVal)
      await AsyncStorage.setItem('session', val)
    } catch (e) {
      console.log(`Error code 6: ${e}`)
    }
  }

  // по изменению статуса
  useEffect(() => {
    getSessionStatus()
    .then(res => {
      let a = JSON.parse(res)
      setSessionStatus(a);
      if (a) {
        setSessionInfo("Сессия открыта")
        setSessionBtn("Закрыть сессию")
      }else {
        setSessionInfo("Сессия закрыта")
        setSessionBtn("Открыть сессию")
      }
    })
    .catch(err => {
      console.log('error', err);
    });
  }, []);

  const onSessionChangeHandler = (data) =>{
    if (data) {
      setSessionInStorage(!data)
      setSessionStatus(!data)
      setSessionInfo("Сессия закрыта")
      setSessionBtn("Открыть сессию")
    }else{
      setSessionInStorage(!data)
      setSessionStatus(!data)
      setSessionInfo("Сессия открыта")
      setSessionBtn("Закрыть сессию")
    }
  }

  const SessionClose = () => {
    db.transaction(
      tx => {
        tx.executeSql(
          'DELETE FROM scanned', 
          [], 
          (_, result) => {
            console.log("Таблица отсканированных qr кодов успешно очищена")
          },
          (_, error) => console.log(`Error code 2: ${error}`)
      );
      }
    );
  }

  // ------- Сессии end


  // Подключение к бд
  const db = SQLite.openDatabase('qr1.db');

  //  setState модальных окон
  const [modalVisible, setModalVisible] = useState(false);
  const [scanModalVisible, setScanModalVisible] = useState(false);
  const [sessionModalVisible, setSessionModalVisible] = useState(false);
  const [DownloadedInfoModal, setDownloadedInfoModal] = useState(false);

  const [downloadedInfo, setDownloadedInfo] = useState() // данные скачки новой бд
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Nothing Scanned! :(')
  const [scanRes, setScanRes] = useState() // результат сканирования
  const [scanStatus, setScanStatus] = useState() // статус сканирования
  const [itemsRemain, setItemsRemain] = useState()
  const [forceUpdate, forceUpdateId] = useForceUpdate();

  const download = () => {
    FileSystem.downloadAsync(
      Asset.fromModule(require('./assets/sqlite/qr1.db')).uri,
      `${FileSystem.documentDirectory}SQLite/qr1.db`
    )
    .then(({ uri }) => {
      console.log('Успешная загрузка в: ', uri);
    })
    .catch(error => {
      console.error(error);
    });
  }
  
  const deleteDB = async (fileUri) => {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      let del = await FileSystem.deleteAsync(fileUri);
      console.log("Успешно удалена база данных")
    }else{
      console.log("Nothing to delete from", fileUri)
    }
    download()
  }


  // Scanned bar code 
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data)
    setModalVisible(true)
    console.log("Успешно отсканировано")
  };

  const analyze = (data) => { // анализирование, если такой предмет есть в инвентаризаци
    let arr = data.split("\n") //массив разделенный по новой строке
    // разбор массива
    let invNom = arr[0] // Инвентарный номер
    let name // наименование
    arr[1] == undefined ?  name = '' : name = arr[1] // наименование
    let trace = arr[3] // номер прослеживаемости
    let model = arr[4] // Модель
    let serNom = arr[5] // Серийный номер
    let status
    db.transaction(
      tx => {
        tx.executeSql(
          'SELECT * FROM `qr` WHERE `name` = ? AND `kolvo` > 0 ORDER BY `placePriority`, `kolvo`', 
          [name], 
          (_, result) => {
            // Промис проверки на двойное сканирование
            let check = checkDouble(invNom)
            check.then(response => {
              if (response) { // если позиция еще не сканировалась
                setScanStatus(`Повторное считывание`)
                setScanRes(`Позиция с инвентарным номером ${invNom} уже сканировалась`)
              }else{
                if (!result.rows.length) { // если не нашлось таких записей
                  db.transaction(
                    tx => {
                      tx.executeSql(
                        'SELECT * FROM qr WHERE name = ?', 
                        [name], 
                        (_, result) => {
                          if (!result.rows.length) { // если не нашлось таких записей
                            status = 2 // не в учете
                            setScanStatus("Позиция не в учете")
                          }else{
                            status = 3 // сверх учета
                            setScanStatus("Позиция сверх учета")
                          }
                          setScanRes(null)
                        },
                        (_, error) => console.log(`Error code 5: ${error}`)
                    );
                    }
                  );
                }else{
                  status = 1 // в учете
                  let row = result.rows.item(0);
                  setScanStatus(`В учете`)
                  setScanRes(`Позиция: ${row.vedPos}, Место: ${row.place}`)
                  substractItem(row.id)
                }
                addScan(invNom, name, status, trace, model, serNom)
              }
              setItemsRemain(null)    
              setScanModalVisible(true) // модальное окно с результатом проверки
            })     
          },
          (_, error) => console.log(`Error code 10: ${error}`)
      );
      }
    );
  }

  
  // Проверка на дубликат сканирования - промис
  function checkDouble(invNom){
    return new Promise( resolve =>  {
       db.transaction(
        tx => {
          tx.executeSql(
            'SELECT * FROM scanned WHERE invNom = ?', 
            [invNom], 
            (_, result) => {
              if (result.rows.length) { // если результат = 1, то уже сканировался 
                resolve(true)
              }else{
                resolve(false)
              }
            },
            (_, error) => console.log(`Error code 10: ${error}`)
          );
        }
      ); 
    })
  }


  // вычитание позиции из строки
  const substractItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'UPDATE qr SET kolvo = kolvo - 1 WHERE `id` = ?', 
          [id], 
          (_, result) => {
            console.log('updated')
          },
          (_, error) => console.log(`Error code 4: ${error}`)
      );
      }
    );
    db.transaction(
      tx => {
        tx.executeSql(
          'SELECT * FROM qr WHERE `id` = ?', 
          [id], 
          (_, result) => {
            let row = result.rows.item(0);
            if (!row.kolvo) { //если не остается остатка
              setItemsRemain(`Последняя позиция`)
            }else{
              setItemsRemain(`Осталось ${row.kolvo} в строке ${row.vedPos}`)
            }
          },
          (_, error) => console.log(error)
      );
      }
    );
  }

  // 1 действие: проверка предмета на нахождение в бд => изменение статуса
  // 2 действие: добавление в таблицу отсканированных предметов с указанным статусом
  const addScan = (invNom, name, status, trace, model, serNom) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'INSERT INTO scanned (invNom, name, status, trace, model, serNom) VALUES(?, ?, ?, ?, ?, ?)', 
          [invNom, name, status, trace, model, serNom], 
          (_, result) => {
            console.log("Успешно добавлено в бд сканов")
          },
          (_, error) => console.log(`Error code 3: ${error}`)
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
        {/* Информация о сессии */}
        <View style={styles.sessionInfo}>
          <Text style={sessionStatus ? styles.active : styles.danger}>{sessionInfo}</Text>
          <Button title={sessionBtn} onPress={() => { sessionStatus ? setSessionModalVisible(true) : (
            deleteDB(`${FileSystem.documentDirectory}SQLite/qr.db`),
            onSessionChangeHandler(sessionStatus)
          )}} />
        </View>
        <View style={styles.barcodebox}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ height: 400, width: 400 }} />
        </View>
        {/* Информация о скачке новой базы данных */}
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={DownloadedInfoModal}
            onRequestClose={() => { setDownloadedInfoModal(!DownloadedInfoModal) }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.maintext}>{downloadedInfo}</Text>
                <View style={styles.buttons}>
                  <TouchableOpacity style={[styles.button, styles.reject]} onPress={() => { setDownloadedInfoModal(!DownloadedInfoModal) }}>
                    <Text style={styles.btnTextStyle}>Закрыть</Text>
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
                <Text style={[styles.maintext, scanStatus == "В учете" ? styles.green :
                                              scanStatus == "Позиция не в учете" ? styles.yellow : 
                                              scanStatus == "Позиция сверх учета" ? styles.blue :
                                              scanStatus == "Повторное считывание" ? styles.red :  null ]} >{scanStatus}</Text>
                {scanRes && <Text style={styles.maintext}>{scanRes}</Text>}
                {itemsRemain && <Text style={styles.maintext}>{itemsRemain}</Text>}
                <View style={styles.buttons}>
                  <TouchableOpacity style={[styles.button, styles.reject]} onPress={() => { setScanModalVisible(!scanModalVisible) }}>
                    <Text style={styles.btnTextStyle}>Закрыть</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
                    onSessionChangeHandler(sessionStatus)
                    SessionClose()
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
    borderRadius: 5,
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
    justifyContent: 'center',
    textAlign: 'center'
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
  // цвета статусов
  green: {
    color: '#28a745'
  },  
  red: {
    color: '#dc3545'
  },  
  blue: {
    color: '#85C1E9'
  },  
  yellow: {
    color: '#F1C40F'
  },
});