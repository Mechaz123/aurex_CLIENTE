import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from "../../screens/LoginScreen/LoginScreen";
import NFCAuthentication from "../../screens/NFCAuthentication/NFCAuthentication";
import DrawerNavigator from "../DrawerNavigator/DrawerNavigator";
import WriteCard from "../../screens/User/WriteCard/WriteCard";
import UserRole from "../../screens/UserRole/UserRole";
import { screenOptions, stackScreenOptions } from "./stackOptions";

const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={stackScreenOptions}>
            <Stack.Screen name="Login" component={LoginScreen} options={screenOptions.Login} />
            <Stack.Screen name="NFCAuthentication" component={NFCAuthentication} options={screenOptions.NFCAuthentication} />
            <Stack.Screen name="Menu" component={DrawerNavigator} options={screenOptions.Menu} />
            <Stack.Screen name="WriteCard" component={WriteCard} options={screenOptions.WriteCard} />
            <Stack.Screen name="UserRole" component={UserRole} options={screenOptions.UserRole} />
        </Stack.Navigator>
    );
}

export default StackNavigator;