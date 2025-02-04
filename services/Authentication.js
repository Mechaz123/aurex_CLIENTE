import AsyncStorage from "@react-native-async-storage/async-storage";
import Utils from "./Utils";
import { AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';

class Authentication {
    async verifyStoredToken() {
        const token = await AsyncStorage.getItem('authToken');

        try {
            if (token != null) {
                const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `user/verify_authentication`);
                if (response.Data.valid) {
                    return true;
                } else {
                    await AsyncStorage.removeItem('authToken');
                    return false;
                }
            }
        } catch (error) {
            await AsyncStorage.removeItem('authToken');
            return false;
        }
    }
}

export default new Authentication();