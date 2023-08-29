import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')): null,
  loading: false,
  isAuthenticated: localStorage.getItem('user'),
  error: null,
};

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue,dispatch }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        };

        const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/login`, { email, password }, config);
        localStorage.setItem("user",JSON.stringify(data.user));
        dispatch(loginSuccess())
        return data.user;
    } catch (error) {
        dispatch(loginFail(error.response.data.message))
        return rejectWithValue(error.response.data.message);
    }
});


export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue,dispatch }) => {
  try { 
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/logout`, {withCredentials:true});
      localStorage.removeItem("user");
      
      return dispatch(logoutSuccess())
  } catch (error) {
      dispatch(loginFail(error.response.data.message))
      return rejectWithValue(error.response.data.message);
  }
});




const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    loginFail(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    googleLoginRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
    },
    googleLoginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    googleLoginFail(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    registerUserRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
    },
    registerUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    registerUserFail(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    loadUserRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
    },
    loadUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    loadUserFail(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    clearErrors(state) {
      state.error = null;
    },
    logoutSuccess(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    },
    logoutFail(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFail,
  googleLoginRequest,
  googleLoginSuccess,
  googleLoginFail,
  registerUserRequest,
  registerUserSuccess,
  registerUserFail,
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  clearErrors,
  logoutSuccess,
  logoutFail,
} = authSlice.actions;

export default authSlice.reducer;
