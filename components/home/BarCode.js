// Сообщение, исчезающее через пару секунд

import React, { useState, useEffect } from 'react';
import {
    View,
    Modal,
    StyleSheet,
    Text,
    Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function BarCode({route, navigation}, props) {
    const [scannedData, setScannedData] = useState()
    let scanned = false
     // Scanned bar code 
     const handleBarCodeScanned = ({type, data}) => {
        // console.log(data)
        setScannedData(data)
        navigation.navigate('Главная', {
            scannedData: scannedData,
            prevScanPosition: null,
            itemsRemain: null
        }, true)
    };

    return(
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={[StyleSheet.absoluteFillObject]}
            />
            <Icon name="times" size={40} color="#A9A9A9"  onPress={() => navigation.goBack()}/>
        </View>   
    )
    
}

const styles = StyleSheet.create({
    barcode: {
        padding: 20,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
})