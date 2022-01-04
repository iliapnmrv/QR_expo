import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Button,
  Platform,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  PermissionsAndroid,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import Icon from "react-native-vector-icons/FontAwesome5";
import * as Clipboard from "expo-clipboard";
import "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { styles } from "./styles/styles.js";
import { SESSIONS_INFO } from "../../constants/constants";
import ScanButton from "../../components/Buttons/ScanButton";
import ScanData from "../../components/ScanData/ScanData.js";

const requestStoragePermission = async () => {
  let check = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
  );
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
  return true;
};

// Сегодняшняя дата
let today = new Date();
let dd = String(today.getDate()).padStart(2, "0");
let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
let yyyy = today.getFullYear();

today = dd + "." + mm + "." + yyyy;

export function Inventory({ route, navigation }) {
  const dispatch = useDispatch();

  const { status, sessionDate } = useSelector(({ session }) => session);
  const { remains } = useSelector(({ scan }) => scan);
  const { scanStatus, scanResult } = useSelector(
    ({ scanResult }) => scanResult
  );

  // ------ Сессии
  // Данные сессии
  const setSessionStatus = async (status) => {
    dispatch({ type: "setSessionStatus", payload: status });
  };

  const setSessionDate = async (date) => {
    date = date == "Сессия еще не была открыта" ? "" : date.substr(-10);
    dispatch({ type: "setSessionDate", payload: date });
  };

  // Setters
  const setScannedData = async (data) => {
    dispatch({ type: "setScannedData", payload: data });
  };

  const setPrevPosition = async (position) => {
    dispatch({ type: "setPrevPosition", payload: position });
  };

  const setSredstvo = async (sredstvo) => {
    dispatch({ type: "setSredstvo", payload: sredstvo });
  };

  const setRemains = async (remains) => {
    dispatch({ type: "setRemains", payload: remains });
  };

  useEffect(() => {
    if (route.params?.scannedData) {
      let sred = route.params?.scannedData;
      sred[0] == 1 ? setSredstvo("ТМЦ") : setSredstvo("ОС");
      setScannedData(route.params.scannedData);
      setPrevPosition(route.params.prevScanPosition);
      setRemains(route.params.remains);
    }
  }, [route.params?.scannedData]);

  const onSessionChangeHandler = (status, date) => {
    if (status) {
      setSessionStatus(!status);
      setSessionDate(`Сессия еще не была открыта`);
    } else {
      setSessionStatus(!status);
      setSessionDate(`Сессия была открыта: ${date}`);
    }
  };

  const SessionClose = () => {
    setRemains(null);
    setSredstvo(null);
    setPrevPosition(null);
    setScannedData(null);
    db.transaction((tx) => {
      tx.executeSql(
        `
            DROP TABLE IF EXISTS qr;
            `,
        [],
        (_, result) => {
          deleteTables(true);
          setTimeout(() => {
            deleteTables(false);
          }, 5000);
        },
        (_, error) => console.log(`Error code 2: ${error}`)
      );
    });
    db.transaction((tx) => {
      tx.executeSql(
        `
            DROP TABLE IF EXISTS scanned;
            `,
        [],
        (_, result) => {},
        (_, error) => console.log(`Error code 2: ${error}`)
      );
    });
  };

  // ССылка для скачивания
  // получает ссылку
  const getLink = async () => {
    try {
      let url = await AsyncStorage.getItem("link");
      return url;
    } catch (e) {
      console.log("error", e);
    }
  };

  // устанавливает ссылку
  const setLink = async (link) => {
    link == null ? link == "sometext" : null;
    console.log(`Ссылка: ${link}`);
    try {
      await AsyncStorage.setItem("link", link);
    } catch (e) {
      console.log(`Error code 11: ${e}`);
    }
  };

  // по изменению статуса
  useEffect(() => {
    requestStoragePermission();
    getLink()
      .then((res) => {
        linkPlaceholder != res ? changeLinkPlaceholder(res) : null;
        downloadLink != res ? setDownloadLink(res) : null;
      })
      .catch((err) => {
        console.log("error", err);
      });
  }, []);

  // Подключение к бд
  const db = SQLite.openDatabase("qr.db");

  //  useState модальных окон
  const [scanModalVisible, setScanModalVisible] = useState(false);
  const [sessionModalVisible, setSessionModalVisible] = useState(false);
  const [DownloadedInfoModal, setDownloadedInfoModal] = useState(false);
  const [downloadLink, setDownloadLink] = useState(null);
  const [deletion, deleteTables] = useState(false);

  const [linkText, changeLinkText] = useState(null);
  const [linkPlaceholder, changeLinkPlaceholder] = useState("hhtps://");
  const [downloadedInfo, setDownloadedInfo] = useState(); // данные скачки новой бд

  const downloadFile = async (uri, fileUri) => {
    console.log("downloadFile func");
    if (uri == null) {
      return;
    }
    console.log("im here");
    FileSystem.downloadAsync(uri, fileUri)
      .then(({ uri }) => {
        saveFile(uri);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const saveFile = async (fileUri) => {
    let { status } = await MediaLibrary.getPermissionsAsync();
    if (status != "granted") {
      await MediaLibrary.requestPermissionsAsync();
    }
    const asset = await MediaLibrary.createAssetAsync(fileUri);
    await getFileData(asset.uri);
    // Обработать если нет разрешения
  };

  // Получает текст csv файла, который скачивается по ссылке
  const getFileData = async (uri) => {
    console.log("get file data");
    try {
      let read = await FileSystem.readAsStringAsync(uri);
      csvToJSON(read);
    } catch (e) {
      console.error(`${e}`);
    }
  };

  //var csv is the CSV file with headers
  async function csvToJSON(csv) {
    var lines = csv.split(/\r\n|\n|\r/);
    var result = [];
    var headers = lines[0].split(";");
    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(";");
      let name = currentline[2];
      if (name != undefined) {
        if (name.substr(name.length - 1) == '"') {
          name = name
            .substring('"', name.length - 1)
            .substring(1)
            .replace('"' + '"', '"'); //удаление лишних кавычек
        }
      }
      currentline[2] = name;
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    let json = JSON.stringify(result);
    insertJSONObj(json); //json объект для вставки в бд
  }

  const createDB = async () => {
    db.transaction((tx) => {
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
        (_, result) => {},
        (_, error) => console.log(error)
      );
    });
    db.transaction((tx) => {
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
        (_, result) => {},
        (_, error) => console.log(error)
      );
    });
  };

  const insertJSONObj = async (json) => {
    let data = JSON.parse(json);
    setDownloadedInfo(data.length);
    setDownloadedInfoModal(true);
    setTimeout(() => {
      setDownloadedInfoModal(false);
    }, 5000);
    for (let i = 0; i < data.length; i++) {
      let obj = data[i];
      let id = obj.id;
      let vedPos = obj.vedPos;
      let name = obj.name;
      let place = obj.place;
      let kolvo = obj.kolvo;
      let placePriority = obj.placePriority;
      insert(id, vedPos, name, place, kolvo, placePriority);
    }
  };

  const insert = (id, vedPos, name, place, kolvo, placePriority) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO qr (id, vedPos, name, place, kolvo, placePriority) VALUES(?, ?, ?, ?, ?, ?)`,
        [id, vedPos, name, place, kolvo, placePriority],
        (_, result) => {},
        (_, error) => console.log(error)
      );
    });
  };

  const downloadDB = async () => {
    // Информация для скачивания
    let csvUri = `${FileSystem.documentDirectory}1.csv`; //Место, где находится cкачанный csv файл
    const url = await getLink(); // Ссылка, откуда скачивается - external url

    await createDB(); //создание бд
    await downloadFile(url, csvUri);
  };

  const insertTextFromClipboard = async () => {
    const text = await Clipboard.getStringAsync();
    changeLinkText(text);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {Platform.OS === "web" ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={styles.containerText}>
              Expo SQlite не поддерживается в браузере!
            </Text>
          </View>
        ) : (
          <></>
        )}
        {/* Информация о сессии */}
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text>{sessionDate}</Text>
        </View>
        <View style={styles.sessionInfo}>
          <Text style={status ? styles.active : styles.danger}>
            {SESSIONS_INFO[status].info}
          </Text>
          <Button
            title={SESSIONS_INFO[status].button}
            onPress={() => {
              status
                ? setSessionModalVisible(true)
                : (downloadDB(), onSessionChangeHandler(status, today));
            }}
          />
          {!status && (
            <Icon
              name="edit"
              size={25}
              color="#A9A9A9"
              onPress={() => {
                setDownloadLink(true);
              }}
            />
          )}
          <Modal
            animationType="slide"
            transparent={true}
            visible={downloadLink}
            onRequestClose={() => {
              setDownloadLink(!downloadLink);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.maintext}>
                  Введите ссылку для скачивания
                </Text>
                <View style={[styles.buttons, styles.modalCenter]}>
                  <Icon
                    name="clipboard"
                    size={30}
                    color="#A9A9A9"
                    onPress={() => {
                      insertTextFromClipboard();
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={linkPlaceholder}
                    onChangeText={(text) => {
                      changeLinkText(text);
                    }}
                    value={linkText}
                  />
                </View>
                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={[styles.button, styles.accept]}
                    onPress={() => {
                      setLink(linkText);
                      setDownloadLink(!downloadLink);
                    }}
                  >
                    <Text style={styles.btnTextStyle}>Сохранить</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.reject]}
                    onPress={() => {
                      setDownloadLink(!downloadLink);
                    }}
                  >
                    <Text style={styles.btnTextStyle}>Закрыть</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        <View>
          <ScanButton navigation={navigation} />
          <ScanData />
        </View>

        {/* Результаты анализирования */}
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={scanModalVisible}
            onRequestClose={() => {
              setScanModalVisible(!scanModalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View
                style={[
                  styles.modalView,
                  scanStatus == "В учете"
                    ? styles.lightGreen
                    : scanStatus == "Позиция не в учете"
                    ? styles.lightYellow
                    : scanStatus == "Позиция сверх учета"
                    ? styles.lightBlue
                    : scanStatus == "Повторное считывание"
                    ? styles.lightRed
                    : null,
                ]}
              >
                <Text
                  style={[
                    styles.maintext,
                    scanStatus == "В учете"
                      ? styles.green
                      : scanStatus == "Позиция не в учете"
                      ? styles.yellow
                      : scanStatus == "Позиция сверх учета"
                      ? styles.blue
                      : scanStatus == "Повторное считывание"
                      ? styles.red
                      : null,
                  ]}
                >
                  {scanStatus}
                </Text>
                {scanResult && (
                  <Text style={styles.maintext}>{scanResult}</Text>
                )}
                {remains && (
                  <Text style={[styles.maintext, styles.itemsRemain]}>
                    {remains}
                  </Text>
                )}
                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      scanStatus == "В учете" ? styles.accept : styles.reject,
                    ]}
                    onPress={() => {
                      setScanModalVisible(!scanModalVisible);
                    }}
                  >
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
            onRequestClose={() => {
              setSessionModalVisible(!sessionModalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.maintext}>
                  Вы точно хотите закрыть инвентаризационную сессию?
                </Text>
                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={[styles.button, styles.accept]}
                    onPress={() => {
                      setSessionModalVisible(!sessionModalVisible);
                      onSessionChangeHandler(status, today);
                      SessionClose();
                    }}
                  >
                    <Text style={styles.btnTextStyle}>Да, закрыть</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.reject]}
                    onPress={() => {
                      setSessionModalVisible(!sessionModalVisible);
                    }}
                  >
                    <Text style={styles.btnTextStyle}>Отменить</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>

      {/* Сообщения пользователю */}
      {/* {deletion && <Message message={"Таблицы успешно очищены"} sec={5} />}
{DownloadedInfoModal && (
  <Message
    message={`Успешно загружено ${downloadedInfo} строк`}
    sec={5}
  />
)}
{downloadLink != null && !downloadLink && (
  <Message
    message={
      linkText != null
        ? `Ссылка для скачивания изменена на `
        : "Ссылка не была введена"
    }
    secondLine={linkText != null ? linkText : null}
    sec={4}
  />
)} */}
    </View>
  );
}

export default Inventory;
