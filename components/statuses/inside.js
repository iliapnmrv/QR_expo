import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet,
  Text,
  RefreshControl,
  ScrollView,
} from 'react-native';
import * as SQLite from "expo-sqlite";
import BackHome from './BackHome'
import List from './List/List';

export default function Inside(props) {
    const [data, setData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setLoading] = useState(true);   
    

    const onRefresh = (val) => {
        setRefreshing(val);
        setLoading(val)
        getData()
    }

    // Подключение к бд
    const db = SQLite.openDatabase('qr.db');

    // Получение данный из бд
    const getData = async () => {
        console.log(123)
        try {
            let result = new Promise(resolve => {
                db.transaction(
                    tx => {
                    tx.executeSql(
                        `
                        SELECT * FROM scanned WHERE status = 1
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
                onRefresh={() => onRefresh(true)}
            />
            }
        >
            <View>
                <BackHome navigation={props.navigation} />
                <Text style={styles.sectionHeader}>Позиции в учете инвентаризационной описи</Text>
            </View>
            <List data={data} onRefresh={onRefresh} isLoading={isLoading} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    sectionHeader: {
        fontSize: 18,
        padding: 10,
    },
   
    scrollView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
})