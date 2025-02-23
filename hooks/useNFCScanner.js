import { useEffect, useState } from "react";
import nfcManager, { NfcTech } from "react-native-nfc-manager";

const useNFCScanner = (scanTimeout = 10000) => {
    const [tag, setTag] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        nfcManager.start();
        return () => {
            nfcManager.close();
            setTag(null);
            setError(null);
        };
    }, []);

    const scanNFC = async () => {
        try {
            timeout = setTimeout(() => {
                nfcManager.cancelTechnologyRequest();
            }, scanTimeout);

            await nfcManager.requestTechnology(NfcTech.Ndef);
            const tag = await nfcManager.getTag();
            setTag(tag);
            clearTimeout(timeout);
        } catch (error) {
            setError('Su tarjeta no pudo ser detectada, por favor intente de nuevo.');
        } finally {
            nfcManager.cancelTechnologyRequest();
            clearTimeout(timeout);
        }
    }
    return { tag, error, scanNFC };
};

export default useNFCScanner;