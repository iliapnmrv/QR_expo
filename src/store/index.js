import { createStore, combineReducers } from 'redux';
import { sessionReducer } from './sessionReducer';
import { scanDataReducer } from './scanDataReducer';

const rootReducer = combineReducers({
    'session': sessionReducer,
    'scan': scanDataReducer,
})


export const store = createStore(rootReducer)