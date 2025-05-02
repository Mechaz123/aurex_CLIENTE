import { StyleSheet } from "react-native";
import colors from "../../../styles/colors";

export default StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: 'flex-start',
        padding: 20,
    },
    title: {
        color: colors.text_basic,
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
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
    buttonPicker: {
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
    },
    selectContainer: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    textSelectContainer: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },
})