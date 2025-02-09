import React, { useEffect, useState } from "react";
import { Alert, FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Authentication from "../../../services/Authentication";
import Utils from "../../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL } from 'react-native-dotenv';
import styles from "./styles";

const ViewRoles = ({ navigation }) => {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        loadRoles();
        return (() => {
            setRoles([]);
        })
    }, []);

    const loadRoles = async () => {
        if (Authentication.verifyStoredToken()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `role`);

            if (response.Success) {
                setRoles(response.Data);
            } else {
                Alert.alert("ERROR ❌", "Can't load the roles.");
            }
        } else {
            navigation.replace("Login");
        }
    }

    const edit = async (ID) => {
        navigation.navigate("RegisterRole", { ID });
    }
    const changeStatus = async (ID) => {
        if (Authentication.verifyStoredToken()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `role/${ID}`);

            if (response.Success) {
                let DataRole = response.Data;

                if (DataRole.active) {
                    Alert.alert(
                        "INACTIVE",
                        "Are you sure you want to inactivate the role ?",
                        [
                            {
                                text: "Cancel",
                                style: "cancel",
                            },
                            {
                                text: "Yes",
                                onPress: async () => {
                                    const response = await Utils.sendDeleteRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `role/${ID}`);

                                    if (response.Success) {
                                        Alert.alert("Success ✅", "The role was inactivated.");
                                        navigation.replace("Menu");
                                    } else {
                                        Alert.alert("ERROR ❌", "The role was not inactivated.");
                                    }
                                }
                            },
                        ],
                        { cancelable: false }
                    )
                } else {
                    Alert.alert(
                        "ACTIVE",
                        "Are you sure you want to activate the role ?",
                        [
                            {
                                text: "Cancel",
                                style: "cancel",
                            },
                            {
                                text: "Yes",
                                onPress: async () => {
                                    DataRole.active = true;
                                    const response = await Utils.sendPutRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `role/${ID}`, DataRole);

                                    if (response.Success) {
                                        Alert.alert("Success ✅", "The role was activated.");
                                        navigation.replace("Menu");
                                    } else {
                                        Alert.alert("ERROR ❌", "The role was not activated.");
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

    return (
        <View style={styles.container}>
            <View style={styles.container_title}>
                <Text style={styles.title}>🔍 View Roles</Text>
            </View>
            <ScrollView horizontal>
                <View style={styles.container_table}>
                    <FlatList data={roles} keyExtractor={(item) => item.id} style={styles.table_row}
                        ListHeaderComponent={() => (
                            <View style={styles.table}>
                                <Text style={styles.table_header}>Name</Text>
                                <Text style={styles.table_header}>Description</Text>
                                <Text style={styles.table_header}>State</Text>
                                <Text style={styles.table_header}> Actions</Text>
                            </View>
                        )} renderItem={({ item }) => (
                            <View style={styles.table}>
                                <Text style={styles.table_text}>{item.name}</Text>
                                <Text style={styles.table_text}>{item.description}</Text>
                                <Text style={styles.table_text}>{item.active ? "Active" : "Inactive"}</Text>
                                <View style={styles.table_actions}>
                                    <TouchableOpacity style={styles.table_button} onPress={() => edit(item.id)}>
                                        <Text style={styles.button_text}>✏️</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.table_button} onPress={() => changeStatus(item.id)}>
                                        <Text style={styles.button_text}>{item.active ? "🚫" : "✅"}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )} />
                </View>
            </ScrollView>
        </View>
    )
}

export default ViewRoles;