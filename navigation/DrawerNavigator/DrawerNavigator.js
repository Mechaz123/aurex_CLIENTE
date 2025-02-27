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
import Authentication from "../../services/Authentication";
import ExchangeProducts from "../../screens/Products/ExchangeProducts/ExchangeProducts";
import AuctionProducts from "../../screens/Products/AuctionProducts/AuctionProducts";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    const [opciones, setOpciones] = useState([]);

    useEffect(() => {
        getMenuOpciones();
    }, []);

    const getMenuOpciones = async () => {
        if (await Authentication.verificarTokenGuardado()) {
            const ID = await AsyncStorage.getItem('usuarioId');
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `usuario/${ID}/menu_opciones`);
            setOpciones(response.Data);
        } else {
            Alert.alert("ERROR ❌", "Su sesión ha caducado, por favor ingrese de nuevo a la aplicación.");
            navigation.replace("Login");
        }
    }

    const Salir = async (navigation) => {
        await AsyncStorage.removeItem('autenticacionToken');
        await AsyncStorage.removeItem('usuarioId');
        navigation.replace("Login");
    }

    return (
        <Drawer.Navigator screenOptions={drawerScreenOptions}>
            <Drawer.Screen name="Home" component={HomeScreen} options={screenOptions.Home} />
            {opciones.includes("Purchase") && (
                <Drawer.Screen name="Purchase" component={PurchaseProducts} options={screenOptions.Purchase} />
            )}
            {opciones.includes("Sell") && (
                <Drawer.Screen name="Sell" component={SellProducts} options={screenOptions.Sell} />
            )}
            {opciones.includes("ExchangeProducts") && (
                <Drawer.Screen name="ExchangeProducts" component={ExchangeProducts} options={screenOptions.ExchangeProducts} />
            )}
            {opciones.includes("AuctionProducts") && (
                <Drawer.Screen name="AuctionProducts" component={AuctionProducts} options={screenOptions.AuctionProducts} />
            )}
            {opciones.includes("RegisterCategory") && (
                <Drawer.Screen name="RegisterCategory" component={RegisterCategory} options={screenOptions.RegisterCategory} />
            )}
            {opciones.includes("ViewCategories") && (
                <Drawer.Screen name="ViewCategories" component={ViewCategories} options={screenOptions.ViewCategories} />
            )}
            {opciones.includes("RegisterRole") && (
                <Drawer.Screen name="RegisterRole" component={RegisterRole} options={screenOptions.RegisterRole} />
            )}
            {opciones.includes("ViewRoles") && (
                <Drawer.Screen name="ViewRoles" component={ViewRoles} options={screenOptions.ViewRoles} />
            )}
            {opciones.includes("RolePermission") && (
                <Drawer.Screen name="RolePermission" component={RolePermission} options={screenOptions.RolePermission} />
            )}
            {opciones.includes("RegisterProducts") && (
                <Drawer.Screen name="RegisterProducts" component={RegisterProducts} options={screenOptions.RegisterProducts} />
            )}
            <Drawer.Screen name="Logout" component={() => null} options={screenOptions.Logout} listeners={({ navigation }) => ({
                focus: () => Salir(navigation),
            })} />
        </Drawer.Navigator>
    )
}

export default DrawerNavigator;