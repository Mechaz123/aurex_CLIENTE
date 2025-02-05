import { createDrawerNavigator } from "@react-navigation/drawer"
import HomeScreen from "../../screens/Home/HomeScreen";
import { drawerScreenOptions, screenOptions } from "./drawerOptions";
import PurchaseProducts from "../../screens/PurchaseProducts/PurchaseProducts";
import SellProducts from "../../screens/SellProducts/SellProducts";
import { useEffect, useState } from "react";
import { AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import Utils from "../../services/Utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        getMenuOptions();
    }, []);

    const getMenuOptions = async () => {
        const ID = await AsyncStorage.getItem('userId');
        const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `user/${ID}/menu_options`);
        setOptions(response.Data);
    }

    return (
        <Drawer.Navigator screenOptions={drawerScreenOptions}>
            <Drawer.Screen name="Home" component={HomeScreen} options={screenOptions.Home} />
            {options.includes("Purchase") && (
                <Drawer.Screen name="Purchase" component={PurchaseProducts} options={screenOptions.Purchase} />
            )}
            {options.includes("Sell") && (
                <Drawer.Screen name="Sell" component={SellProducts} options={screenOptions.Sell} />
            )}
        </Drawer.Navigator>
    )
}

export default DrawerNavigator;