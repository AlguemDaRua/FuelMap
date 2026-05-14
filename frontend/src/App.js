import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Management from './pages/Management/Management';
import Abastecimento from './pages/Abastecimento/Abastecimento';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gestao" element={<Management />} />
        <Route path="/abastecimento" element={<Abastecimento />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;