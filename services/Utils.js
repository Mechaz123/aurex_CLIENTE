import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ndef } from "react-native-nfc-manager";

class Utils {

    ConvertNfcToJson(tag) {
        try {
            const ndefMessage = tag?.ndefMessage;
            if (ndefMessage && ndefMessage.length > 0) {
                const record = ndefMessage[0];
                if (record.type && Ndef.util.bytesToString(record.type) === 'application/json') {
                    const payload = Ndef.util.bytesToString(record.payload);
                    const jsonData = JSON.parse(payload);
                    return jsonData;
                }
            }
        } catch (error) {
            console.error("ERROR: Error when converting NFC type data to JSON.")
        }
    }

    async sendGetRequest(endpoint, route) {
        const url = `${endpoint}/${route}`;
        const token = await AsyncStorage.getItem('authToken');

        try {
            const response = await axios.get(url, {headers:{Authorization: `Bearer ${token}`}});
            return response.data;
        } catch (error) {
            console.log("GET request failed: ", error);

        }
    }

    async sendPostRequest(endpoint, route, body) {
        const url = `${endpoint}/${route}`;
        const token = await AsyncStorage.getItem('authToken');
        
        try {
            const response = await axios.post(url, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
            return response.data;
        } catch (error) {
            console.log("POST request failed:", error.message);
        }
    }

    async sendPutRequest(endpoint, route, body) {
        const url = `${endpoint}/${route}`;
        const token = await AsyncStorage.getItem('authToken');

        try {
            const response = await axios.put(url, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            console.log("PUT request failed: ", error.message);
        }
    }

    async sendDeleteRequest(endpoint, route) {
        const url = `${endpoint}/${route}`;
        const token = await AsyncStorage.getItem('authToken');

        try {
            const response = await axios.delete(url,{headers:{Authorization: `Bearer ${token}`}});
            return response.data;
        } catch (error) {
            console.log("DELETE request failed: ", error.message);

        }
    }
}

export default new Utils();