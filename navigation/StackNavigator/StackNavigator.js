import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from "../../screens/LoginScreen/LoginScreen";
import NFCAuthentication from "../../screens/NFCAuthentication/NFCAuthentication";
import DrawerNavigator from "../DrawerNavigator/DrawerNavigator";
import WriteCard from "../../screens/User/WriteCard/WriteCard";

const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="NFCAuthentication" component={NFCAuthentication} options={{ headerShown: false }} />
            <Stack.Screen name="Menu" component={DrawerNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="WriteCard" component={WriteCard} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default StackNavigator;