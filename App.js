import React, { useState, useEffect } from 'react';
import { 
  StyleSheet,
  Text, 
  View, 
  Button, 
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import Inside from './components/statuses/inside';
import Over from './components/statuses/over'
import HomeScreen from './components/home/homeScreen';
import NotReg from './components/statuses/notReg';
import NotFound from './components/statuses/notFound';

function App() {
  const Drawer = createDrawerNavigator();
 
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
        <Text style={styles.containerText}>Получение разрешений...</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>Камера недоступна</Text>
        <Button title={'Разрешить'} onPress={() => askForCameraPermission()} />
      </View>
      )
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Главная">
        <Drawer.Screen name="Главная" component={HomeScreen} />
        <Drawer.Screen name="В учете" component={Inside} />
        <Drawer.Screen name="Не в учете" component={NotReg} />
        <Drawer.Screen name="Сверх учета" component={Over} />
        <Drawer.Screen name="Не выявлено" component={NotFound} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
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
})
