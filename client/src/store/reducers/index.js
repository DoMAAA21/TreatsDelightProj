import { combineReducers } from '@reduxjs/toolkit';
import allUsersReducer from './auth/allUsersSlice';
import newUserReducer from './auth/newUserSlice';
import userReducer from './auth/userSlice';
import userDetailsReducer from './auth/userDetailsSlice';

const rootReducer = combineReducers({
  allUsers: allUsersReducer,
  newUser: newUserReducer,
  user: userReducer,
  userDetails: userDetailsReducer
});

export default rootReducer