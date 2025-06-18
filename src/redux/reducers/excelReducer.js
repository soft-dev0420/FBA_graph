import { createSlice } from '@reduxjs/toolkit';
import jsonData from '../../ppp.json';
const initialState = {
  data: [],
  selectedRow: null,
  isLoading: false,
  error: null
};

export const excelSlice = createSlice({
  name: 'excel',
  initialState,
  reducers: {
    setExcelData: (state, action) => {
      state.data = jsonData;
    },
    setSelectedRow: (state, action) => {
      state.selectedRow = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setExcelData, setSelectedRow, setLoading, setError } = excelSlice.actions;
export default excelSlice.reducer; 