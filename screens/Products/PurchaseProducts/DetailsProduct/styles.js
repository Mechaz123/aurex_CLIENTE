import { StyleSheet } from "react-native";
import colors from "../../../../styles/colors";

export default StyleSheet.create({
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
})