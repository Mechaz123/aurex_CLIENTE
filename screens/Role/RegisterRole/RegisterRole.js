import React, { useEffect, useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import styles from "./styles";
import colors from "../../../styles/colors";
import CustomButton from "../../../components/CustomButton/CustomButton";
import Authentication from "../../../services/Authentication";
import { AUREX_CLIENTE_AUREX_CRUD_URL } from 'react-native-dotenv';
import Utils from "../../../services/Utils";

const RegisterRole = ({ navigation, route }) => {
    const { ID } = route.params || {};
    const [roleName, setRoleName] = useState(null);
    const [roleDescription, setRoleDescription] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadDataRole();
        return (() => {
            setRoleName(null);
            setRoleDescription(null);
            setIsEditing(false);
        })
    }, [route.params]);

    const loadDataRole = async () => {
        if (Authentication.verifyStoredToken()) {
            if (ID != undefined) {
                setIsEditing(true);
                const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `role/${ID}`);

                if (response.Success) {
                    setRoleName(response.Data.name);
                    setRoleDescription(response.Data.description);
                } else {
                    Alert.alert("ERROR ❌", "Can't load the data.");
                }
            }
        } else {
            navigation.replace("Login");
        }
    }
    const createRole = async () => {
        if (Authentication.verifyStoredToken) {
            const data = {
                "name": roleName,
                "description": roleDescription,
            }

            if (roleName != null) {
                const response = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `role`, data);

                if (response.Success) {
                    Alert.alert("Success ✅", "The role was created.");
                    navigation.replace("Menu");
                } else {
                    Alert.alert("ERROR ❌", "The category was not created.");
                }
            } else {
                Alert.alert("ERROR ❌", "Please complete the fields.");
            }
        } else {
            navigation.replace("Login");
        }
    }

    const editRole = async () => {
        if (Authentication.verifyStoredToken) {
            const data = {
                "name": roleName,
                "description": roleDescription,
            }

            if (data.name != null && data.name != '') {
                const response = await Utils.sendPutRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `role/${ID}`, data);

                if (response.Success) {
                    Alert.alert("Success ✅", "The role was edited.");
                    navigation.replace("Menu");
                } else {
                    Alert.alert("ERROR ❌", "The role was not edited.");
                }
            }
        } else {
            navigation.replace("Login");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isEditing ? "✏️ Edit Role" : "✏️ Register Role"}</Text>
            <TextInput style={styles.textInput} placeholder="Name" placeholderTextColor={colors.menu_inactive_option} value={roleName} onChangeText={setRoleName} />
            <TextInput style={styles.textArea} multiline={true} numberOfLines={22} placeholder="Description" placeholderTextColor={colors.menu_inactive_option} value={roleDescription} onChangeText={setRoleDescription} />
            <CustomButton title={isEditing ? "Edit" : "Create"} onPress={isEditing ? editRole : createRole} />
        </View>
    )
}

export default RegisterRole;