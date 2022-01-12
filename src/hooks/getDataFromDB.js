import { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";

export const getDataFromDB = (sql) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const db = SQLite.openDatabase("qr.db");

  const getData = async () => {
    setIsLoading(true);
    try {
      db.transaction((tx) => {
        tx.executeSql(
          sql,
          [],
          (_, result) => {
            if (result.rows.length) {
              let res = result.rows._array;
              setResponse(res);
            }
            setIsLoading(false);
          },
          (_, error) => console.log(error)
        );
      });
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return { response, error, isLoading, getData };
};
