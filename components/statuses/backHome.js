
import React, { useState, useEffect } from 'react';
import { 
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function BackHome() {
    return(
        <Icon name="home" size={25} color="#1E90FF" onPress={() => navigation.goBack()} style={styles.homeIcon} />
    )
}

const styles = StyleSheet.create({
    homeIcon: {
        marginRight: 20,
        marginTop: 10,
        marginBottom: 0,
        alignSelf: 'flex-end',
    },
})