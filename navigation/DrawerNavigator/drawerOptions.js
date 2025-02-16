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
        drawerLabel: "🏠 Home",
    },
    Purchase: {
        title: "AUREX",
        drawerLabel: "🛒 Purchase"
    },
    Sell: {
        title: "AUREX",
        drawerLabel: "💰 Sell"
    },
    RegisterCategory: {
        title: "AUREX",
        drawerLabel: "✏️ Register Category"
    },
    ViewCategories: {
        title: "AUREX",
        drawerLabel: "🔍 View Categories"
    },
    RegisterRole: {
        title: "AUREX",
        drawerLabel: "✏️ Register Role"
    },
    ViewRoles: {
        title: "AUREX",
        drawerLabel: "🔍 View Roles"
    },
    RolePermission: {
        title: "AUREX",
        drawerLabel: "👮🏻 Manage Role Permissions"
    },
    RegisterProducts: {
        title: "AUREX",
        drawerLabel: "✏️ Register Products" 
    },
    Logout: {
        drawerLabel: "🚪 Logout",
    },
}