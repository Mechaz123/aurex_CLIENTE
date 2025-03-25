import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from "../../screens/LoginScreen/LoginScreen";
import NFCAuthentication from "../../screens/NFCAuthentication/NFCAuthentication";
import DrawerNavigator from "../DrawerNavigator/DrawerNavigator";
import WriteCard from "../../screens/User/WriteCard/WriteCard";
import UserRole from "../../screens/UserRole/UserRole";
import { screenOptions, stackScreenOptions } from "./stackOptions";
import WriteCardUserManagement from "../../screens/User/UserManagement/WriteCardUserManagement/WriteCardUserManagement";
import ReadCardUserManagement from "../../screens/User/UserManagement/ReadCardUserManagement/ReadCardUserManagement";
import DepositMoney from "../../screens/DepositMoney/DepositMoney";
import VerifyPurchase from "../../screens/Products/PurchaseProducts/VerifyPurchase/VerifyPurchase";
import DetailsProductPurchase from "../../screens/Products/PurchaseProducts/DetailsProductPurchase/DetailsProductPurchase";
import DetailsProductExchange from "../../screens/Exchange/DetailsProductExchange/DetailsProductExchange";

const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={stackScreenOptions}>
            <Stack.Screen name="Login" component={LoginScreen} options={screenOptions.Login} />
            <Stack.Screen name="NFCAuthentication" component={NFCAuthentication} options={screenOptions.NFCAuthentication} />
            <Stack.Screen name="Menu" component={DrawerNavigator} options={screenOptions.Menu} />
            <Stack.Screen name="WriteCard" component={WriteCard} options={screenOptions.WriteCard} />
            <Stack.Screen name="UserRole" component={UserRole} options={screenOptions.UserRole} />
            <Stack.Screen name="WriteCardUserManagement" component={WriteCardUserManagement} options={screenOptions.WriteCardUserManagement} />
            <Stack.Screen name="ReadCardUserManagement" component={ReadCardUserManagement} options={screenOptions.ReadCardUserManagement} />
            <Stack.Screen name="DepositMoney" component={DepositMoney} options={screenOptions.DepositMoney} />
            <Stack.Screen name="DetailsProductPurchase" component={DetailsProductPurchase} options={screenOptions.DetailsProductPurchase} />
            <Stack.Screen name="VerifyPurchase" component={VerifyPurchase} options={screenOptions.VerifyPurchase} />
            <Stack.Screen name="DetailsProductExchange" component={DetailsProductExchange} options={screenOptions.DetailsProductExchange} />
        </Stack.Navigator>
    );
}

export default StackNavigator;