import React, { useState, useEffect } from 'react';
import { 
  View, 
  Button, 
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
  ScrollView
} from 'react-native';
import * as SQLite from "expo-sqlite";
import BackHome from './BackHome';

export default function Over(props) {
    const [data, setData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setLoading] = useState(true);   
      
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getData()
    }, []);

    // Подключение к бд
    const db = SQLite.openDatabase('qr.db');

    // Получение данный из бд
    const getData = async () => {
        try {
            let result = new Promise(resolve => {
                db.transaction(
                    tx => {
                    tx.executeSql(
                        `
                        SELECT * FROM scanned WHERE status = 3
                        `, 
                        [], 
                        (_, result) => {
                            if (!result.rows.length) {
                                resolve(false)
                            }
                            let data = result.rows._array
                            setData(data)
                            resolve(true)
                        },
                        (_, error) => console.log(error)
                    );
                    }
                );
            })
            result.then(() => {
                setRefreshing(false)
            })
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    let i = 1

    return (
        <ScrollView 
            style={{flex: 1}}
            contentContainerStyle={styles.scrollView}
            refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
            }
        >
            <BackHome navigation={props.navigation} />
            <View style={{ flex: 1, padding: 24, paddingTop: 0 }}>
                {isLoading ? <ActivityIndicator/> : (
                    <FlatList
                    data={data}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <Text style={styles.item}>{i++}. {item.name}</Text>
                    )}
                    />
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    item: {
        marginTop: 10,
        fontSize: 18,
        height: 44,
    },
    scrollView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
})