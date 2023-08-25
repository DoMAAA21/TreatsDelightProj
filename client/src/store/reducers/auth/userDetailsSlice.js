import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: {},
  loading: false,
  error: null,
};

export const getUserDetails = createAsyncThunk('userDetails/getUserDetails',async (id, { dispatch,rejectWithValue }) => {
      try {
        dispatch(userDetailsRequest()); // Dispatch the action creator instead of the constant
  
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/admin/user/${id}`,
          { withCredentials: true }
        );
  
        dispatch(userDetailsSuccess(data.user));
        return data.user;
      } catch (error) {
        return rejectWithValue(error.response.data.message);
      }
    }
  );

const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    userDetailsRequest: (state) => {
      state.loading = true;
    },
    userDetailsSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    userDetailsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
    userUpdated: (state) => {
      state.error = null;
      state.user = {};
    },
  },
});

export const {
  userDetailsRequest,
  userDetailsSuccess,
  userDetailsFail,
  clearErrors,
  userUpdated
} = userDetailsSlice.actions;

export default userDetailsSlice.reducer;
