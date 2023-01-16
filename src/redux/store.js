import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer';
import vendorsReducer from './reducers/vendorReducer';
import partsReducer from './reducers/partsReducer';
import authReducer from './reducers/authReducer';
import purchaseOrderReducer from './reducers/purchaseOrderReducer';
import purchaseOrderReleaseReducer from './reducers/PurchaseOrderReleaseReducer';
import priceReducer from './reducers/priceReducer';
import purchaseOrderPartReducer from './reducers/purchaseOrderPartReducer';

export const store = configureStore({
    reducer: {
        userReducer,
        vendorsReducer,
        partsReducer,
        authReducer,
        purchaseOrderReducer,
        purchaseOrderPartReducer,
        purchaseOrderReleaseReducer,
        priceReducer
    }
});