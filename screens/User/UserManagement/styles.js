import { StyleSheet } from "react-native";
import colors from "../../../styles/colors";

export default StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: 'flex-start',
    },
    container_title: {
        alignItems: 'center',
        backgroundColor: colors.background,
        justifyContent: 'center',
        width: '100%',
        marginTop: 20,
        marginBottom: 20,
    },
    title: {
        color: colors.text_basic,
        fontSize: 25,
        fontWeight: 'bold',
    },
    container_search: {
        alignItems: 'center',
        backgroundColor: colors.background,
        justifyContent: 'center',
        width: '100%',
        marginTop: 10,
        marginBottom: 20,
    },
    textInput: {
        backgroundColor: colors.white,
        borderColor: colors.border,
        borderRadius: 5,
        borderWidth: 1,
        height: 40,
        marginBottom: 15,
        marginTop: 20,
        paddingHorizontal: 10,
        width: '80%',
        color: colors.text_basic,
    },
    container_table: {
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        alignItems: 'flex-start',
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: 'flex-start',
    }
})