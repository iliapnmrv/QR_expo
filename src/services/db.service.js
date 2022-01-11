import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as SQLite from "expo-sqlite";
import { showMessage, hideMessage } from "react-native-flash-message";
import { store } from "../store";
import {
  setPrevPosition,
  setRemains,
  setScanData,
  setSredstvo,
} from "../store/actions/inventory/scanDataAction";
const db = SQLite.openDatabase("qr.db");

class DBService {
  async download(url) {
    // Информация для скачивания
    let csvUri = `${FileSystem.documentDirectory}1.csv`; //Место, где находится cкачанный csv файл
    await this.createDB(); //создание бд
    await this.downloadFile(url, csvUri);
  }
  async createDB() {
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
  }
  async downloadFile(uri, fileUri) {
    console.log("downloadFile func");
    if (uri == null) {
      return;
    }
    FileSystem.downloadAsync(uri, fileUri)
      .then(({ uri }) => {
        this.saveFile(uri);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  async saveFile(fileUri) {
    console.log("saveFileFunction");
    let { status } = await MediaLibrary.getPermissionsAsync();
    if (status != "granted") {
      await MediaLibrary.requestPermissionsAsync();
    }
    const asset = await MediaLibrary.createAssetAsync(fileUri);
    await this.getFileData(asset.uri);
    // Обработать если нет разрешения
  }
  async getFileData(uri) {
    console.log("get file data");
    try {
      let read = await FileSystem.readAsStringAsync(uri);
      this.csvToJSON(read);
    } catch (e) {
      console.error(`${e}`);
    }
  }
  //var csv is the CSV file with headers
  async csvToJSON(csv) {
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
    this.insertJSONObj(json); //json объект для вставки в бд
  }

  async insertJSONObj(json) {
    let data = JSON.parse(json);
    showMessage({
      message: `Инвентаризация успешно скачана`,
      description: `В инвентаризации ${data.length} строк`,
      style: { backgroundColor: "#3B71F3" },
    });
    for (let i = 0; i < data.length; i++) {
      let { id, vedPos, name, place, kolvo, placePriority } = data[i];
      this.insert(id, vedPos, name, place, kolvo, placePriority);
    }
  }

  insert(id, vedPos, name, place, kolvo, placePriority) {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO qr (id, vedPos, name, place, kolvo, placePriority) VALUES(?, ?, ?, ?, ?, ?)`,
        [id, vedPos, name, place, kolvo, placePriority],
        (_, result) => {},
        (_, error) => console.log(error)
      );
    });
  }
  sessionClose() {
    store.dispatch(setRemains(null));
    store.dispatch(setSredstvo(null));
    store.dispatch(setPrevPosition(null));
    store.dispatch(setScanData(null));
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
  }
}

export default new DBService();
