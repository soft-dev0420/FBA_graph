import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import TablePage from './pages/TablePage';
import DetailPage from './pages/DetailPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<TablePage />} />
          <Route path="/detail" element={<DetailPage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;