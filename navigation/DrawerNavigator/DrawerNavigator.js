import { createDrawerNavigator } from "@react-navigation/drawer"
import HomeScreen from "../../screens/Home/HomeScreen";
import { drawerScreenOptions, screenOptions } from "./drawerOptions";
import PurchaseProducts from "../../screens/Products/PurchaseProducts/PurchaseProducts";
import SellProducts from "../../screens/Products/SellProducts/SellProducts";
import { useEffect, useState } from "react";
import { AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import Utils from "../../services/Utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RegisterCategory from "../../screens/Category/RegisterCategory/RegisterCategory";
import ViewCategories from "../../screens/Category/ViewCategories/ViewCategories";
import RegisterRole from "../../screens/Role/RegisterRole/RegisterRole";
import ViewRoles from "../../screens/Role/ViewRoles/ViewRoles";
import RolePermission from "../../screens/RolePermission/RolePermission";
import RegisterProducts from "../../screens/Products/RegisterProducts/RegisterProducts";

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

    const handleLogout = async (navigation) => {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userId');
        navigation.replace("Login");
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
            {options.includes("RegisterCategory") && (
                <Drawer.Screen name="RegisterCategory" component={RegisterCategory} options={screenOptions.RegisterCategory} />
            )}
            {options.includes("ViewCategories") && (
                <Drawer.Screen name="ViewCategories" component={ViewCategories} options={screenOptions.ViewCategories} />
            )}
            {options.includes("RegisterRole") && (
                <Drawer.Screen name="RegisterRole" component={RegisterRole} options={screenOptions.RegisterRole} />
            )}
            {options.includes("ViewRoles") && (
                <Drawer.Screen name="ViewRoles" component={ViewRoles} options={screenOptions.ViewRoles} />
            )}
            {options.includes("RolePermission") && (
                <Drawer.Screen name="RolePermission" component={RolePermission} options={screenOptions.RolePermission} />
            )}
            {options.includes("RegisterProducts") && (
                <Drawer.Screen name="RegisterProducts" component={RegisterProducts} options={screenOptions.RegisterProducts} />
            )}
            <Drawer.Screen name="Logout" component={() => null} options={screenOptions.Logout} listeners={({navigation}) => ({
                focus: () => handleLogout(navigation),      
            })}/>
        </Drawer.Navigator>
    )
}

export default DrawerNavigator;