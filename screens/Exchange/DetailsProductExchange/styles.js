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
        quantity_container: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.background,
            marginTop: 5,
            marginBottom: 5,
        },
        quantity_button: {
            alignItems: 'center',
            backgroundColor: colors.primary,
            borderRadius: 5,
            height: 40,
            justifyContent: 'center',
            width: '10%',
        },
        quantity_button_text: {
            color: colors.white,
            fontSize: 20,
            fontWeight: 'bold',
        },
        quantity_text: {
            marginLeft: 30,
            marginRight: 30,
            color: colors.text_basic,
            fontSize: 40,
            fontWeight: 'bold'
        },
})