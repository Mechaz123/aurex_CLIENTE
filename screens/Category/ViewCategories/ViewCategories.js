import React, { useEffect, useState } from "react";
import Authentication from "../../../services/Authentication";
import Utils from "../../../services/Utils";
import { AUREX_CLIENTE_AUREX_CRUD_URL } from 'react-native-dotenv';
import { Alert, FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";

const ViewCategories = ({ navigation }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadCategories();
        return (() => {
            setCategories([]);
        })
    }, []);

    const loadCategories = async () => {
        if (Authentication.verifyStoredToken()) {
            const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `category`);

            if (response.Success) {
                setCategories(response.Data);
            } else {
                navigation.replace("Login");
            }
        }
    }

    const edit = async (ID) => {
        navigation.navigate("RegisterCategory", { ID });
    }

    const changeStatus = async (ID) => {
        const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `category/${ID}`);

        if (response.Success) {
            let DataCategory = response.Data;

            if (DataCategory.active) {
                Alert.alert(
                    "INACTIVE",
                    "Are you sure you want to inactivate the category ?",
                    [
                        {
                            text: "Cancel",
                            style: "cancel",
                        },
                        {
                            text: "Yes",
                            onPress: async () => {
                                const response = await Utils.sendDeleteRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `category/${ID}`);

                                if (response.Success) {
                                    Alert.alert("Success ✅", "The category was inactivated.");
                                    navigation.replace("Menu");
                                } else {
                                    Alert.alert("ERROR ❌", "The category was not inactivated.");
                                }
                            }
                        },
                    ],
                    { cancelable: false }
                )
            } else {
                Alert.alert(
                    "ACTIVE",
                    "Are you sure you want to activate the category ?",
                    [
                        {
                            text: "Cancel",
                            style: "cancel",
                        },
                        {
                            text: "Yes",
                            onPress: async () => {
                                DataCategory.active = true;
                                const response = await Utils.sendPutRequest(AUREX_CLIENTE_AUREX_CRUD_URL, `category/${ID}`, DataCategory);

                                if (response.Success) {
                                    Alert.alert("Success ✅", "The category was activated.");
                                    navigation.replace("Menu");
                                } else {
                                    Alert.alert("ERROR ❌", "The category was not activated.");
                                }
                            }
                        },
                    ],
                    { cancelable: false }
                )
            }
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.container_title}>
                <Text style={styles.title}>🔍 View Categories</Text>
            </View>
            <ScrollView horizontal>
                <View style={styles.container_table}>
                    <FlatList data={categories} keyExtractor={(item) => item.id} style={styles.table_row}
                        ListHeaderComponent={() => (
                            <View style={styles.table}>
                                <Text style={styles.table_header}>Name</Text>
                                <Text style={styles.table_header}>Description</Text>
                                <Text style={styles.table_header}>State</Text>
                                <Text style={styles.table_header}>Parent Category</Text>
                                <Text style={styles.table_header}> Actions</Text>
                            </View>
                        )} renderItem={({ item }) => (
                            <View style={styles.table}>
                                <Text style={styles.table_text}>{item.name}</Text>
                                <Text style={styles.table_text}>{item.description}</Text>
                                <Text style={styles.table_text}>{item.active ? "Active" : "Inactive"}</Text>
                                <Text style={styles.table_text}>{item.parentCategory?.name ? item.parentCategory.name : "None"}</Text>
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
};

export default ViewCategories;