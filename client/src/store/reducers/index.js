import { combineReducers } from '@reduxjs/toolkit';
import allUsersReducer from './auth/allUsersSlice';
import newUserReducer from './auth/newUserSlice';
import userReducer from './auth/userSlice';
import userDetailsReducer from './auth/userDetailsSlice';
import allStoresReducer from './store/allStoresSlice';
import newStoreReducer from './store/newStoreSlice';
import storeReducer from './store/storeSlice';
import storeDetailsReducer from './store/storeDetailsSlice';
import authenticationReducer from './auth/authenticationSlice';
import storeDashboardSlice from './storeDashboard/storeDashboardSlice';


const rootReducer = combineReducers({
  allUsers: allUsersReducer,
  newUser: newUserReducer,
  user: userReducer,
  userDetails: userDetailsReducer,
  allStores: allStoresReducer,
  newStore: newStoreReducer,
  store: storeReducer,
  storeDetails: storeDetailsReducer,
  auth: authenticationReducer
});

export default rootReducer