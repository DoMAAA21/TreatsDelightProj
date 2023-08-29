import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  stores: [],
  loading: false,
  error: null,
};

export const fetchAllStores = createAsyncThunk('allStores/fetchAllStores', async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/stores`, { withCredentials: true });
      return data.stores;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  });

const allStoresSlice = createSlice({
  name: 'allStores',
  initialState,
  reducers: {
    allStoresRequest: (state) => {
      state.loading = true;
    },
    allStoresSuccess: (state, action) => {
      state.loading = false;
      state.stores = action.payload;
    },
    allStoresFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStores.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload;
      })
      .addCase(fetchAllStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  allStoresRequest,
  allStoresSuccess,
  allStoresFail,
  clearErrors,
} = allStoresSlice.actions;

export default allStoresSlice.reducer;
