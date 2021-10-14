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
  PermissionsAndroid
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from 'expo-media-library';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Clipboard from 'expo-clipboard';
import 'react-native-gesture-handler';
import Message from '../UserMessage';

const requestStoragePermission = async () => {
  let check = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
  )
  if (!check) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }
  return true
};

// Сегодняшняя дата
let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();

today = dd + '.' + mm + '.' + yyyy;


export default function HomeScreen({route, navigation}, props) {
  // ------ Сессии
  // Данные сессии
  const [sessionStatus, setSessionStatus] = useState(false);
  const [sessionInfo, setSessionInfo] = useState("Сессия закрыта");
  const [sessionBtn, setSessionBtn] = useState("Открыть сессию");
  const [sessionDate, setSessionDate] = useState(null); //дата открытия сессии
  
  const getItemsRemainInStorage = async () => {
    let data = await AsyncStorage.getItem('itemsRemain');
    if (data[0] === '\"') {
      data = data.substr(1).slice(0, -1)
    }
    setItemsRemain(data)
  };

  // получает статус сессии
  const getSessionStatus = async () => {
    try {
      const status = await AsyncStorage.getItem('session');
      const date = await AsyncStorage.getItem('sessionDate');
      let arr = [status, date]
      return arr;
    } catch(e) {
      console.log('error', e);
    };
  };

  const getPrevScan = async () => {
    let data = await AsyncStorage.getItem('scannedData');
    data = data.replace(/\\n/g, '\n')
    if (data[0] === '\"') {
      data = data.substr(1).slice(0, -1)
    }
    setScannedData(data)
  };

  const getScanPosStorage = async () => {
    let data = await AsyncStorage.getItem('prevScanPosition');
    data = data.replace(/\\n/g, '\n')
    if (data[0] === '\"') {
      data = data.substr(1).slice(0, -1)
    }
    setPrevScanPosition(data)
  };

  
  const setPrevScan = async (prevScan) => {
    let val = JSON.stringify(prevScan)
    await AsyncStorage.setItem('scannedData', val)
  }
  
  // устанавливает статус сессии
  const setSessionInStorage = async (sessionVal) => {
    try {
      let val = JSON.stringify(sessionVal)
      await AsyncStorage.setItem('session', val)
    } catch (e) {
      console.log(`Error code 6: ${e}`)
    }
  }
  
  const setSessionDateInStorage = async (date) => {
    try {
      date == null ? date = '' : null
      await AsyncStorage.setItem('sessionDate', date)
    } catch (e) {
      console.log(`Error code 12: ${e}`)
    }
  }

  useEffect(() => {
    itemsRemain != null ? (
      (async () => {
        await AsyncStorage.setItem('itemsRemain', JSON.stringify(itemsRemain))
      })()
    ) : null
  }, [itemsRemain])

  useEffect(() => {
    prevScanPosition != null ? (
      (async () => {
        await AsyncStorage.setItem('prevScanPosition', JSON.stringify(prevScanPosition))
      })()
    ) : null
  }, [prevScanPosition])

  useEffect(() => {
    scannedData != null ? (
      (async () => {
        await AsyncStorage.setItem('scannedData', JSON.stringify(scannedData))
      })()
    ) : null
  }, [scannedData])

  useEffect(() => {
    if (route.params?.scannedData) {
     setScannedData(route.params.scannedData)
     setPrevScanPosition(route.params.prevScanPosition)
     setPrevScan(route.params.scannedData)
     setItemsRemain(route.params.itemsRemain)
   }
  }, [route.params?.scannedData]);
  
    useEffect(() => {
      getSessionStatus()
      .then(arr => {
        arr[0] = arr[0] == "false" || arr[0] == null ? false : true
        setSessionStatus(arr[0]);
        setSessionDate(arr[1]);
        if (arr[0]) {
          setSessionInfo("Сессия открыта")
          setSessionBtn("Закрыть сессию")
          getPrevScan()
          getScanPosStorage()
          getItemsRemainInStorage()
        }else {
          setSessionInfo("Сессия закрыта")
          setSessionBtn("Открыть сессию")
        }
        arr[1] != null ? setSessionDate(`Сессия была открыта: ${arr[1]}`) : setSessionDate(`Сессия еще не была открыта`)
      })
      .catch(err => {
        console.log('error', err);
      });
    }, []);
  
    const onSessionChangeHandler = (status, date) =>{
      if (status) {
        setSessionInStorage(!status)
        setSessionStatus(!status)
        setSessionDateInStorage(null)
        setSessionDate(`Сессия еще не была открыта`)
        setSessionInfo("Сессия закрыта")
        setSessionBtn("Открыть сессию")
      }else{
        setSessionInStorage(!status)
        setSessionStatus(!status)
        setSessionDateInStorage(date)
        setSessionDate(`Сессия была открыта: ${date}`)
        setSessionInfo("Сессия открыта")
        setSessionBtn("Закрыть сессию")
      }
    }
  
    const SessionClose = () => {
      setItemsRemain(null)
      setPrevScanPosition(null)
      setScannedData(null)
      db.transaction(
        tx => {
          tx.executeSql(
            `
            DROP TABLE IF EXISTS qr;
            `, 
            [], 
            (_, result) => {
                deleteTables(true)
                setTimeout(() => {
                    deleteTables(false)
                }, 5000);
            },
            (_, error) => console.log(`Error code 2: ${error}`)
        );
        }
      );
      db.transaction(
        tx => {
          tx.executeSql(
            `
            DROP TABLE IF EXISTS scanned;
            `, 
            [], 
            (_, result) => {},
            (_, error) => console.log(`Error code 2: ${error}`)
        );
        }
      ); 
    }  
  
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
      requestStoragePermission()
      getLink()
      .then(res => {
        linkPlaceholder != res ? changeLinkPlaceholder(res) : null
        downloadLink != res ? setDownloadLink(res) : null
      })
      .catch(err => {
        console.log('error', err);
      });
    }, []);
  
  
    // Подключение к бд
    const db = SQLite.openDatabase('qr.db');
  
    //  useState модальных окон
    const [scanModalVisible, setScanModalVisible] = useState(false);
    const [sessionModalVisible, setSessionModalVisible] = useState(false);
    const [DownloadedInfoModal, setDownloadedInfoModal] = useState(false);
    const [downloadLink, setDownloadLink] = useState(null);
    const [deletion, deleteTables] = useState(false)

    const [scannedData, setScannedData] = useState(null)
    const [prevScanPosition, setPrevScanPosition] = useState(null) // Информация о предыдущем сканировании
  
    const [linkText, changeLinkText] = useState(null);
    const [linkPlaceholder, changeLinkPlaceholder] = useState("hhtps://");
    const [downloadedInfo, setDownloadedInfo] = useState() // данные скачки новой бд
    const [scanRes, setScanRes] = useState() // результат сканирования
    const [scanStatus, setScanStatus] = useState() // статус сканирования
    const [itemsRemain, setItemsRemain] = useState()
  
    const downloadFile = async (uri, fileUri) => {
      console.log("downloadFile func")
      if (uri == null) {
        return
      }
      console.log("im here")
      FileSystem.downloadAsync(uri, fileUri)
      .then(({ uri }) => {
        saveFile(uri);
      })
      .catch(error => {
        console.error(error);
      })
    }
  
    const saveFile = async (fileUri) => {
      let { status } = await MediaLibrary.getPermissionsAsync();
      if (status != 'granted') {
        await MediaLibrary.requestPermissionsAsync()
      }
      const asset = await MediaLibrary.createAssetAsync(fileUri)
      await getFileData(asset.uri)
      // Обработать если нет разрешения
    }
  
  
    // Получает текст csv файла, который скачивается по ссылке
    const getFileData = async (uri) => {
      console.log("get file data")
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
      var result = [];
      var headers=lines[0].split(";");
      for(var i=1;i<lines.length;i++){
          var obj = {};
          var currentline=lines[i].split(";");
          let name = currentline[2]
          if (name != undefined) {
            if (name.substr(name.length - 1) == '\"') {
              name = name.substring('\"', name.length - 1).substring(1).replace('\"' + '\"', '\"') //удаление лишних кавычек
            }
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
              pos           INT(63), 
              place         VARCHAR(127),
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

    const insertJSONObj = async (json) => {
        let data = JSON.parse(json)
        setDownloadedInfo(data.length)
        setDownloadedInfoModal(true)
        setTimeout(() => {
              setDownloadedInfoModal(false)
        }, 5000);
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
  
    const insert = (id, vedPos, name, place, kolvo, placePriority) => {
      db.transaction(
        tx => {
          tx.executeSql(
            `INSERT INTO qr (id, vedPos, name, place, kolvo, placePriority) VALUES(?, ?, ?, ?, ?, ?)`, 
            [id, vedPos, name, place, kolvo, placePriority], 
            (_, result) => {

                
            },
            (_, error) => console.log(error)
        );
        }
      );
    }
  
    const downloadDB = async () => {
      // Информация для скачивания
      let csvUri = `${FileSystem.documentDirectory}1.csv`; //Место, где находится cкачанный csv файл
      const url = await getLink() // Ссылка, откуда скачивается - external url
  
      await createDB() //создание бд
      await downloadFile(url, csvUri)

    }
  
    const analyze = async (data) => { // анализирование, если такой предмет есть в инвентаризаци
      let arr = data.split("\n") //массив разделенный по новой строке

      // разбор массива
      let invNom = arr[0] // Инвентарный номер
      let name // наименование
      name = arr[1] == undefined ?  '' : arr[1] // наименование
      let trace = arr[3] // номер прослеживаемости
      let model = arr[4] // Модель
      let serNom = arr[5] // Серийный номер
      let status, pos
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
                  let row = getRow(invNom)
                  row.then(position=>{
                    if (Array.isArray(position)) { //если известна позиция и место
                      setScanRes(`Инвентарный номер ${invNom} уже сканировался, позиция: ${position[0]}, ${position[1]}`)
                    }else{
                      setScanRes(`Инвентарный номер ${invNom} уже сканировался, ${position}`)
                    }
                    setScanStatus(`Повторное считывание`)
                  })
                }else{
                  let row = result.rows.item(0);
                  if (!result.rows.length) { // если не нашлось таких записей
                    db.transaction(
                      tx => {
                        tx.executeSql(
                          'SELECT * FROM qr WHERE name = ?', 
                          [name], 
                          (_, result) => {
                            if (!result.rows.length) { // если не нашлись записи
                              status = 2 // не в учете
                              setScanStatus("Позиция не в учете")
                              pos = "Не в учете"
                            }else{
                              status = 3 // сверх учета
                              setScanStatus("Позиция сверх учета")
                              pos = "Сверх учета"
                            }
                            let place = null
                            setScanRes(null)
                            addScan(invNom, name, status, model, serNom, pos, place, trace)
                            setPrevScanPosition(`Номер QR кода ${num}, статус: ${pos}`)
                          },
                          (_, error) => console.log(`Error code 5: ${error}`)
                      );
                      }
                    );
                  }else{
                    status = 1 // в учете
                    setScanStatus(`В учете`)
                    setScanRes(`Позиция: ${row.vedPos}, Место: ${row.place}`)
                    addScan(invNom, name, status, model, serNom, row.vedPos, row.place, trace)
                    substractItem(row.id, name)
                  }
                  let num = invNom.substr(invNom.length - 5); // номер qr кодa
                  if (row?.vedPos) {
                    setPrevScanPosition(`Номер QR кода ${num}, позиция: ${row.vedPos}, место: ${row.place == undefined ? null : row.place}`)
                  }
                }
                // setItemsRemain(null)    
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

    // Получает строку отсканированного предмета
    const getRow = (invNom) => {
      return new Promise(resolve=>{
        db.transaction(
          tx => {
            tx.executeSql(
              'SELECT * FROM `scanned` WHERE invNom = ?', 
              [invNom], 
              (_, result) => {
                let row = result.rows.item(0);
                if (row.status == 2) {
                  resolve(row.pos)
                } else if (row.status == 3) {
                  resolve(row.pos)
                }else{
                  resolve([row.pos, row.place]) // если статус 1
                }
              },
              (_, error) => console.log(error)
          );
          }
        );
      })
      
    }
  
  
    // вычитание позиции из строки
    const substractItem = (id, name) => {
      db.transaction(
        tx => {
          tx.executeSql(
            'UPDATE qr SET kolvo = kolvo - 1 WHERE `id` = ?', 
            [id], 
            (_, result) => {},
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
                setItemsRemain(`Позиция закрыта`)
              }else{
                let left = row.kolvo // оставшееся количество предметов
                let pos = row.vedPos // строка в ведомости
                db.transaction(
                  tx => {
                    tx.executeSql(
                      'SELECT * FROM scanned WHERE `name` = ? AND `pos` = ?', 
                      [name, pos], 
                      (_, result) => {
                        let scanned = result.rows.length
                        setItemsRemain(`${scanned}/${left+scanned}, строка: ${pos} `)
                      },
                      (_, error) => console.log(error)
                  );
                  }
                );
              }
            },
            (_, error) => console.log(error)
        );
        }
      );
    }
  
    // 1 действие: проверка предмета на нахождение в бд => изменение статуса
    // 2 действие: добавление в таблицу отсканированных предметов с указанным статусом
    const addScan = (invNom, name, status, model, serNom, pos, place, trace) => {
      db.transaction(
        tx => {
          tx.executeSql(
            'INSERT INTO scanned (invNom, name, status, model, serNom, pos, place, trace) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', 
            [invNom, name, status, model, serNom, pos, place, trace], 
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
              <Text style={styles.containerText}>
                Expo SQlite не поддерживается в браузере!
              </Text>
            </View>
          ) : (
            <>
            </>
          )}
          {/* Информация о сессии */}
          <View style={{width: '100%', alignItems: 'center',}}>
            <Text>
              {sessionDate}
            </Text>
          </View>
          <View style={styles.sessionInfo}>
            <Text style={sessionStatus ? styles.active : styles.danger}>{sessionInfo}</Text>
            <Button title={sessionBtn} onPress={() => { sessionStatus ? setSessionModalVisible(true) : (
              downloadDB(),
              onSessionChangeHandler(sessionStatus, today)
            )}} />
            {!sessionStatus && <Icon name="edit" size={25} color="#A9A9A9" onPress={()=>{ setDownloadLink(true) }}/>}
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
                      placeholder={linkPlaceholder}
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
          <View style={styles.mainContent}>
            <TouchableOpacity 
              activeOpacity={0.5}
              style={styles.buttonMain} 
              onPress={() => navigation.navigate('scanner')
            }>
              
              <MaterialCommunityIcon name="qrcode-scan" size={30} style={{paddingRight: 10,}} color="#909090" onPress={()=>{ insertTextFromClipboard() }}/>
            
              <Text style={styles.buttonMainText} >Нажмите, чтобы отсканировать QR код</Text>
            </TouchableOpacity>
            <View style={styles.prevScan}>
              {scannedData !== null ?
                <View>
                  <View>
                    <Text style={styles.secondHeader}>Информация QR кода</Text>
                    <Text style={styles.info}>{scannedData}</Text>
                  </View>
                  {prevScanPosition ? (
                    <View>
                      <Text style={styles.secondHeader}>Позиция сканирования</Text>
                      <Text style={[styles.info, styles.biggerFont]}>{prevScanPosition}</Text>
                    </View>
                  ) : null}
                  {itemsRemain ? (
                    <View>
                      <Text style={styles.secondHeader}>Осталось</Text>
                      <Text style={[styles.info, styles.biggerFont]}>{itemsRemain}</Text>
                    </View>
                  ) : null}

                  {sessionStatus ?                   
                    <TouchableOpacity 
                      style={[styles.analyzeBtn, styles.button, styles.accept]} 
                      onPress={ () => {
                          analyze(scannedData)
                    }}>
                      <Text style={styles.btnTextStyle}>Найти в ведомости</Text>
                    </TouchableOpacity> : null
                  }
                  </View> : <Text>Предыдущих сканирований не было</Text>
                }
            </View>
          </View> 
  
          {/* Результаты анализирования */}
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={scanModalVisible}
              onRequestClose={() => { setScanModalVisible(!scanModalVisible) }}>
              <View style={styles.centeredView}>
                <View style={[styles.modalView, scanStatus == "В учете" ? styles.lightGreen :
                                              scanStatus == "Позиция не в учете" ? styles.lightYellow : 
                                              scanStatus == "Позиция сверх учета" ? styles.lightBlue :
                                              scanStatus == "Повторное считывание" ? styles.lightRed :  null]}>
                  <Text style={[styles.maintext, scanStatus == "В учете" ? styles.green :
                                                scanStatus == "Позиция не в учете" ? styles.yellow : 
                                                scanStatus == "Позиция сверх учета" ? styles.blue :
                                                scanStatus == "Повторное считывание" ? styles.red :  null ]} >{scanStatus}</Text>
                  {scanRes && <Text style={styles.maintext}>{scanRes}</Text>}
                  {itemsRemain && <Text style={[styles.maintext, styles.itemsRemain]}>{itemsRemain}</Text>}
                  <View style={styles.buttons}>
                    <TouchableOpacity style={[styles.button, scanStatus == "В учете" ? styles.accept : styles.reject ]} onPress={() => { setScanModalVisible(!scanModalVisible) }}>
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
                      onSessionChangeHandler(sessionStatus, today)
                      SessionClose()
                    }}>
                      <Text style={styles.btnTextStyle}>Да, закрыть</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.button, styles.reject]} 
                      onPress={() => { setSessionModalVisible(!sessionModalVisible) }}>
                        <Text style={styles.btnTextStyle}>Отменить</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
          </ScrollView>

            {/* Сообщения пользователю */}
            {deletion && <Message message={"Таблицы успешно очищены"} sec={5}/>}
            {DownloadedInfoModal && <Message message={`Успешно загружено ${downloadedInfo} строк`} sec={5}/>}
            {downloadLink != null && !downloadLink && <Message 
                                message={linkText != null ? `Ссылка для скачивания изменена на ` : 'Ссылка не была введена'} 
                                secondLine={linkText != null ? linkText : null} 
                                sec={4}
                            />}
 
        </View>
    );
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
    prevScan:{
      flex: 1,
      justifyContent: 'center',
    },
    analyzeBtn: {
      alignSelf: 'flex-end',
    },
    secondHeader:{
      paddingHorizontal: 8,
      paddingVertical: 2,
      fontSize: 18,
      backgroundColor: '#f9f9f9',
    },
    info:{
      paddingHorizontal: 8,
      paddingVertical: 5,
    },
    biggerFont: {
      fontSize: 16,
    },
    buttonMain:{
      padding: 10,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: '#D0D0D0',     
      borderBottomWidth: 1,
      borderBottomColor: '#D0D0D0',
    },
    buttonMainText:{
      color: 'black',
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
      marginTop: 5,
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
    containerText: {
      textAlign: 'center',
      width: '100%',
    },
    maintext: {
      fontSize: 20,
      textAlign: 'center',
      padding: 1,
    },
  
    itemsRemain:{
      marginBottom: 10,
    },
  
    scanBtn :{
      marginBottom: 0,
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
    lightGreen: {
      backgroundColor: '#ddfada'
    },  
    lightRed: {
      backgroundColor: '#ffe7e6'
    },  
    lightBlue: {
      backgroundColor: '#eafbff'
    },  
    lightYellow: {
      backgroundColor: '#ffffeb'
    },
  });