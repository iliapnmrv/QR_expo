// Сообщение, исчезающее через пару секунд

import React, { useState, useEffect } from 'react';
import {
    View,
    Modal,
    StyleSheet,
    Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';




export default function Message(props) {

    const [visible, setVisible] = useState(true);

    let timeout = (props.sec != null) ? props.sec * 1000 : 4000
    // по изменению статуса
    const closeModal = () => {
        setTimeout(() => {
            setVisible(false)
        }, timeout);
    }

    return(
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible ? closeModal() : null}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.textView}>
                        <Text style={styles.messageText}>{props.message}</Text>
                        {props.secondLine && <Text style={[styles.messageText, styles.secondLine]}>{props.secondLine}</Text>}
                    </View>
                    <Icon name="times" size={25} color="#fff" onPress={()=>{ setVisible(false) }}/>
                </View>
            </View>
        </Modal>
    )
    
}

const styles = StyleSheet.create({
    centeredView: {
         flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        flexDirection: 'column',
    },
    messageText: {
        color: 'white',
        marginRight: 15,
        fontSize: 14,
    },
    secondLine: {
        fontSize: 12,
        color: 'gray',
    },
    textView:{
        flexDirection: 'column',
    },
    modalView: {
        position: 'absolute',
        maxWidth: '95%',
        bottom: 10, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "black",
        borderRadius: 3,
        padding: 10,
        paddingRight: 20,
        paddingLeft: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5
    },
})
