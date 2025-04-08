import { StyleSheet } from "react-native";
import colors from "../../../styles/colors";

export default StyleSheet.create({
    scollView: {
        backgroundColor: colors.background
    },
    container: {
        alignItems: 'center',
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: 'flex-start',
        padding: 20,
        paddingBottom: 10,
    },
    title: {
        color: colors.text_basic,
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    credit: {
        marginTop: 5,
        color: colors.primary,
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    text_info: {
        color: colors.primary_degraded,
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    textInput: {
        backgroundColor: colors.white,
        borderColor: colors.border,
        borderRadius: 5,
        borderWidth: 1,
        height: 40,
        marginBottom: 15,
        marginTop: 10,
        paddingHorizontal: 10,
        width: '100%',
    },
})