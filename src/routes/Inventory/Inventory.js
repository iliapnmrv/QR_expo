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
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import Icon from "react-native-vector-icons/FontAwesome5";
import * as Clipboard from "expo-clipboard";
import "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { styles } from "./styles/styles.js";
import { SCAN_STATUS_COLOR, SESSIONS_INFO } from "constants/constants";
import ScanButton from "components/Buttons/ScanButton";
import ScanData from "components/ScanData/ScanData";
import {
  setDownloadUrl,
  setSessionDate,
  setSessionStatus,
} from "store/actions/inventory/sessionAction.js";
import {
  setPrevPosition,
  setRemains,
  setScanData,
  setSredstvo,
} from "store/actions/inventory/scanDataAction.js";
import {
  toggleCloseSessionModal,
  toggleDownloadLinkModal,
  toggleScanModal,
} from "store/actions/inventory/modalAction.js";
import { showMessage, hideMessage } from "react-native-flash-message";

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

function Inventory({ navigation }) {
  const dispatch = useDispatch();

  const { status, date, url } = useSelector(
    ({ inventory }) => inventory.session
  );
  const { remains } = useSelector(({ inventory }) => inventory.scan);
  const { scanModal, downloadLinkModal, closeSessionModal } = useSelector(
    ({ inventory }) => inventory.modals
  );
  const { scanStatus, scanResult } = useSelector(
    ({ inventory }) => inventory.scanResult
  );

  // ------ Сессии
  // Данные сессии

  const onSessionChangeHandler = (status) => {
    if (status) {
      dispatch(setSessionDate(`Сессия еще не была открыта`));
    } else {
      dispatch(setSessionDate(`Сессия была открыта: ${today}`));
    }
    dispatch(setSessionStatus(!status));
  };

  const SessionClose = () => {
    dispatch(setRemains(null));
    dispatch(setSredstvo(null));
    dispatch(setPrevPosition(null));
    dispatch(setScanData(null));
    db.transaction((tx) => {
      tx.executeSql(
        `DROP TABLE IF EXISTS qr;`,
        [],
        (_, result) => {
          showMessage({
            message: "Таблицы успешно очищены",
            type: "info",
          });
        },
        (_, error) => console.log(`Error code 2: ${error}`)
      );
    });
    db.transaction((tx) => {
      tx.executeSql(
        `DROP TABLE IF EXISTS scanned;`,
        [],
        (_, result) => {},
        (_, error) => console.log(`Error code 2: ${error}`)
      );
    });
  };

  // по изменению статуса
  useEffect(() => {
    requestStoragePermission();
  }, []);

  // Подключение к бд
  const db = SQLite.openDatabase("qr.db");

  //  useState модальных окон

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
    showMessage({
      message: `В инвентаризации ${data.length} строк`,
      type: "info",
    });
    for (let i = 0; i < data.length; i++) {
      let { id, vedPos, name, place, kolvo, placePriority } = data[i];
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

    await createDB(); //создание бд
    await downloadFile(url, csvUri);
  };

  const insertTextFromClipboard = async () => {
    const text = await Clipboard.getStringAsync();
    dispatch(setDownloadUrl(text));
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
          <Text>{date}</Text>
        </View>
        <View style={styles.sessionInfo}>
          <Text style={status ? styles.active : styles.danger}>
            {SESSIONS_INFO[status].info}
          </Text>
          <Button
            title={SESSIONS_INFO[status].button}
            onPress={() => {
              status
                ? dispatch(toggleCloseSessionModal(true))
                : (downloadDB(), onSessionChangeHandler(status));
            }}
          />
          {!status ? (
            <Icon
              name="edit"
              size={25}
              color="#A9A9A9"
              onPress={() => {
                dispatch(toggleDownloadLinkModal(true));
              }}
            />
          ) : null}
          <Modal
            animationType="slide"
            transparent={true}
            visible={downloadLinkModal}
            onRequestClose={() => {
              dispatch(toggleDownloadLinkModal(!downloadLinkModal));
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
                    placeholder={url}
                    onChangeText={(text) => {
                      dispatch(setDownloadUrl(text));
                    }}
                    value={url}
                  />
                </View>
                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={[styles.button, styles.accept]}
                    onPress={() => {
                      dispatch(setDownloadUrl(url));
                      dispatch(toggleDownloadLinkModal(!downloadLinkModal));
                    }}
                  >
                    <Text style={styles.btnTextStyle}>Сохранить</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.reject]}
                    onPress={() => {
                      dispatch(toggleDownloadLinkModal(!downloadLinkModal));
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
          <ScanButton navigation={navigation} prevScreen="inventory" />
          <ScanData />
        </View>

        {/* Результаты анализирования */}
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={scanModal}
            onRequestClose={() => {
              dispatch(toggleScanModal(!scanModal));
            }}
          >
            <View style={styles.centeredView}>
              <View
                style={[
                  styles.modalView,
                  styles[SCAN_STATUS_COLOR.modal[scanStatus]],
                ]}
              >
                <Text
                  style={[
                    styles.maintext,
                    styles[SCAN_STATUS_COLOR.text[scanStatus]],
                  ]}
                >
                  {scanStatus}
                </Text>
                {scanResult ? (
                  <Text style={styles.maintext}>{scanResult}</Text>
                ) : null}
                {remains ? (
                  <Text style={[styles.maintext, styles.itemsRemain]}>
                    {remains}
                  </Text>
                ) : null}
                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      scanStatus == "В учете" ? styles.accept : styles.reject,
                    ]}
                    onPress={() => {
                      dispatch(toggleScanModal(!scanModal));
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
            visible={closeSessionModal}
            onRequestClose={() => {
              dispatch(toggleCloseSessionModal(!closeSessionModal));
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
                      dispatch(toggleCloseSessionModal(!closeSessionModal));
                      onSessionChangeHandler(status);
                      SessionClose();
                    }}
                  >
                    <Text style={styles.btnTextStyle}>Да, закрыть</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.reject]}
                    onPress={() => {
                      dispatch(toggleCloseSessionModal(!closeSessionModal));
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
    </View>
  );
}

export default Inventory;
