import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default localStorage
import authReducer from '../redux/slice/authSlice';

// Redux Persist config
const persistConfig = {
  key: 'root',  
  storage,     
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, 
  },
});

const persistor = persistStore(store);

export { store, persistor };
