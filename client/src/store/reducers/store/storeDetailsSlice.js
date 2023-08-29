import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  store: {},
  loading: false,
  error: null,
};

export const getStoreDetails = createAsyncThunk('storeDetails/getStoreDetails',async (id, { dispatch,rejectWithValue }) => {
      try {
        dispatch(storeDetailsRequest()); // Dispatch the action creator instead of the constant
  
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/admin/store/${id}`,
          { withCredentials: true }
        );
  
        dispatch(storeDetailsSuccess(data.store));
        return data.store;
      } catch (error) {
        return rejectWithValue(error.response.data.message);
      }
    }
  );

const storeDetailsSlice = createSlice({
  name: 'storeDetails',
  initialState,
  reducers: {
    storeDetailsRequest: (state) => {
      state.loading = true;
    },
    storeDetailsSuccess: (state, action) => {
      state.loading = false;
      state.store = action.payload;
    },
    storeDetailsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
    storeUpdated: (state) => {
      state.error = null;
      state.store = {};
    },
  },
});

export const {
  storeDetailsRequest,
  storeDetailsSuccess,
  storeDetailsFail,
  clearErrors,
  storeUpdated
} = storeDetailsSlice.actions;

export default storeDetailsSlice.reducer;
