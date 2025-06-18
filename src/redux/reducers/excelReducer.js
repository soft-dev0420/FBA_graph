import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  selectedRow: null
};

export const excelSlice = createSlice({
  name: 'excel',
  initialState,
  reducers: {
    setExcelData: (state, action) => {
      state.data = action.payload;
    },
    setSelectedRow: (state, action) => {
      state.selectedRow = action.payload;
    }
  }
});

export const { setExcelData, setSelectedRow } = excelSlice.actions;
export default excelSlice.reducer; 