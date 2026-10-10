import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchClinicConfig, fetchDoctors, fetchServices } from '../services/api';
import { defaultClinicConfig } from '../config/clinicConfig';

const ClinicContext = createContext(null);

export const ClinicProvider = ({ children }) => {
  const [clinic, setClinic] = useState(defaultClinicConfig);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [clinicData, doctorsData, servicesData] = await Promise.allSettled([
        fetchClinicConfig(),
        fetchDoctors(),
        fetchServices(),
      ]);

      if (clinicData.status === 'fulfilled' && clinicData.value) {
        setClinic((prev) => ({ ...prev, ...clinicData.value }));
      }
      if (doctorsData.status === 'fulfilled' && doctorsData.value) {
        setDoctors(doctorsData.value);
      }
      if (servicesData.status === 'fulfilled' && servicesData.value) {
        setServices(servicesData.value);
      }
    } catch (err) {
      console.error('Error loading clinic context data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <ClinicContext.Provider
      value={{
        clinic,
        setClinic,
        doctors,
        services,
        loading,
        error,
        reloadClinicData: loadData,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
