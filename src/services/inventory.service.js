import { store } from "../store";
import * as SQLite from "expo-sqlite";
import {
  setScanResult,
  setScanStatus,
} from "../store/actions/scanResultAction";
import { setPrevPosition, setRemains } from "../store/actions/scanDataAction";
const db = SQLite.openDatabase("qr.db");

export const analyze = async (data) => {
  // анализирование, если такой предмет есть в инвентаризации
  const [invNom, name = "", model, serNom, trace = ""] = data.split("\n");

  let status, pos;
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM `qr` WHERE `name` = ? AND `kolvo` > 0 ORDER BY `placePriority`, `kolvo`",
      [name],
      (_, result) => {
        let check = checkDoubleScan(invNom);
        check.then((response) => {
          if (response) {
            // если позиция еще не сканировалась
            let row = getScannedItemRow(invNom);
            row.then((position) => {
              if (Array.isArray(position)) {
                store.dispatch(
                  setScanResult(
                    `Инвентарный номер ${invNom} уже сканировался, позиция: ${position[0]}, ${position[1]}`
                  )
                );
              } else {
                store.dispatch(
                  setScanResult(
                    `Инвентарный номер ${invNom} уже сканировался, ${position}`
                  )
                );
              }
              store.dispatch(setScanStatus(`Повторное считывание`));
            });
          } else {
            let row = result.rows.item(0);
            if (!result.rows.length) {
              // если не нашлось таких записей
              db.transaction((tx) => {
                tx.executeSql(
                  "SELECT * FROM qr WHERE name = ?",
                  [name],
                  (_, result) => {
                    if (!result.rows.length) {
                      // если не нашлись записи
                      status = 2; // не в учете
                      store.dispatch(setScanStatus("Позиция не в учете"));
                      pos = "Не в учете";
                    } else {
                      status = 3; // сверх учета
                      store.dispatch(setScanStatus("Позиция сверх учета"));
                      pos = "Сверх учета";
                    }
                    let place = null;
                    store.dispatch(setScanResult(""));
                    addScanToDB(
                      invNom,
                      name,
                      status,
                      model,
                      serNom,
                      pos,
                      place,
                      trace
                    );
                    store.dispatch(
                      setPrevPosition(`Номер QR кода ${num}, статус: ${pos}`)
                    );
                    store.dispatch(setRemains(""));
                  },
                  (_, error) => console.log(`Error code 5: ${error}`)
                );
              });
            } else {
              status = 1; // в учете
              store.dispatch(setScanStatus("В учете"));
              store.dispatch(
                setScanResult(`Позиция: ${row.vedPos}\nМесто: ${row.place}`)
              );
              addScanToDB(
                invNom,
                name,
                status,
                model,
                serNom,
                row.vedPos,
                row.place,
                trace
              );
              subtractItem(row.id, name);
            }
            let num = invNom.substr(invNom.length - 5); // номер qr кодa
            if (row?.vedPos) {
              store.dispatch(
                setPrevPosition(
                  `Номер QR кода ${num}, позиция: ${row.vedPos}, место: ${
                    row.place == undefined ? null : row.place
                  }`
                )
              );
            }
          }
          setScanModalVisible(true); // модальное окно с результатом проверки
        });
      },
      (_, error) => console.log(error)
    );
  });
};

// Проверка на дубликат сканирования - промис
function checkDoubleScan(invNom) {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM scanned WHERE invNom = ?",
        [invNom],
        (_, result) => {
          if (result.rows.length) {
            // если результат = 1, то уже сканировался
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (_, error) => console.log(`Error code 10: ${error}`)
      );
    });
  });
}

// Получает строку отсканированного предмета
const getScannedItemRow = (invNom) => {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM `scanned` WHERE invNom = ?",
        [invNom],
        (_, result) => {
          let { status, pos } = result.rows.item(0);
          if (status == 2) {
            resolve(pos);
          } else if (status == 3) {
            resolve(pos);
          } else {
            resolve([pos, place]); // если статус 1
          }
        },
        (_, error) => console.log(error)
      );
    });
  });
};

const addScanToDB = (
  invNom,
  name,
  status,
  model,
  serNom,
  pos,
  place,
  trace
) => {
  console.log(invNom, name, status, model, serNom, pos, place, trace);
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO scanned (invNom, name, status, model, serNom, pos, place, trace) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
      [invNom, name, status, model, serNom, pos, place, trace],
      (_, result) => {
        console.log("Успешно добавлено в бд сканов");
      },
      (_, error) => console.log(`Error code 3: ${error}`)
    );
  });
};

// вычитание позиции из строки
const subtractItem = (id, name) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE qr SET kolvo = kolvo - 1 WHERE `id` = ?",
      [id],
      (_, result) => {},
      (_, error) => console.log(`Error code 4: ${error}`)
    );
  });
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM qr WHERE `id` = ?",
      [id],
      (_, result) => {
        let row = result.rows.item(0);
        if (!row.kolvo) {
          //если не остается остатка
          store.dispatch(setRemains(`Позиция закрыта`));
        } else {
          let left = row.kolvo; // оставшееся количество предметов
          let pos = row.vedPos; // строка в ведомости
          db.transaction((tx) => {
            tx.executeSql(
              "SELECT * FROM scanned WHERE `name` = ? AND `pos` = ?",
              [name, pos],
              (_, result) => {
                let scanned = result.rows.length;
                store.dispatch(
                  setRemains(`${scanned}/${left + scanned}, строка: ${pos} `)
                );
              },
              (_, error) => console.log(error)
            );
          });
        }
      },
      (_, error) => console.log(error)
    );
  });
};
