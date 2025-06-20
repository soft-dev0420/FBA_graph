import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// 1. Async thunk for the API call
export const fetchExcelData = createAsyncThunk(
  'excel/fetchExcelData',
  async (payload, { rejectWithValue }) => {
    try {
      // payload: { asins: [...], country: '...' }
      const response = await axios.post(`${apiUrl}/asin/batch`, payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 2. Slice
export const excelSlice = createSlice({
  name: 'excel',
  initialState: {
    data: [], // Initialize with an empty array
    isLoading: false,
    selectedRow: null,
    error: null,
  },
  reducers: {
    setSelectedRow: (state, action) => {
      state.selectedRow = action.payload;
    },
    // Removed setLoading and setError as they are handled by the thunk
  },
  // 3. Handle async thunk in extraReducers
  extraReducers: (builder) => {
    builder
      .addCase(fetchExcelData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExcelData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchExcelData.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  }
});

// Export actions
export const { setSelectedRow } = excelSlice.actions;

// Export reducer
export default excelSlice.reducer;
