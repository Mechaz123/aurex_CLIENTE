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
})