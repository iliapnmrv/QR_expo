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
  TextInput,
  Alert
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from 'expo-media-library';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Clipboard from 'expo-clipboard';


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
          `
          DELETE FROM scanned;
          `, 
          [], 
          (_, result) => {
            console.log("Таблицы успешно очищены")
          },
          (_, error) => console.log(`Error code 2: ${error}`)
      );
      }
    );
    db.transaction(
      tx => {
        tx.executeSql(
          `
          DELETE FROM qr;
          `, 
          [], 
          (_, result) => {
            console.log("Таблицы успешно очищены")
          },
          (_, error) => console.log(`Error code 2: ${error}`)
      );
      }
    );
  }

  // ------- Сессии end


  // ССылка для скачивания
  // получает ссылку
  const getLink = async () => {
    try {
      let url = await AsyncStorage.getItem('link');
      return url
    } catch(e) {
      console.log('error', e);
    };
  };

  // устанавливает ссылку
  const setLink = async (link) => {
    link == null ? link == "sometext" : null
    console.log(`Ссылка: ${link}`)
    try {
      await AsyncStorage.setItem('link', link)
    } catch (e) {
      console.log(`Error code 11: ${e}`)
    }
  }

  // по изменению статуса
  useEffect(() => {
    getLink()
    .then(res => {
      downloadLink != res ? setDownloadLink(res) : null
    })
    .catch(err => {
      console.log('error', err);
    });
  }, []);


  // Подключение к бд
  const db = SQLite.openDatabase('qr.db');

  //  useState модальных окон
  const [modalVisible, setModalVisible] = useState(false);
  const [scanModalVisible, setScanModalVisible] = useState(false);
  const [sessionModalVisible, setSessionModalVisible] = useState(false);
  const [DownloadedInfoModal, setDownloadedInfoModal] = useState(false);
  const [downloadLink, setDownloadLink] = useState(false);

  const [linkText, changeLinkText] = useState(null);
  const [downloadedInfo, setDownloadedInfo] = useState() // данные скачки новой бд
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Nothing Scanned! :(')
  const [scanRes, setScanRes] = useState() // результат сканирования
  const [scanStatus, setScanStatus] = useState() // статус сканирования
  const [itemsRemain, setItemsRemain] = useState()
  const [forceUpdate, forceUpdateId] = useForceUpdate();

  // Проверка на существование папки/файла
  const ensureDirExists = async (fileUri) => {
    const dirInfo = await FileSystem.getInfoAsync(fileUri);
    if (!dirInfo.exists) {
      return false
    }
    return true
  }

  // Функция загрузки базы данных из папки assets
  const deleteFile = async (fileUri) => {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      let del = await FileSystem.deleteAsync(fileUri);
      console.log("Файл успешно удален")
    }else{
      console.log("Nothing to delete from", fileUri)
    }
  }

  const downloadFile = async (uri, fileUri) => {
    FileSystem.downloadAsync(uri, fileUri)
    .then(({ uri }) => {
      saveFile(uri);
    })
    .catch(error => {
      console.error(error);
    })
  }

  saveFile = async (fileUri) => {
    const { status } = await MediaLibrary.getPermissionsAsync();
    if (status === "granted") {
      const asset = await MediaLibrary.createAssetAsync(fileUri)
      console.log(asset.uri)
      await getFileData(asset.uri)
    }
    // Обработать если нет разрешения
  }


  // Получает текст csv файла, который скачивается по ссылке
  const getFileData = async (uri) => {
    try {
      let read = await FileSystem.readAsStringAsync(uri)
      csvToJSON(read)
    } catch (e) {
      console.error(`${e}`)
    }
  }

  //var csv is the CSV file with headers
  async function csvToJSON(csv){
    var lines=csv.split(/\r\n|\n|\r/);
    console.log(`lines: ${lines}`)
    // lines.replace(/;["]/g, ';').replace(/["];/g, ';').replace(/["]["]/g, /"/)
    var result = [];
    var headers=lines[0].split(";");
    for(var i=1;i<lines.length;i++){
        var obj = {};
        var currentline=lines[i].split(";");
        let name = currentline[2]
        if (name.substr(name.length - 1) == '\"') {
          name = name.substring('\"', name.length - 1).substring(1).replace('\"' + '\"', '\"') //удаление 1 и последней кавычки
        }
        currentline[2] = name
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    let json = JSON.stringify(result)
    insertJSONObj(json) //json объект для вставки в бд
  }

  const createDB = async () => {
    console.log("Creating a db")
    db.transaction(
      tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS qr(
            id            INTEGER  NOT NULL PRIMARY KEY,
            vedPos        INTEGER  NOT NULL,
            name          VARCHAR(200) NOT NULL,
            place         VARCHAR(100) NOT NULL,
            kolvo         INTEGER  NOT NULL,
            placePriority INTEGER  NOT NULL
          );
          `, 
          [], 
          (_, result) => {

          },
          (_, error) => console.log(error)
      );
      }
    );
    db.transaction(
      tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS scanned(
            id            INTEGER  NOT NULL PRIMARY KEY,
            invNom        VARCHAR(100)  NOT NULL,
            name          VARCHAR(200) NOT NULL,
            status        INTEGER NOT NULL,
            model         VARCHAR(200),
            serNom        VARCHAR(100),
            trace         VARCHAR(100)  
          );
          `, 
          [], 
          (_, result) => {

          },
          (_, error) => console.log(error)
      );
      }
    );
  }

  const insert = (id, vedPos, name, place, kolvo, placePriority) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `INSERT INTO qr (id, vedPos, name, place, kolvo, placePriority) VALUES(?, ?, ?, ?, ?, ?)`, 
          [id, vedPos, name, place, kolvo, placePriority], 
          (_, result) => {},
          (_, error) => console.log(error)
      );
      }
    );
  }

  const insertJSONObj = async (json) => {
    console.log(`json: ${json}`)
    let data = JSON.parse(json)
    setDownloadedInfo(`Успешно загружено! \nВ инвентаризационной описи ${data.length} строк`)
    setDownloadedInfoModal(true)
    for (let i = 0; i < data.length; i++) {
      let obj = data[i]
      let id = obj.id
      let vedPos = obj.vedPos
      let name = obj.name
      let place = obj.place
      let kolvo = obj.kolvo
      let placePriority = obj.placePriority
      insert(id, vedPos, name, place, kolvo, placePriority)
    }
  }

  const downloadDB = async () => {
    // Информация для скачивания
    let csvUri = `${FileSystem.documentDirectory}1.csv`; //Место, где находится cкачанный csv файл
    const url = await getLink() // Ссылка, откуда скачивается - external url
    url == null ? url = "https://www.dropbox.com/s/7hrrsjcb885hdsp/headers2.csv?dl=1" : null //значение по умолчанию
    console.log(`this is ${url}`)

    await createDB() //создание бд
    await downloadFile(url, csvUri)
    await deleteFile(csvUri)
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
                          addScan(invNom, name, status, model, serNom, trace)
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
                  addScan(invNom, name, status, model, serNom, trace)
                }
              }
              setItemsRemain(null)    
              setScanModalVisible(true) // модальное окно с результатом проверки
            })     
          },
          (_, error) => console.log(error)
      );
      }
    );
  }

  
  // Проверка на дубликат сканирования - промис
  function checkDouble(invNom){
    return new Promise(resolve =>  {
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
  const addScan = (invNom, name, status, model, serNom, trace) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'INSERT INTO scanned (invNom, name, status, model, serNom, trace) VALUES(?, ?, ?, ?, ?, ?)', 
          [invNom, name, status, model, serNom, trace], 
          (_, result) => {
            console.log("Успешно добавлено в бд сканов")
          },
          (_, error) => console.log(`Error code 3: ${error}`)
        );
      }
    );
  };

  const insertTextFromClipboard = async () => {
    const text = await Clipboard.getStringAsync();
    changeLinkText(text);
  }

  return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
        {Platform.OS === "web" ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={styles}>
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
            downloadDB(),
            onSessionChangeHandler(sessionStatus)
          )}} />
          <Icon name="edit" size={25} color="#A9A9A9" onPress={()=>{ setDownloadLink(true) }}/>
          <Modal
            animationType="slide"
            transparent={true}
            visible={downloadLink}
            onRequestClose={() => { setDownloadLink(!downloadLink) }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.maintext}>Введите ссылку для скачивания</Text>
                <View style={[styles.buttons, styles.modalCenter]} >
                  <Icon name="clipboard" size={30} color="#A9A9A9" onPress={()=>{ insertTextFromClipboard() }}/>
                  <TextInput
                    style={styles.input}
                    placeholder={linkText == null ? "https://": linkText}
                    onChangeText={text=>{ 
                      changeLinkText(text)
                    }}
                    value={linkText}
                  />
                </View>
                <View style={styles.buttons}>
                  <TouchableOpacity style={[styles.button, styles.accept] } onPress={() => {
                      setLink(linkText)
                      setDownloadLink(!downloadLink)
                    }}>
                    <Text style={styles.btnTextStyle}>Сохранить</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.reject]} onPress={() => { setDownloadLink(!downloadLink) }}>
                    <Text style={styles.btnTextStyle}>Закрыть</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#A9A9A9',
    padding: 10,
    alignSelf: 'center',
    width:'90%',
    marginLeft: 10,
  },
  modalCenter: {
    marginBottom: 15,
    marginTop: 10,
  },
  sessionInfo:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  sessionInfoButtons:{
    justifyContent: 'center',
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
    alignItems: 'center',
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
    textAlign: 'center',
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