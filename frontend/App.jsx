import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { wrapScreen } from './utils/wrapScreen';
import Sidebar from './components/Sidebar';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import DailyViewScreen from './screens/DailyViewScreen';
import SolicitationScreen from './screens/SolicitationScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Login"
        drawerContent={(props) => <Sidebar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen name="Login" component={wrapScreen(LoginScreen)} />
        <Drawer.Screen name="Register" component={wrapScreen(RegisterScreen)} />
        <Drawer.Screen name="Home" component={wrapScreen(HomeScreen)} />
        <Drawer.Screen name="Calendar" component={wrapScreen(CalendarScreen)} />
        <Drawer.Screen name="DailyView" component={wrapScreen(DailyViewScreen)} />
        <Drawer.Screen name="Solicitations" component={wrapScreen(SolicitationScreen)} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
