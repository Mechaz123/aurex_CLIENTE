import React, { Text, TextInput, View } from "react-native";
import styles from "./styles";
import colors from "../../../styles/colors";
import { useState } from "react";

const RegisterProducts = ({ navigation }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [productName, setProductName] = useState(null);
    const [productDescription, setProductDescription] = useState(null);
    const [productPrice, setProductPrice] = useState(null);

    return (
        <View style={styles.container}>
            <Text>{isEditing ? "✏️ Edit Product" : "✏️ Register Product"}</Text>
            <TextInput style={styles.textInput} placeholder="Name" placeholderTextColor={colors.menu_inactive_option} value={productName} onChangeText={setProductName} />
            <TextInput style={styles.textArea} multiline={true} numberOfLines={6} placeholder="Description" placeholderTextColor={colors.menu_inactive_option} value={productDescription} onChangeText={setProductDescription} />
            <TextInput keyboardType="number-pad" style={styles.textInput} placeholder="Price" placeholderTextColor={colors.menu_inactive_option} value={productPrice} onChangeText={setProductPrice} />
        </View>
    )
}

export default RegisterProducts;