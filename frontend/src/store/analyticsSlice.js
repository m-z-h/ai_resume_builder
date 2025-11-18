import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/analytics';

// Get user token from localStorage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.token : null;
};

const initialState = {
  dashboardData: null,
  userGrowth: [],
  templateUsage: [],
  jobTrends: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get dashboard data
export const fetchDashboardData = createAsyncThunk(
  'analytics/fetchDashboardData',
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/dashboard`, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user growth data
export const fetchUserGrowth = createAsyncThunk(
  'analytics/fetchUserGrowth',
  async (months, thunkAPI) => {
    try {
      const token = getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/user-growth?months=${months || 12}`, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get template usage data
export const fetchTemplateUsage = createAsyncThunk(
  'analytics/fetchTemplateUsage',
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/template-usage`, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get job trends data
export const fetchJobTrends = createAsyncThunk(
  'analytics/fetchJobTrends',
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/job-trends`, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dashboardData = action.payload.data;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchUserGrowth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserGrowth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userGrowth = action.payload.data;
      })
      .addCase(fetchUserGrowth.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchTemplateUsage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTemplateUsage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.templateUsage = action.payload.data;
      })
      .addCase(fetchTemplateUsage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchJobTrends.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchJobTrends.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.jobTrends = action.payload.data;
      })
      .addCase(fetchJobTrends.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = analyticsSlice.actions;
export default analyticsSlice.reducer;