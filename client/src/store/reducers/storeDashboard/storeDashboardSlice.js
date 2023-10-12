import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const initialState = {
  store: null,
  loading: false,
  error: null,
};


export const fetchStoreDetails = createAsyncThunk(
  'storeDashboardDetails/fetchStoreDetails',
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/stores/${storeId}`);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


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
