import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import TablePage from './pages/TablePage';
import DetailPage from './pages/DetailPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app-background">
      <Header />
      <main className="flex-grow-1">
        <Provider store={store}>
          <Router>
            <Routes>
              <Route path="/" element={<TablePage />} />
              <Route path="/detail" element={<DetailPage />} />
            </Routes>
          </Router>
        </Provider>
      </main>
      <Footer />
    </div>
  );
}

export default App;