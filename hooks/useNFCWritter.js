import { useEffect, useState } from "react";
import nfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";

const useNFCWritter = () => {
    const [error, setError] = useState(null);

    useEffect(() => {
        nfcManager.start();
        return () => {
            nfcManager.close();
            setError(null);
        };
    }, []);

    const writeNFC = async (customData, writeTimeout) => {
        try {
            timeout = setTimeout(() => {
                nfcManager.cancelTechnologyRequest();
            }, writeTimeout);

            await nfcManager.requestTechnology(NfcTech.Ndef);
            const jsonString = JSON.stringify(customData);
            const ndefData = Ndef.encodeMessage([Ndef.record(Ndef.TNF_MIME_MEDIA, "application/json", [], jsonString)]);
            await nfcManager.ndefHandler.writeNdefMessage(ndefData);


            clearTimeout(timeout);
        } catch (error) {
            setError('Su tarjeta no pudo ser configurada, por favor intente de nuevo.');
        } finally {
            nfcManager.cancelTechnologyRequest();
            clearTimeout(timeout);
        }
    }

    return { error, writeNFC };
};

export default useNFCWritter;