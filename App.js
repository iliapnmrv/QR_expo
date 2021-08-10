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
  Alert,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";


export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Nothing Scanned! :(')
  const [forceUpdate, forceUpdateId] = useForceUpdate();


  const Alert = () =>
    Alert.alert(
      "Заголовок",
      text,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );


    // Функция загрузки базы данных в папки assets
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

  // Подключение к бд
  db = SQLite.openDatabase('qr.db');

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
      </View>)
  }

   //Main View

    // добавление в бд
 
    const select = () => {
      console.log("Selecting...")
      db.transaction(
        tx => {
          tx.executeSql('select * from qr', [], (trans, result) => {
            console.log(".......................................................");
            console.log(result)
        });
        }
      );
    }
  const add = (arr) => {
    let kod = arr[0]
    let kolvo = arr[1]
    console.log("Adding...")
    db.transaction(
      tx => {
        tx.executeSql('INSERT INTO qr (kod, kolvo) VALUES(?, ?)', [kod, kolvo], (trans, result) => {
          console.log(".......................................................");
          console.log(result)
      });
      }
    );
  };
     // Scanned bar code 
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data)
    console.log('Type: ' + type)
    console.log("Успешно отсканировано")
    let arr = data.split("\n") //массив разделенный по новой строке

    add(arr)
    select()
  };

   return (
    <View style={styles.container}>
      <Text style={styles.baseText}>QR - BARCODE SCANNER!</Text>
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
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }} />
      </View>
        <ScrollView>
          <Text style={styles.maintext}>{text}</Text>
        </ScrollView>
      {scanned && <Button title={'SCAN THIS!'} onPress={() => setScanned(false)} color='lightblue' />}
    </View>
  );
}
function useForceUpdate() {
 const [value, setValue] = useState(0);
 return [() => setValue(value + 1), value];
}

//Styles 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  maintext: {
    fontSize: 22,
    margin: 30,
  },

  baseText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "darkblue",
  },

  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 350,
    width: 350,
    overflow: 'hidden',
    borderRadius: 50,
    backgroundColor: 'lightblue'
  },
});