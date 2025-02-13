import React, { useCallback, useState } from "react";
import { Alert, FlatList, Switch, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { Picker } from "@react-native-picker/picker";
import colors from "../../styles/colors";
import Authentication from "../../services/Authentication";
import Utils from "../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL, AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import CustomButton from "../../components/CustomButton/CustomButton";

const RolePermission = ({ navigation }) => {
    const [optionsRole, setOptionsRole] = useState([]);
    const [optionsPermission, setOptionsPermission] = useState([]);
    const [roleSelected, setRoleSelected] = useState(null);
    const [permissionSelected, setPermissionSelected] = useState(null);
    const [rolePermission, setRolePermission] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [showSwitch, setShowSwitch] = useState(false);
    const [showPicker, setShowPicker] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadOptionsRole();
            loadOptionsPermission();
            return (() => {
                setOptionsRole([]);
                setOptionsPermission([]);
                setRoleSelected(null);
                setPermissionSelected(null);
                setRolePermission([]);
                setShowTable(false);
                setShowSwitch(false);
                setShowPicker(false);
            });
        }, [])
    );

    const loadOptionsRole = async () => {
        if (Authentication.verifyStoredToken()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `role`);

            if (response.Success) {
                if (Object.keys(response.Data).length != 0) {
                    setOptionsRole(response.Data);
                } else {
                    Alert.alert("WARNING ⚠️", "There are no roles in the system.");
                }
            } else {
                Alert("ERROR ❌", "Can't load the options.");
            }
        } else {
            navigation.replace("Login");
        }
    }

    const loadRolePermission = async (itemValue) => {
        if (Authentication.verifyStoredToken()) {
            setShowSwitch(false);
            setShowPicker(false);
            if (itemValue != null) {
                setRoleSelected(itemValue);
                const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `role/${itemValue}/permission`);

                if (response.Success) {
                    if (Object.keys(response.Data).length != 0) {
                        setRolePermission(response.Data);
                        setShowTable(true);
                    } else {
                        setRolePermission([]);
                        setShowTable(false);
                        Alert.alert("WARNING ⚠️", "The role don't have permissions or they are not active.");
                    }
                    setShowSwitch(true);
                } else {
                    Alert("ERROR ❌", "Can't load the permissions of the role.");
                }
            }
        } else {
            navigation.replace("Login");
        }
    }

    const loadOptionsPermission = async () => {
        if (Authentication.verifyStoredToken()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `permission/active`);

            if (response.Success) {
                if (Object.keys(response.Data).length != 0) {
                    setOptionsPermission(response.Data);
                } else {
                    Alert.alert("WARNING ⚠️", "There are no active permissions in the system.");
                }
            } else {
                Alert("ERROR ❌", "Can't load the options.");
            }
        } else {
            navigation.replace("Login");
        }
    }

    const changeStatus = async (ID) => {
        if (Authentication.verifyStoredToken()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `role_permission/${ID}`);

            if (response.Success) {
                let DataRolePermission = response.Data;

                if (DataRolePermission.active) {
                    Alert.alert(
                        "INACTIVE",
                        "Are you sure you want to inactivate the Role-Permission ?",
                        [
                            {
                                text: "Cancel",
                                style: "cancel",
                            },
                            {
                                text: "Yes",
                                onPress: async () => {
                                    const response = await Utils.sendDeleteRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `role_permission/${ID}`);

                                    if (response.Success) {
                                        Alert.alert("Success ✅", "The role-permission was inactivated.");
                                        navigation.replace("Menu");
                                    } else {
                                        Alert.alert("ERROR ❌", "The role-permission was not inactivated.");
                                    }
                                }
                            },
                        ],
                        { cancelable: false }
                    )
                } else {
                    Alert.alert(
                        "ACTIVE",
                        "Are you sure you want to activate the role-permission ?",
                        [
                            {
                                text: "Cancel",
                                style: "cancel",
                            },
                            {
                                text: "Yes",
                                onPress: async () => {
                                    DataRolePermission.active = true;
                                    const response = await Utils.sendPutRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `role_permission/${ID}`, DataRolePermission);

                                    if (response.Success) {
                                        Alert.alert("Success ✅", "The role-permission was activated.");
                                        navigation.replace("Menu");
                                    } else {
                                        Alert.alert("ERROR ❌", "The role-permission was not activated.");
                                    }
                                }
                            },
                        ],
                        { cancelable: false }
                    )
                }
            }
        } else {
            navigation.replace("Login");
        }
    }

    const createRolePermission = async () => {
        if (Authentication.verifyStoredToken()) {
            if (permissionSelected != null) {
                const verifyRolePermissionRecords = rolePermission.filter((data) => (data.role.id == roleSelected) && (data.permission.id == permissionSelected)).length;
                if (verifyRolePermissionRecords == 0) {
                    const data = {
                        "role": {
                            "id": roleSelected,
                        },
                        "permission": {
                            "id": permissionSelected,
                        }
                    }

                    const response = await Utils.sendPostRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `role_permission`, data);

                    if (response.Success) {
                        Alert.alert("Success ✅", "The role-permission was created.");
                        navigation.replace("Menu");
                    } else {
                        Alert.alert("ERROR ❌", "The role-permission was not created.");
                    }
                } else {
                    Alert.alert("ERROR ❌", "The role-permission already exist.");
                }
            } else {
                Alert.alert("ERROR ❌", "Please select a permission for the role.");
            }
        } else {
            navigation.replace("Login");
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>👮🏻 Manage Role Permissions</Text>
                <View style={styles.selectContainer}>
                    <Text style={styles.textSelectContainer}>Select the role to view its permissions.</Text>
                    <Picker style={styles.picker} selectedValue={roleSelected} dropdownIconColor={colors.primary} onValueChange={(itemValue) => loadRolePermission(itemValue)}>
                        {optionsRole.map((option, index) => (
                            <Picker.Item key={index} label={option.name} value={option.id} />
                        ))}
                    </Picker>
                </View>
                {showTable && (
                    <ScrollView horizontal>
                        <View style={styles.container_table}>
                            <FlatList data={rolePermission} keyExtractor={(item) => item.id} style={styles.table_row}
                                ListHeaderComponent={() => (
                                    <View style={styles.table}>
                                        <Text style={styles.table_header}>Permission</Text>
                                        <Text style={styles.table_header}>State</Text>
                                        <Text style={styles.table_header}>Actions</Text>
                                    </View>
                                )} renderItem={({ item }) => (
                                    <View style={styles.table}>
                                        <Text style={styles.table_text}>{item.permission.name}</Text>
                                        <Text style={styles.table_text}>{item.active ? "Active" : "Inactive"}</Text>
                                        <View style={styles.table_actions}>
                                            <TouchableOpacity style={styles.table_button} onPress={() => changeStatus(item.id)}>
                                                <Text style={styles.button_text}>{item.active ? "🚫" : "✅"}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )} />
                        </View>
                    </ScrollView>
                )}
                {showSwitch && (
                    <View style={styles.switchContainer}>
                        <Text style={styles.text}>Add new permission ? </Text>
                        <Switch thumbColor={showPicker ? colors.primary : colors.menu_inactive_option} trackColor={{ true: colors.primary_degraded }} value={showPicker} onValueChange={setShowPicker} />
                    </View>
                )}
                {showPicker && (
                    <View style={styles.selectContainer}>
                        <Text style={styles.textSelectContainer}>Select the permission you want to assign to the role</Text>
                        <Picker style={styles.picker} selectedValue={permissionSelected} dropdownIconColor={colors.primary} onValueChange={(itemValue) => setPermissionSelected(itemValue)}>
                            {optionsPermission.map((option, index) => (
                                <Picker.Item key={index} label={option.name} value={option.id} />
                            ))}
                        </Picker>
                        <CustomButton title="Add Permission" onPress={createRolePermission} />
                    </View>
                )}
            </ScrollView>
        </View>
    )
}

export default RolePermission;