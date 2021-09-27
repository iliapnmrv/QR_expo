
import React, { useState, useEffect } from 'react';
import { 
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function BackHome(props) {
    console.log(props)
    return(
        <Icon name="home" size={25} color="#1E90FF" onPress={() => props.navigation.goBack()} style={styles.homeIcon} />
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