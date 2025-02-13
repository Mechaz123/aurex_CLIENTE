import React, { useCallback, useState } from "react";
import { Alert, Switch, Text, TextInput, View } from "react-native";
import styles from "./styles";
import colors from "../../../styles/colors";
import { Picker } from "@react-native-picker/picker";
import CustomButton from "../../../components/CustomButton/CustomButton";
import Authentication from "../../../services/Authentication";
import Utils from "../../../services/Utils";
import { AUREX_CLIENTE_AUREX_MID_URL, AUREX_CLIENTE_AUREX_CRUD_URL } from 'react-native-dotenv';
import { useFocusEffect } from "@react-navigation/native";

const RegisterCategory = ({ navigation, route }) => {
    let { ID } = route.params ?? {};
    const [categoryName, setCategoryName] = useState(null);
    const [categoryDescription, setCategoryDescription] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [parentCategory, setParentCategory] = useState(null);
    const [optionsCategory, setOptionsCategory] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadDataCategory();
            loadOptionsCategory();
            return (() => {
                setCategoryName(null);
                setCategoryDescription(null);
                setShowPicker(false);
                setParentCategory(null);
                setOptionsCategory([]);
                setIsEditing(false);
                ID = undefined;
            })
        }, [route.params])
    );

    const loadDataCategory = async () => {
        if (Authentication.verifyStoredToken()) {
            if (ID != undefined) {
                setIsEditing(true);
                const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `category/${ID}`);
    
                if (response.Success) {
                    setCategoryName(response.Data.name);
                    setCategoryDescription(response.Data.description);

                    if (response.Data.parentCategory != null) {
                        setShowPicker(true);
                        setParentCategory(response.Data.parentCategory.id);
                    }
                } else {
                    Alert.alert("ERROR ❌", "Can't load the data.");
                }
            } else {
                setIsEditing(false);
            }
        } else {
            navigation.replace("Login");
        }
    }

    const loadOptionsCategory = async () => {
        if (Authentication.verifyStoredToken()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `category/parent_categories`);

            if (response.Success) {
                if (Object.keys(response.Data).length != 0) {
                    setOptionsCategory(response.Data);
                }
            } else {
                Alert("ERROR", "Can't load the options.");
            }
        } else {
            navigation.replace("Login");
        }
    }

    const createCategory = async () => {
        if (Authentication.verifyStoredToken()) {
            let data = {
                "name": categoryName,
                "description": categoryDescription,
            }

            if (categoryName != null) {
                if (showPicker) {
                    if (parentCategory != null) {
                        data.parentCategory = parentCategory;
                        const response = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `category`, data);

                        if (response.Success) {
                            Alert.alert("Success ✅", "The category was created.");
                            navigation.replace("Menu");
                        } else {
                            Alert.alert("ERROR ❌", "The category was not created.");
                        }
                    } else {
                        Alert.alert("ERROR ❌", "Please select a parent category.");
                    }
                } else {
                    data.parentCategory = null;
                    const response = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `category`, data);

                    if (response.Success) {
                        Alert.alert("Success ✅", "The category was created.");
                        navigation.replace("Menu");
                    } else {
                        Alert.alert("ERROR ❌", "The category was not created.");
                    }
                }
            } else {
                Alert.alert("ERROR ❌", "Please complete the fields.");
            }
        } else {
            navigation.replace("Login");
        }
    }

    const editCategory = async () => {
        if (Authentication.verifyStoredToken) {
            let data = {
                "name": categoryName,
                "description": categoryDescription,
            }

            if (data.name != null && data.name != '') {
                if (showPicker) {
                    if (parentCategory != null) {
                        data.parentCategory = parentCategory;
                        const response = await Utils.sendPutRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `category/${ID}`, data);

                        if (response.Success) {
                            Alert.alert("Success ✅", "The category was edited.");
                            navigation.replace("Menu");
                        } else {
                            Alert.alert("ERROR ❌", "The category was not edited.");
                        }
                    } else {
                        Alert.alert("ERROR ❌", "Please select a parent category.");
                    }
                } else {
                    data.parentCategory = null;
                    const response = await Utils.sendPutRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `category/${ID}`, data);

                    if (response.Success) {
                        Alert.alert("Success ✅", "The category was edited.");
                        navigation.replace("Menu");
                    } else {
                        Alert.alert("ERROR ❌", "The category was not edited.");
                    }
                }
            } else {
                Alert.alert("ERROR ❌", "Please complete the fields.");
            }

        } else {
            navigation.replace("Login");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isEditing ? "✏️ Edit Category" : "✏️ Register Category"}</Text>
            <TextInput style={styles.textInput} placeholder="Name" placeholderTextColor={colors.menu_inactive_option} value={categoryName} onChangeText={setCategoryName} required />
            <TextInput style={styles.textArea} multiline={true} numberOfLines={6} placeholder="Description" placeholderTextColor={colors.menu_inactive_option} value={categoryDescription} onChangeText={setCategoryDescription} />
            <View style={styles.switchContainer}>
                <Text style={styles.text}>Is it a secondary category: </Text>
                <Switch thumbColor={showPicker ? colors.primary : colors.menu_inactive_option} trackColor={{ true: colors.primary_degraded }} value={showPicker} onValueChange={setShowPicker} />
            </View>
            {showPicker && (
                <View style={styles.selectContainer}>
                    <Text style={styles.textSelectContainer}>Select the principal category</Text>
                    <Picker style={styles.picker} selectedValue={parentCategory} dropdownIconColor={colors.primary} onValueChange={(itemValue) => setParentCategory(itemValue)} >
                        <Picker.Item label="None" value={null} />
                        {optionsCategory.map((option, index) => (
                            <Picker.Item key={index} label={option.name} value={option.id} />
                        ))}
                    </Picker>
                </View>
            )}
            <CustomButton title={isEditing ? "Edit" : "Create"} onPress={isEditing ? editCategory : createCategory} />
        </View>
    );
};

export default RegisterCategory;