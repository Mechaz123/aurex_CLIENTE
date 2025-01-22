import { useEffect, useState } from "react";
import nfcManager, { NfcTech } from "react-native-nfc-manager";

nfcManager.start();

const useNFCScanner = (scanTimeout = 10000) => {
    const [isScanning, setIsScanning] = useState(false);
    const [tag, setTag] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        nfcManager.start();
        return () => {
            nfcManager.close();
        };
    }, []);

    const scanNFC = () => {
        setIsScanning(true);
        nfcManager.requestTechnology(NfcTech.NfcA).then( () =>{
            nfcManager.getTag().then(tag => {
                setIsScanning(false);
                setTag(JSON.stringify(tag));
            }).catch(error => {
                setIsScanning(false);
                setError('No se pudo leer el tag NFC.');
            });
        }).catch(error => {
            setIsScanning(false);
            setError('No se pudo solicitar la tecnología NFC.');
        });
    }
    return { isScanning, tag, error, scanNFC };
};

export default useNFCScanner;