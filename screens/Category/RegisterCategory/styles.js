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
        marginTop:20,
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
        marginTop:20,
        paddingHorizontal: 10,
        textAlignVertical: 'top',
        width: '100%',
        height: '20%',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        marginTop: 5,
        marginBottom: 30,
    },
    text: {
        color: colors.text_basic,
        fontSize: 18,
        fontWeight: 'bold',
    },
    picker: {
        width: '80%',
        color: colors.text_basic,
        borderWidth: 2,
        borderRadius: 5, 
        borderColor: colors.border,
        overflow: "hidden",
        backgroundColor: colors.white,
        marginBottom: 60,
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
        marginTop: 15,
        marginBottom: 20,
    }
})