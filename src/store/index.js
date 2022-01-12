import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { sessionReducer } from "./reducers/inventory/sessionReducer";
import { scanDataReducer } from "./reducers/inventory/scanDataReducer";
import { scanResultReducer } from "./reducers/inventory/scanResultReducer";
import { modalReducer } from "./reducers/inventory/modalReducer";
import { authReducer } from "./reducers/authReducer";
import { docsScanDataReducer } from "./reducers/docs/docsScanDataReducer";
import { infoReducer } from "./reducers/infoReducer";

const inventoryReducers = combineReducers({
    session: sessionReducer,
    scan: scanDataReducer,
    scanResult: scanResultReducer,
    modals: modalReducer,
});

const docsReducers = combineReducers({
    scan: docsScanDataReducer,
});

const rootReducer = combineReducers({
    inventory: inventoryReducers,
    docs: docsReducers,
    auth: authReducer,
    info: infoReducer,
});

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);