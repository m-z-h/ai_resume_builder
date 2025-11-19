import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/features';

// Get user token from localStorage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.token : null;
};

const initialState = {
  features: [],
  feature: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get all features (admin only)
export const fetchFeatures = createAsyncThunk(
  'features/fetchAll',
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(API_URL, config);
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

// Get feature by name
export const fetchFeatureByName = createAsyncThunk(
  'features/fetchByName',
  async (featureName, thunkAPI) => {
    try {
      const token = getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/${featureName}`, config);
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

// Check if feature is enabled for current user
export const checkFeature = createAsyncThunk(
  'features/check',
  async (featureName, thunkAPI) => {
    try {
      const token = getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/check/${featureName}`, config);
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

// Check multiple features in a single API call
export const checkFeatures = createAsyncThunk(
  'features/checkMultiple',
  async (featureNames, thunkAPI) => {
    try {
      const token = getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // Make a single API call to check all features at once
      const response = await axios.post(`${API_URL}/check`, { featureNames }, config);
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

// Update feature (admin only)
export const updateFeature = createAsyncThunk(
  'features/update',
  async ({ name, featureData }, thunkAPI) => {
    try {
      const token = getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(`${API_URL}/${name}`, featureData, config);
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

export const featureSlice = createSlice({
  name: 'features',
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
      .addCase(fetchFeatures.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeatures.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.features = action.payload;
      })
      .addCase(fetchFeatures.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchFeatureByName.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeatureByName.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.feature = action.payload;
      })
      .addCase(fetchFeatureByName.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(checkFeature.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkFeature.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update the specific feature in the features array
        const index = state.features.findIndex(
          (feature) => feature.featureName === action.meta.arg
        );
        if (index !== -1) {
          state.features[index] = { ...state.features[index], ...action.payload };
        }
      })
      .addCase(checkFeature.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(checkFeatures.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkFeatures.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update features with check results
        Object.keys(action.payload).forEach(featureName => {
          const index = state.features.findIndex(
            (feature) => feature.featureName === featureName
          );
          if (index !== -1) {
            state.features[index] = { ...state.features[index], ...action.payload[featureName] };
          }
        });
      })
      .addCase(checkFeatures.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateFeature.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateFeature.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update the specific feature in the features array
        const index = state.features.findIndex(
          (feature) => feature.featureName === action.meta.arg.name
        );
        if (index !== -1) {
          state.features[index] = action.payload;
        }
      })
      .addCase(updateFeature.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = featureSlice.actions;
export default featureSlice.reducer;