import * as SQLite from "expo-sqlite";
import { showMessage, hideMessage } from "react-native-flash-message";
import $api from "../http";
import { store } from "../store";
import {
  setPrevPosition,
  setRemains,
  setScanData,
  setSredstvo,
} from "../store/actions/inventory/scanDataAction";
const db = SQLite.openDatabase("inventory.db");

class DBService {
  async download() {
    await this.createDB(); //создание бд
    await this.getInventory();
  }
  async createDB() {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS qr(
                  id            INTEGER  NOT NULL PRIMARY KEY,
                  vedpos        INTEGER  NOT NULL,
                  name          VARCHAR(200) NOT NULL,
                  place         VARCHAR(100) NOT NULL,
                  kolvo         INTEGER  NOT NULL,
                  placepriority INTEGER  NOT NULL
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
  async getInventory() {
    const inventoryData = await $api.get(`/inventory`).then(({ data }) => data);
    for (let i = 0; i < inventoryData.length; i++) {
      let { id, vedpos, name, place, kolvo, placepriority } = inventoryData[i];
      this.insert(id, vedpos, name, place, kolvo, placepriority);
    }
    showMessage({
      message: `Инвентаризация успешно скачана`,
      description: `В инвентаризации ${inventoryData.length} строк`,
      style: { backgroundColor: "#3B71F3" },
    });
  }

  insert(id, vedpos, name, place, kolvo, placepriority) {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO qr (id, vedpos, name, place, kolvo, placepriority) VALUES(?, ?, ?, ?, ?, ?)`,
        [id, vedpos, name, place, kolvo, placepriority],
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
        (_, result) => {},
        (_, error) => console.log(`Error code 2: ${error}`)
      );
    });
    db.transaction((tx) => {
      tx.executeSql(
        `DROP TABLE IF EXISTS scanned;`,
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
  }
}

export default new DBService();
