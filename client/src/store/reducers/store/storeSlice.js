import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  isUpdated: false,
  isDeleted: false,
  error: null,
};


export const deleteStore = createAsyncThunk('store/deleteStore',async (id,{dispatch}) => {
      try {
        const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/store/${id}`, { withCredentials: true });
        dispatch(deleteStoreSuccess( data.success))
        return data.success;

      } catch (error) {
        throw error.response.data.message;
      }
    }
);

export const updateStore = createAsyncThunk('store/updateStore',async ({id,storeData},{dispatch,rejectWithValue}) => {


    try {
        const config = {
            headers: {
              'Content-Type': 'application/json',
            },
          };
      const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/admin/store/${id}`, storeData,{ withCredentials: true },config);
      dispatch(updateStoreSuccess( data.success))
      return data.success;

    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);


  

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    updateStoreRequest: (state) => {
      state.loading = true;
    },
    updateStoreSuccess: (state, action) => {
      state.loading = false;
      state.isUpdated = action.payload;
    },
    deleteStoreSuccess: (state, action) => {
      state.loading = false;
      state.isDeleted = action.payload;
    },
    updateStoreReset: (state) => {
      state.isUpdated = false;
      state.error = null;
    },
    deleteStoreReset: (state) => {
      state.isDeleted = false;
    },
    updateStoreFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
});

export const {
  updateStoreRequest,
  updateStoreSuccess,
  deleteStoreSuccess,
  updateStoreReset,
  deleteStoreReset,
  updateStoreFail,
  clearErrors,
} = storeSlice.actions;

export default storeSlice.reducer;
