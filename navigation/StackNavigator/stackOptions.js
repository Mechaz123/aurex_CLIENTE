import colors from "../../styles/colors";

export const stackScreenOptions = {
    headerStyle: {
        backgroundColor: colors.primary,
    },
    headerTitleStyle: {
        fontWeight: 'bold', 
        fontSize: 20, 
    },
    headerTintColor: colors.white,
    headerTitleAlign: "center",
};

export const screenOptions = {
    Login: {
        headerShown: false,
    },
    NFCAuthentication: {
        headerShown: false,
    },
    Menu: {
        headerShown: false,
    },
    WriteCard: {
        headerShown: false,
    },
    UserRole: {
        title: "AUREX"
    },
    WriteCardUserManagement: {
        headerShown: false,
    },
    ReadCardUserManagement: {
        headerShown: false,
    },
    DepositMoney: {
        title: "AUREX"
    },
    DetailsProduct: {
        title: "AUREX"
    }
};