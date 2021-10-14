import React, {useState} from 'react'
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native'

export default function List(props) {

    console.log(props)
    const [isLoading, setLoading] = useState(props.isLoading)
    console.log(isLoading)

    props.data != null ? (
        props.onRefresh(false),
        isLoading(false),
        setLoading(false)
    ) : null

    let i = 1
    return (
        <View style={{ flex: 1, padding: 24, paddingTop: 0 }}>
            {isLoading ? <ActivityIndicator/> : (
                <FlatList
                data={props.data}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <Text style={styles.item}>{i++}. {item.name} - {item.invNom.substr(-5)}</Text>
                )}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        marginTop: 10,
        fontSize: 16,
        width: '100%',
    },
})