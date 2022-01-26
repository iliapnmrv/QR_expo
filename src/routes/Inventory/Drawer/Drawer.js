import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import Inside from "./Inside";
import Over from "./Over";
import Inventory from "../Inventory";
import Log from "./Log";
import NotReg from "./NotReg";
import NotFound from "./NotFound";
import Settings from "../../Settings/Settings";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import authService from "../../../services/auth.service";

function CustomDrawerContent(props) {
  return (
    <SafeAreaView
      style={{ flex: 1 }}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View>
        <DrawerItem
          label={"Выйти из аккаунта"}
          style={styles.logoutDrawerItem}
          onPress={() => authService.logout()}
          icon={() => (
            <MaterialCommunityIcon
              name="logout"
              style={styles.icon}
              size={25}
              color="#909090"
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

export default function Drawer() {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Group
        screenOptions={{
          headerShown: false,
        }}
      >
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
        <Drawer.Screen
          name="Настройки"
          component={Settings}
          options={{
            drawerIcon: () => (
              <Ionicons
                name="settings-outline"
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

const styles = StyleSheet.create({
  icon: {
    marginLeft: 3,
    marginRight: -20,
  },
});
