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
        marginTop: 20,
        paddingHorizontal: 10,
        width: '100%',
    },
    textArea: {
        backgroundColor: colors.white,
        borderColor: colors.border,
        borderRadius: 5,
        borderWidth: 1,
        height: 40,
        marginBottom: 15,
        marginTop: 20,
        paddingHorizontal: 10,
        textAlignVertical: 'top',
        width: '100%',
        height: '60%',
    },
})