// third-party
import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

import reducers from './reducers';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const persistConfig = {
    key: 'root-app',
    storage
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk]
});

const persistor = persistStore(store);

const { dispatch } = store;

export { store, dispatch, persistor };
