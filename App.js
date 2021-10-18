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
import { createStackNavigator } from '@react-navigation/stack';

import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import 'react-native-gesture-handler';
import Inside from './components/statuses/Inside';
import Over from './components/statuses/Over'
import HomeScreen from './components/home/HomeScreen';
import NotReg from './components/statuses/NotReg';
import NotFound from './components/statuses/NotFound';
import BarCode from './components/home/BarCode/BarCode';

import * as Updates from 'expo-updates';


function App() {

 
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

  const RootStack = createStackNavigator();

  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Root"
          component={Root}
          options={{ headerShown: false }}
        />
        <RootStack.Group screenOptions={{ presentation: 'modal', headerShown: false }}>
          <RootStack.Screen name="scanner" component={BarCode} />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

function Root() {
  const Drawer = createDrawerNavigator();

  return(
    <Drawer.Navigator>
      <Drawer.Group>
        <Drawer.Screen 
          name="Главная" 
          component={HomeScreen} 
          options={{
            drawerIcon: () => (
              <MaterialCommunityIcon 
                name="home" 
                style={styles.icon}
                size={25} 
                color="#909090" 
              />
            ),
          }}
        />
        <Drawer.Screen 
          name="В учете" 
          component={Inside}
          options={{
            drawerIcon: () => (
              <MaterialCommunityIcon 
                name="playlist-check" 
                style={styles.icon}
                size={25} 
                color="#909090" 
              />
            ),
          }}
        />
        <Drawer.Screen 
          name="Не в учете" 
          component={NotReg}
          options={{
            drawerIcon: () => (
              <MaterialCommunityIcon 
                name="playlist-minus" 
                style={styles.icon}
                size={25} 
                color="#909090" 
              />
            ),
          }}
        />
        <Drawer.Screen 
          name="Сверх учета"
          component={Over} 
          options={{
            drawerIcon: () => (
              <MaterialCommunityIcon 
                name="playlist-plus" 
                style={styles.icon}
                size={25} 
                color="#909090" 
              />
            ),
          }}
        />
        <Drawer.Screen 
          name="Не выявлено" 
          component={NotFound} 
          options={{
            drawerIcon: () => (
              <MaterialCommunityIcon 
                name="format-list-numbered" 
                style={styles.icon}
                size={25} 
                color="#909090" 
              />
            ),
          }}
        />
      </Drawer.Group>
    </Drawer.Navigator>
  )
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
  icon: {
    marginLeft: 3, 
    marginRight: -20
  },
})