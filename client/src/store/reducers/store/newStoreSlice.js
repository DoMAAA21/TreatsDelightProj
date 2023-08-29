import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const initialState = {
  loading: false,
  success: false,
  error: null,
  stores: [], // Initialize stores with your desired initial value
};

export const newStore = createAsyncThunk('newStore/newStore', async (storeData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
  
      const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/admin/store/new`, storeData, { withCredentials: true }, config);
  
      return data;
    } catch (error) 
    {
      return rejectWithValue(error.response.data.message);
    }
  });

const newStoreSlice = createSlice({
  name: 'newStore',
  initialState,
  reducers: {
    updateField: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },
    newStoreRequest: (state) => {
      state.loading = true;
    },
    newStoreSuccess: (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.stores = action.payload.store;
    },
    newStoreFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    newStoreReset: (state) => {
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
      .addCase(newStore.pending, (state) => {
        state.loading = true;
      })
      .addCase(newStore.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.stores = action.payload.product;
      })
      .addCase(newStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  updateField,
  newStoreRequest,
  newStoreSuccess,
  newStoreFail,
  newStoreReset,
} = newStoreSlice.actions;

export default newStoreSlice.reducer;
