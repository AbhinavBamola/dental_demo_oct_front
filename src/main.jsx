import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ClinicProvider } from './context/ClinicContext';
import { AuthProvider } from './context/AuthContext';
import { PatientAuthProvider } from './context/PatientAuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClinicProvider>
        <AuthProvider>
          <PatientAuthProvider>
            <App />
          </PatientAuthProvider>
        </AuthProvider>
      </ClinicProvider>
    </BrowserRouter>
  </React.StrictMode>
);
