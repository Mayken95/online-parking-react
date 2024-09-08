import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { MainApp } from './components/MainApp';
import { Login } from './components/LoginForm';
import { NavBar } from './components/NavBar';
import {ClientReservation} from './pages/ClientReservation';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainApp/>  
    
  </React.StrictMode>
)