import React, { createContext, useContext, useState, useEffect } from 'react';
import { patientLogin, patientRegister, patientGetProfile } from '../services/api';

const PatientAuthContext = createContext();

export const PatientAuthProvider = ({ children }) => {
  const [patientUser, setPatientUser] = useState(() => {
    try {
      const stored = localStorage.getItem('smilecare_patient_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('smilecare_patient_token') || null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const user = await patientGetProfile();
          setPatientUser(user);
          localStorage.setItem('smilecare_patient_user', JSON.stringify(user));
        } catch (err) {
          console.warn('Patient token invalid or expired:', err);
          logoutPatient();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const loginPatient = async (emailOrPhone, password) => {
    const data = await patientLogin(emailOrPhone, password);
    setToken(data.token);
    setPatientUser(data.user);
    localStorage.setItem('smilecare_patient_token', data.token);
    localStorage.setItem('smilecare_patient_user', JSON.stringify(data.user));
    return data;
  };

  const registerPatient = async (registerData) => {
    const data = await patientRegister(registerData);
    setToken(data.token);
    setPatientUser(data.user);
    localStorage.setItem('smilecare_patient_token', data.token);
    localStorage.setItem('smilecare_patient_user', JSON.stringify(data.user));
    return data;
  };

  const logoutPatient = () => {
    setToken(null);
    setPatientUser(null);
    localStorage.removeItem('smilecare_patient_token');
    localStorage.removeItem('smilecare_patient_user');
  };

  return (
    <PatientAuthContext.Provider
      value={{
        patientUser,
        token,
        isAuthenticated: !!patientUser,
        loading,
        loginPatient,
        registerPatient,
        logoutPatient,
      }}
    >
      {children}
    </PatientAuthContext.Provider>
  );
};

export const usePatientAuth = () => {
  const context = useContext(PatientAuthContext);
  if (!context) {
    throw new Error('usePatientAuth must be used within a PatientAuthProvider');
  }
  return context;
};
