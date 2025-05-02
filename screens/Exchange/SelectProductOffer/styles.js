import { StyleSheet } from "react-native";
import colors from "../../../styles/colors";

export default StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        color: colors.text_basic,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    text: {
        textAlign: 'center',
        color: colors.text_basic,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 30,
    },
})