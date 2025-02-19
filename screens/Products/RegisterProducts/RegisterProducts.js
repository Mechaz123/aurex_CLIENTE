import { Alert, Image, ScrollView, Text, TextInput, View } from "react-native";
import styles from "./styles";
import colors from "../../../styles/colors";
import React, { useCallback, useState } from "react";
import { launchImageLibrary } from "react-native-image-picker";
import CustomButton from "../../../components/CustomButton/CustomButton";
import { Picker } from "@react-native-picker/picker";
import Authentication from "../../../services/Authentication";
import { useFocusEffect } from "@react-navigation/native";
import Utils from "../../../services/Utils";
import { AUREX_CLIENTE_AUREX_MID_URL, AUREX_CLIENTE_AUREX_CRUD_URL } from 'react-native-dotenv';
import RNFS from 'react-native-fs';
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterProducts = ({ navigation, route }) => {
    const [productName, setProductName] = useState(null);
    const [productDescription, setProductDescription] = useState(null);
    const [productPrice, setProductPrice] = useState(null);
    const [productStock, setProductStock] = useState(null);
    const [productImage, setProductImage] = useState(null);
    const [productCategory, setProductCategory] = useState(null);
    const [productStatus, setProductStatus] = useState(null);
    const [productTag, setProductTag] = useState(null);
    const [productOwner, setProductOwner] = useState(null);
    const [optionsCategory, setOptionsCategory] = useState([]);
    const [optionsProductStatus, setOptionsProductStatus] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadProductOptionsCategory();
            loadOptionsProductStatus();
            return (() => {
                setProductName(null);
                setProductDescription(null);
                setProductPrice(null);
                setProductStock(null);
                setProductImage(null);
                setProductCategory(null);
                setProductStatus(null);
                setProductTag(null);
                setOptionsCategory([]);
                setOptionsProductStatus([]);
                setIsEditing(false);
            })
        }, [])
    );

    const loadProductOptionsCategory = async () => {
        if (Authentication.verifyStoredToken()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `category/secondary_categories`);

            if (response.Success) {
                if (Object.keys(response.Data).length != 0) {
                    setOptionsCategory(response.Data);
                }
            } else {
                Alert.alert("ERROR ❌", "Can't load the category options.");
            }
        } else {
            navigation.replace("Login");
        }
    }

    const loadOptionsProductStatus = async () => {
        if (Authentication.verifyStoredToken()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `product_status`);
            if (response.Success) {
                if (Object.keys(response.Data).length != 0) {
                    setOptionsProductStatus(response.Data);
                }
            } else {
                Alert.alert("ERROR ❌", "Can't load product status options.");
            }
        } else {
            navigation.replace("Login");
        }
    }

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 1 }, async (response) => {
            if (response.assets && response.assets.length > 0) {
                const imageUri = response.assets[0].uri;
                try {
                    const base64Image = await RNFS.readFile(imageUri, 'base64');
                    setProductImage(base64Image); 
                } catch (error) {
                    console.log("Error to save the image.");
                }
            }
        });
    };

    const createProduct = async () => {
        if (Authentication.verifyStoredToken()) {
            const userId = await AsyncStorage.getItem('userId');

            if (productName != null && productPrice != null && productStock != null && productTag != null && productCategory != null && productStatus != null) {
                const data = {
                    "name": productName,
                    "description": productDescription,
                    "price": productPrice,
                    "stock": productStock,
                    "image_url": productImage,
                    "tag": productTag,
                    "owner": {
                        "id": userId
                    },
                    "category": {
                        "id": productCategory
                    },
                    "product_status": {
                        "id": productStatus
                    }
                }
            } else {
                Alert.alert(
                    "ERROR ❌", 
                    "Complete the form, the following fields are required to create the product:\n\nname, price, stock, product destination, category and product status."
                );
            }
        } else {
            navigation.replace("Login");
        }
    }

    return (
        <ScrollView style={styles.ScrollView}>
            <View style={styles.container}>
                <Text style={styles.title}>{isEditing ? "✏️ Edit Product" : "✏️ Register Product"}</Text>
                <TextInput style={styles.textInput} placeholder="Name" placeholderTextColor={colors.menu_inactive_option} value={productName} onChangeText={setProductName} />
                <TextInput style={styles.textArea} multiline={true} numberOfLines={6} placeholder="Description" placeholderTextColor={colors.menu_inactive_option} value={productDescription} onChangeText={setProductDescription} />
                <TextInput keyboardType="number-pad" style={styles.textInput} placeholder="Price" placeholderTextColor={colors.menu_inactive_option} value={productPrice} onChangeText={setProductPrice} />
                <TextInput keyboardType="number-pad" style={styles.textInput} placeholder="Stock" placeholderTextColor={colors.menu_inactive_option} value={productStock} onChangeText={setProductStock} />
                <CustomButton title="📷 Select Image" onPress={selectImage} />
                {productImage && (
                    <View style={styles.imageContainer}>
                        <Text style={styles.imageTitle}>🖼️ Preview of image selected</Text>
                        <Image source={{ uri: `data:image/png;base64,${productImage}` }} style={styles.image} />
                    </View>
                )}
                <Text style={styles.firsttextSelect}>Select product category</Text>
                <Picker style={styles.picker} selectedValue={productCategory} dropdownIconColor={colors.primary} onValueChange={(itemValue) => setProductCategory(itemValue)}>
                    <Picker.Item label="None" value={null} />
                    {optionsCategory.map((option, index) => (
                        <Picker.Item key={index} label={option.name} value={option.id} />
                    ))}
                </Picker>
                <Text style={styles.textSelect}>Select product status</Text>
                <Picker style={styles.picker} selectedValue={productStatus} dropdownIconColor={colors.primary} onValueChange={(itemValue) => setProductStatus(itemValue)}>
                    <Picker.Item label="None" value={null} />
                    {optionsProductStatus.map((option, index) => (
                        <Picker.Item key={index} label={option.name} value={option.id} />
                    ))}
                </Picker>
                <Text style={styles.textSelect}>Select product destination</Text>
                <Picker style={styles.picker} selectedValue={productTag} dropdownIconColor={colors.primary} onValueChange={(itemValue) => setProductTag(itemValue)}>
                    <Picker.Item label="None" value={null} />
                    <Picker.Item label="Sale" value="Sale" />
                    <Picker.Item label="Exchange" value="Exchange" />
                    <Picker.Item label="Auction" value="Auction" />
                </Picker>
                <CustomButton title="Create" onPress={createProduct}/>
            </View>
        </ScrollView>
    )
}

export default RegisterProducts;