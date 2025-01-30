import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import NFCAuthentication from "../screens/NFCAuthentication/NFCAuthentication";
import HomeScreen from "../screens/Home/HomeScreen";

const Stack = createStackNavigator();

const StackNavigator = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false }}/>
            <Stack.Screen name="NFCAuthentication" component={NFCAuthentication} options={{headerShown: false}}/>
            <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
    );
}

export default StackNavigator;