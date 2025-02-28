import colors from "../../styles/colors";

export const drawerScreenOptions = {
    drawerStyle: {
        backgroundColor: colors.primary,
    },
    drawerLabelStyle: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.text_menu,
    },
    drawerActiveTintColor: colors.menu_active_option,
    drawerInactiveTintColor: colors.menu_inactive_option,
    headerStyle: {
        backgroundColor: colors.primary,
    },
    headerTintColor: colors.white,
    headerTitleAlign: "center",
};

export const screenOptions = {
    Home: {
        title:"AUREX",
        drawerLabel: "🏠 Inicio",
    },
    Purchase: {
        title: "AUREX",
        drawerLabel: "🛒 Comprar"
    },
    Sell: {
        title: "AUREX",
        drawerLabel: "💰 Productos en Venta"
    },
    ExchangeProducts: {
        title: "AUREX",
        drawerLabel: "↔️ Productos para intercambio" 
    },
    AuctionProducts: {
        title: "AUREX",
        drawerLabel: "💲Productos para subastar" 
    },
    RegisterCategory: {
        title: "AUREX",
        drawerLabel: "✏️ Registrar Categoria"
    },
    ViewCategories: {
        title: "AUREX",
        drawerLabel: "🔍 Ver Categorias"
    },
    RegisterRole: {
        title: "AUREX",
        drawerLabel: "✏️ Registrar Rol"
    },
    ViewRoles: {
        title: "AUREX",
        drawerLabel: "🔍 Ver Roles"
    },
    RolePermission: {
        title: "AUREX",
        drawerLabel: "👮🏻 Gestionar permisos"
    },
    RegisterProducts: {
        title: "AUREX",
        drawerLabel: "✏️ Registrar Productos" 
    },
    RegisterUser: {
        title: "AUREX",
        drawerLabel: "👤 Registrar Usuarios"
    },
    Logout: {
        drawerLabel: "🚪 Salir",
    },
}