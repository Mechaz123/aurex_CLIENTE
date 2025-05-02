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
    container_table: {
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        alignItems: 'flex-start',
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: 'flex-start',
    },
    table: {
        alignItems: 'flex-start',
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
    table_row: {
        borderTopWidth: 2,
        borderColor: colors.text_basic,
        borderRadius: 2,
    },
    table_header: {
        textAlign: 'center',
        color: colors.white,
        backgroundColor: colors.primary,
        fontSize: 10,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.text_basic,
        width: 80,
        height: 30,
    },
    table_text: {
        textAlign: 'center',
        color: colors.text_basic,
        fontSize: 10,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.text_basic,
        width: 80,
        height: 90,
    },
    table_actions: {
        flexDirection: 'row',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.text_basic,
        width: 80,
        height: 90,
    },
    table_button: {
        marginRight: 3,
    },
    button_text: {
        textAlign: 'center',
        fontSize: 30,
    }
})