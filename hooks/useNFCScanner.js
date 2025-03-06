import { useEffect } from "react";
import nfcManager, { NfcTech } from "react-native-nfc-manager";

const useNFCScanner = () => {

    useEffect(() => {
        nfcManager.start();
        return () => {
            nfcManager.close();
        };
    }, []);

    const scanNFC = async (scanTimeout) => {
        let tagCard = null;
        let errorCard = null;

        try {
            timeout = setTimeout(() => {
                nfcManager.cancelTechnologyRequest();
            }, scanTimeout);

            await nfcManager.requestTechnology(NfcTech.Ndef);
            tagCard = await nfcManager.getTag();
            clearTimeout(timeout);
        } catch (error) {
            errorCard = "Su tarjeta no pudo ser detectada, por favor intente de nuevo.";
        } finally {
            nfcManager.cancelTechnologyRequest();
            clearTimeout(timeout);
        }

        return {tagCard, errorCard};
    }
    return { scanNFC };
};

export default useNFCScanner;