import { StyleSheet } from "react-native";
import colors from "../../../styles/colors";

export default StyleSheet.create({
    ScrollView: {
        backgroundColor: colors.background,
    },
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
    imageContainer: {
        alignItems: 'center',
        width: '100%',
        backgroundColor: colors.background,
        marginTop: 15,
        marginBottom: 40,
        justifyContent: "center",
        height: 200,
    },
    imageTitle: {
        color: colors.text_basic,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 30,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
    },
    firstTextSelect: {
        color: colors.text_basic,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    textSelect: {
        color: colors.text_basic,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 15,
    },
    picker: {
        width: '80%',
        color: colors.text_basic,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: colors.border,
        overflow: "hidden",
        backgroundColor: colors.white,
        marginBottom: 25,
    }
})