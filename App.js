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
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import 'react-native-gesture-handler';
import Inside from './Components/Inventory/Drawer/Inside';
import Over from './Components/Inventory/Drawer/Over'
import Inventory from './Components/Inventory/Inventory';
import Log from './Components/Inventory/Drawer/Log';
import NotReg from './Components/Inventory/Drawer/NotReg';
import NotFound from './Components/Inventory/Drawer/NotFound';
import BarCode from './Components/BarCode/BarCode';
import { Provider } from 'react-redux';
import { store } from './src/store';
import Docs from './Components/Docs/Docs';


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

  const Stack = createNativeStackNavigator();


  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="HomeTabs"
            component={HomeTabs}
            options={{ headerShown: false, }}
          />
          <Stack.Group screenOptions={{ presentation: 'modal', headerShown: false,  tabBarVisible: false }}>
            <Stack.Screen 
              name="scanner" 
              component={BarCode} 
              options={{
                tabBarVisible: false,
              }}
            />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

function HomeTabs() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
    screenOptions={{
      tabBarLabelStyle: {
        fontSize: 12,
        margin: 0,
      },
    }}
  >
    <Tab.Screen 
      name="Inventory" 
      component={Drawer} 
      options={{ 
        headerShown: false,
        tabBarLabel: 'Инвентаризация',
        tabBarIcon: () => {
          return(
            <MaterialCommunityIcon 
                name="format-list-numbered" 
                style={styles.icon}
                size={25} 
                style={{ width: 25, height: 25}}
                color="#999999" 
            />
          )
        },
      }}
    />
    <Tab.Screen 
      name="Docs" 
      component={Docs} 
      options={{ 
        headerShown: false,
        tabBarLabel: 'Документооборот',
        tabBarIcon: () => {
          return(
            <MaterialCommunityIcon 
                name="file-document-outline" 
                style={styles.icon}
                size={25} 
                style={{ width: 25, height: 25}}
                color="#999999" 
            />
          )
        },
      }}
    />
  </Tab.Navigator>
  )
}

function Drawer() {
  const Drawer = createDrawerNavigator();

  return(
    <Drawer.Navigator>
      <Drawer.Group>
        <Drawer.Screen 
          name="Инвентаризация" 
          component={Inventory} 
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
          name="Журнал" 
          component={Log}
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
                name="playlist-remove" 
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