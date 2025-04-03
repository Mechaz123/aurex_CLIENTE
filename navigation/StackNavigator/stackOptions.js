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
    DetailsProductPurchase: {
        title: "AUREX"
    },
    VerifyPurchase: {
        headerShown: false,
    },
    DetailsProductExchange: {
        title: "AUREX"
    },
    SelectProductOffer: {
        title: "AUREX"
    },
    DetailsProductOffer: {
        title: "AUREX"
    },
    VerifyExchange: {
        headerShown: false,
    },
    VerifyAuction: {
        headerShown: false,
    }
};