import AsyncStorage from "@react-native-async-storage/async-storage";
import Utils from "./Utils";
import { AUREX_CLIENTE_AUREX_MID_URL } from 'react-native-dotenv';

class Authentication {
    async verificarTokenGuardado() {
        const token = await AsyncStorage.getItem('autenticacionToken');

        try {
            if (token != null) {
                const response = await Utils.sendGetRequest(AUREX_CLIENTE_AUREX_MID_URL, `usuario/verificar_autenticacion`);
                if (response.Data.valido) {
                    return true;
                } else {
                    await AsyncStorage.removeItem('autenticacionToken');
                    return false;
                }
            }
        } catch (error) {
            await AsyncStorage.removeItem('autenticacionToken');
            return false;
        }
    }
}

export default new Authentication();