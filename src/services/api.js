import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Attach JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    // If request is to patient routes or if admin token not present, use patient_token
    const adminToken = localStorage.getItem('smilecare_token');
    const patientToken = localStorage.getItem('smilecare_patient_token');

    if (config.url?.startsWith('/users') && patientToken) {
      config.headers.Authorization = `Bearer ${patientToken}`;
    } else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (patientToken) {
      config.headers.Authorization = `Bearer ${patientToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      localStorage.removeItem('smilecare_token');
      localStorage.removeItem('smilecare_user');
      window.location.href = '/admin/login?expired=true';
    }
    return Promise.reject(error);
  }
);

// Helper for extracting clean error message
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  return error.response?.data?.message || error.message || fallback;
};

// --- Clinic Endpoints ---
export const fetchClinicConfig = async (clinicId = 'smilecare-dehradun') => {
  const response = await api.get(`/clinic?clinicId=${clinicId}`);
  return response.data.data;
};

export const updateClinicConfig = async (data) => {
  const response = await api.put('/clinic', data);
  return response.data.data;
};

// --- Doctor Endpoints ---
export const fetchDoctors = async (clinicId = 'smilecare-dehradun') => {
  const response = await api.get(`/doctors?clinicId=${clinicId}`);
  return response.data.data;
};

// --- Service Endpoints ---
export const fetchServices = async (clinicId = 'smilecare-dehradun') => {
  const response = await api.get(`/services?clinicId=${clinicId}`);
  return response.data.data;
};

export const adminCreateService = async (serviceData) => {
  const response = await api.post('/services', serviceData);
  return response.data.data;
};

export const adminUpdateService = async (id, serviceData) => {
  const response = await api.put(`/services/${id}`, serviceData);
  return response.data.data;
};

export const adminDeleteService = async (id) => {
  const response = await api.delete(`/services/${id}`);
  return response.data;
};

// --- Patient Auth & User Endpoints ---
export const patientRegister = async (data) => {
  const response = await api.post('/users/register', data);
  return response.data;
};

export const patientLogin = async (emailOrPhone, password) => {
  const response = await api.post('/users/login', { emailOrPhone, password });
  return response.data;
};

export const patientGetProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data.user;
};

export const patientGetAppointments = async () => {
  const response = await api.get('/users/my-appointments');
  return response.data.data;
};

// --- Appointment Booking Endpoints ---
export const fetchSlotAvailability = async (doctorId, date, clinicId = 'smilecare-dehradun') => {
  const response = await api.get('/appointments/availability', {
    params: { doctorId, date, clinicId },
  });
  return response.data.data;
};

export const submitAppointment = async (bookingData) => {
  const response = await api.post('/appointments', bookingData);
  return response.data;
};

// --- Admin Auth Endpoints ---
export const adminLogin = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const adminGetMe = async () => {
  const response = await api.get('/auth/me');
  return response.data.user;
};

// --- Admin Dashboard & Appointments Endpoints ---
export const adminGetDashboardStats = async () => {
  const response = await api.get('/appointments/admin/dashboard-stats');
  return response.data.data;
};

export const adminGetAppointments = async (params = {}) => {
  const response = await api.get('/appointments', { params });
  return response.data;
};

export const adminGetAppointmentById = async (id) => {
  const response = await api.get(`/appointments/${id}`);
  return response.data.data;
};

export const adminUpdateAppointmentStatus = async (id, status, notes) => {
  const response = await api.patch(`/appointments/${id}/status`, { status, notes });
  return response.data;
};

export const adminUpdateAppointmentDetails = async (id, updateData) => {
  const response = await api.put(`/appointments/${id}`, updateData);
  return response.data;
};

export default api;
