import React, { useState, useEffect } from "react";
import { registerRootComponent } from "expo";

import { StyleSheet, Text, View, Button, ScrollView } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import "react-native-gesture-handler";
import Inside from "./routes/Inventory/Drawer/Inside.js";
import Over from "./routes/Inventory/Drawer/Over.js";
import Inventory from "./routes/Inventory/Inventory.js";
import Log from "./routes/Inventory/Drawer/Log.js";
import NotReg from "./routes/Inventory/Drawer/NotReg.js";
import NotFound from "./routes/Inventory/Drawer/NotFound.js";
import BarCode from "./components/QRScanner/QRScanner.js";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store, persistor } from "./store/index.js";
import Docs from "./routes/Docs/Docs.js";
import { PersistGate } from "redux-persist/integration/react";
import FlashMessage from "react-native-flash-message";
import SignInScreen from "./routes/Auth/SignInScreen.js";
import $api from "./http/index.js";
import SignUpScreen from "./routes/Auth/SignUpScreen.js";

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
};

function App() {
  const [hasPermission, setHasPermission] = useState("null");

  const { username, isSignedIn } = useSelector(({ auth }) => auth);
  console.log("isSignedIn", isSignedIn);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const data = await $api.get(`/inventory`).then(({ data }) => data);
      console.log("basic inventory data", data);
    };
    fetchData();

    const getPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status);
    };
    getPermissions();
  }, []);

  // Check permission & show view
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.containerText}>Получение разрешений...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>Камера недоступна</Text>
        <Button title={"Разрешить"} onPress={() => askForCameraPermission()} />
      </View>
    );
  }

  const Stack = createNativeStackNavigator();

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          {isSignedIn ? (
            // No token found, user isn't signed in
            <>
              <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{
                  headerShown: false,
                  // When logging out, a pop animation feels intuitive
                  // You can remove this if you want the default 'push' animation
                  // animationTypeForReplace: state.isSignout ? "pop" : "push",
                }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{
                  headerShown: false,
                  // When logging out, a pop animation feels intuitive
                  // You can remove this if you want the default 'push' animation
                  // animationTypeForReplace: state.isSignout ? "pop" : "push",
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="HomeTabs"
                component={HomeTabs}
                options={{ headerShown: false }}
              />
              <Stack.Group
                screenOptions={{
                  presentation: "modal",
                  headerShown: false,
                  tabBarVisible: false,
                }}
              >
                <Stack.Screen
                  name="scanner"
                  component={BarCode}
                  options={{
                    tabBarVisible: false,
                  }}
                />
              </Stack.Group>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>

      <FlashMessage position="top" />
    </View>
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
          tabBarLabel: "Инвентаризация",
          tabBarIcon: () => {
            return (
              <MaterialCommunityIcon
                name="format-list-numbered"
                style={styles.icon}
                size={25}
                // style={{ width: 25, height: 25 }}
                color="#999999"
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Docs"
        component={Docs}
        options={{
          headerShown: false,
          tabBarLabel: "Документооборот",
          tabBarIcon: () => {
            return (
              <MaterialCommunityIcon
                name="file-document-outline"
                style={styles.icon}
                size={25}
                // style={{ width: 25, height: 25 }}
                color="#999999"
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

function Drawer() {
  const Drawer = createDrawerNavigator();

  return (
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
  );
}

export default registerRootComponent(AppWrapper);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 5,
    justifyContent: "center",
    textAlign: "center",
  },
  containerText: {
    textAlign: "center",
    width: "100%",
  },
  icon: {
    marginLeft: 3,
    marginRight: -20,
  },
});
