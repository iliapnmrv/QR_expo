import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    useWindowDimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BarCodeScanner } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';

export default function BarCode({ navigation }) {

    const { height, width } = useWindowDimensions()

    const finderWidth = 280;
    const finderHeight = 230;
    const viewMinX = (width - finderWidth) / 2;
    const viewMinY = (height - finderHeight) / 2;

        // Scanned bar code 
    const handleBarCodeScanned = ({ type, data, bounds }) => {
        const {x, y} = bounds.origin
        if (x >= viewMinX && y >= viewMinY && x <= (viewMinX + finderWidth / 2) && y <= (viewMinY + finderHeight / 2)) {
            navigation.navigate('Главная', {
                scannedData: data,
                prevScanPosition: null,
                itemsRemain: null
            }, true)
        }
    };

    return ( 
        <View style = { styles.container } >
            <BarCodeScanner 
                onBarCodeScanned = { handleBarCodeScanned }
                style = { [StyleSheet.absoluteFillObject] }
            /> 
            <BarcodeMask 
                edgeColor="#62B1F6" 
                width={250} 
                height={250} 
                showAnimatedLine={false} 
                outerMaskOpacity={0.3} 
                edgeBorderWidth={5}
                edgeRadius={10}
                edgeHeight={25}
                edgeWidth={25}
            />

            <Icon 
                name = "times"
                size = { 40 }
                color = "#f9f9f9"
                style = { styles.closeBtn }
                onPress = { () => navigation.goBack() }
            />
        </View >
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 0,
        margin: -20,
    },
    closeBtn : {
        position: 'absolute',
        alignSelf: 'center',
        bottom: '15%',
    },
})