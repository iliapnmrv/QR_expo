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
import BackHome from './backHome';


export default function NotFound({ navigation }) {
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
                        SELECT * FROM qr WHERE kolvo > 0
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
            <BackHome />
            <View style={{ flex: 1, padding: 24 }}>
                {isLoading ? <ActivityIndicator/> : (
                    <FlatList
                    data={data}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.itemCell}>{item.vedPos}</Text>
                            <Text style={[styles.itemCell, styles.itemCenterCell]}>{item.name}</Text>
                            <Text style={styles.itemCell}>{item.kolvo}</Text>
                        </View>
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
    itemCell: {
        justifyContent: 'center', //Centered horizontally
        alignItems: 'center', //Centered vertically
        flex:1,
        paddingRight: 10,
        textAlign: 'center',
    },
    itemCenterCell: {
        width: 100,
    },
    item: {
        flex: 1,
        flexDirection: "row", 
        alignItems: 'center', 
        justifyContent: "space-between",
        marginTop: 10,
        fontSize: 18,
        width: '100%',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
    scrollView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
})