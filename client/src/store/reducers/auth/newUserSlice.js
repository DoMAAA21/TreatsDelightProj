import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const initialState = {
  loading: false,
  success: false,
  error: null,
  users: [], // Initialize users with your desired initial value
};

export const newUser = createAsyncThunk('newUser/newUser', async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
  
      const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/admin/user/new`, userData, { withCredentials: true }, config);
  
      return data;
    } catch (error) 
    {
      return rejectWithValue(error.response.data.message);
    }
  });

const newUserSlice = createSlice({
  name: 'newUser',
  initialState,
  reducers: {
    updateField: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },
    newUserRequest: (state) => {
      state.loading = true;
    },
    newUserSuccess: (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.users = action.payload.user;
    },
    newUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    newUserReset: (state) => {
      state.success = false;
      state.error = null;
    },
    clearErrors: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(newUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(newUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.users = action.payload.product;
      })
      .addCase(newUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  updateField,
  newUserRequest,
  newUserSuccess,
  newUserFail,
  newUserReset,
} = newUserSlice.actions;

export default newUserSlice.reducer;
