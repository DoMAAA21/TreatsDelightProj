// storeDetailsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define an initial state
const initialState = {
  store: null,
  loading: false,
  error: null,
};

// Create an asynchronous thunk for fetching store details
export const fetchStoreDetails = createAsyncThunk(
  'storeDashboardDetails/fetchStoreDetails',
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/stores/${storeId}`);
      return response.data; // Assuming the response contains store details
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create the store details slice
const storeDetailsSlice = createSlice({
  name: 'storeDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStoreDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.store = action.payload;
        state.error = null;
      })
      .addCase(fetchStoreDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default storeDetailsSlice.reducer;
