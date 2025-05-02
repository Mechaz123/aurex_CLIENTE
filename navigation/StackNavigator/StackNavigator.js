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
import SelectProductOffer from "../../screens/Exchange/SelectProductOffer/SelectProductOffer";
import DetailsProductOffer from "../../screens/Exchange/DetailsProductOffer/DetailsProductOffer";
import VerifyExchange from "../../screens/Exchange/VerifyExchange/VerifyExchange";
import VerifyAuction from "../../screens/Auction/VerifyAuction/VerifyAuction";
import Bid from "../../screens/Auction/Bid/Bid";
import VerifyBid from "../../screens/Auction/VerifyBid/VerifyBid";

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
            <Stack.Screen name="SelectProductOffer" component={SelectProductOffer} options={screenOptions.SelectProductOffer} />
            <Stack.Screen name="DetailsProductOffer" component={DetailsProductOffer} options={screenOptions.DetailsProductOffer} />
            <Stack.Screen name="VerifyExchange" component={VerifyExchange} options={screenOptions.VerifyExchange} />
            <Stack.Screen name="VerifyAuction" component={VerifyAuction} options={screenOptions.VerifyAuction} />
            <Stack.Screen name="Bid" component={Bid} options={screenOptions.Bid} />
            <Stack.Screen name="VerifyBid" component={VerifyBid} options={screenOptions.VerifyBid} />
        </Stack.Navigator>
    );
}

export default StackNavigator;