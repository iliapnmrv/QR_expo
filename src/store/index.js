import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from "redux-persist";
import { sessionReducer } from './reducers/sessionReducer';
import { scanDataReducer } from './reducers/scanDataReducer';
import { scanResultReducer } from './reducers/scanResultReducer';


const rootReducer = combineReducers({
    'session': sessionReducer,
    'scan': scanDataReducer,
    'scanResult': scanResultReducer,
})

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    blacklist: []
};

const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = createStore(persistedReducer)
export const persistor = persistStore(store)