import { StyleSheet } from "react-native";
import colors from "../../styles/colors";

export default StyleSheet.create({
    container: {
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
        textAlign: 'center'
    },
    text: {
        color: colors.text_basic,
        fontSize: 22,
        marginBottom: 30,
        textAlign: 'justify'
    },
    item: {
        textAlign: 'left',
        justifyContent: 'flex-start',
        color: colors.primary,
        fontSize: 25,
        marginBottom: 10,
        fontWeight: 'bold'
    }

})