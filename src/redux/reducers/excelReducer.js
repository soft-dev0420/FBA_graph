import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
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
    },
    getChartData: (state, action) => {
      axios.get('https://members.helium10.com/chart/index?asin=0128129190&marketplace=ATVPDKIKX0DER&range=90')
      .then((res)=>console.log("asdfsaddsaf",res.data))
      .catch(err=>console.log("ttttttttttttttt", err));
    }
  }
});

export const { setExcelData, setSelectedRow, getChartData } = excelSlice.actions;
export default excelSlice.reducer; 