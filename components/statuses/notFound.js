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



export default function NotFound(props) {
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
            <BackHome navigation={props.navigation} />
            <View style={{ flex: 1, marginTop: 10 }}>
                <ScrollView
                    horizontal={true}
                    persistentScrollbar={true}
                    showsHorizontalScrollIndicator={true}
                >
                    {isLoading ? <ActivityIndicator color="#0000ff"/> : (
                        <FlatList
                            data={data}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.item} >
                                    <Text style={styles.itemCell}>{item.vedPos}</Text>
                                    <Text style={[styles.itemCell, styles.itemCenterCell]}>{item.name}</Text>
                                    <Text style={styles.itemCell}>{item.kolvo}</Text>
                                </View>
                            )}
                        />
                    )}
                </ScrollView>

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
        width: '40%',
        justifyContent: 'center', //Centered horizontally
        alignItems: 'center', //Centered vertically
        flex:1,
        paddingRight: 10,
        textAlign: 'center',
    },
    itemCenterCell: {
        width: 350,
    },
    item: {
        paddingTop: 5,
        paddingBottom: 15,
        paddingHorizontal: 10,
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