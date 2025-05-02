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
import RegisterUser from "../../screens/User/RegisterUser/RegisterUser";
import DonationProducts from "../../screens/Products/DonationProducts/DonationProducts";
import UserManagement from "../../screens/User/UserManagement/UserManagement";
import Order from "../../screens/Order/Order";
import PurchaseHistory from "../../screens/PurchaseHistory/PurchaseHistory";
import { Alert } from "react-native";
import Exchange from "../../screens/Exchange/Exchange";
import ExchangeHistory from "../../screens/ExchangeHistory/ExchangeHistory";
import RegisterAuction from "../../screens/Auction/RegisterAuction/RegisterAuction";
import ParticipateAuction from "../../screens/Auction/ParticipateAuction/ParticipateAuction";
import ViewAuctions from "../../screens/Auction/ViewAuctions/ViewAuctions";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    const [opciones, setOpciones] = useState([]);

    useEffect(() => {
        getMenuOpciones();
        return(() => {
            setOpciones([]);
        })
    }, []);

    const getMenuOpciones = async () => {
        
        if (await Authentication.verificarTokenGuardado()) {
            const ID = await AsyncStorage.getItem('usuarioId');
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `usuario/${ID}/menu_opciones`);
            if (response.Success) {
                setOpciones(response.Data);
            } else {
                Alert.alert("ERROR ❌", "Ocurrió un error al intentar consultar las opciones del menú, por favor ingrese de uno a la aplicación.");   
            }
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
            {opciones.includes("PurchaseHistory") && (
                <Drawer.Screen name="PurchaseHistory" component={PurchaseHistory} options={screenOptions.PurchaseHistory} />
            )}
            {opciones.includes("ParticipateAuction") && (
                <Drawer.Screen name="ParticipateAuction" component={ParticipateAuction} options={screenOptions.ParticipateAuction} />
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
            {opciones.includes("DonationProducts") && (
                <Drawer.Screen name="DonationProducts" component={DonationProducts} options={screenOptions.DonationProducts} />
            )}
            {opciones.includes("RegisterProducts") && (
                <Drawer.Screen name="RegisterProducts" component={RegisterProducts} options={screenOptions.RegisterProducts} />
            )}
            {opciones.includes("Order") && (
                <Drawer.Screen name="Order" component={Order} options={screenOptions.Order} />
            )}
            {opciones.includes("Exchange") && (
                <Drawer.Screen name="Exchange" component={Exchange} options={screenOptions.Exchange} />
            )}
            {opciones.includes("ExchangeHistory") && (
                <Drawer.Screen name="ExchangeHistory" component={ExchangeHistory} options={screenOptions.ExchangeHistory} />
            )}
            {opciones.includes("RegisterAuction") && (
                <Drawer.Screen name="RegisterAuction" component={RegisterAuction} options={screenOptions.RegisterAuction} />
            )}
            {opciones.includes("ViewAuctions") && (
                <Drawer.Screen name="ViewAuctions" component={ViewAuctions} options={screenOptions.ViewAuctions} />
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
            {opciones.includes("RegisterUsers") && (
                <Drawer.Screen name="RegisterUsers" component={RegisterUser} options={screenOptions.RegisterUser} />
            )}
            {opciones.includes("UserManagement") && (
                <Drawer.Screen name="UserManagement" component={UserManagement} options={screenOptions.UserManagement} />
            )}
            <Drawer.Screen name="Logout" component={() => null} options={screenOptions.Logout} listeners={({ navigation }) => ({
                focus: () => Salir(navigation),
            })} />
        </Drawer.Navigator>
    )
}

export default DrawerNavigator;