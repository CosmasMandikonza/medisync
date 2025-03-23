import axios from 'axios';

// Base API URL - replace with your deployed Azure Functions URL in production
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:7071/api';

// API key for Azure Functions
const API_KEY = process.env.REACT_APP_FUNCTION_KEY || '';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-functions-key': API_KEY
  }
});

// Patient API calls
export const getPatients = () => api.get('/patients');
export const getPatientById = (id: string) => api.get(`/patients/${id}`);
export const createPatient = (patientData: any) => api.post('/patients', patientData);

// Speech processing API calls
export const transcribeSpeech = (audioBlob: Blob) => {
  const formData = new FormData();
  formData.append('audio', audioBlob);
  
  return api.post('/speech/transcribe', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Documentation API calls
export const generateNote = (data: {
  transcription: string;
  patientId: string;
  patientContext: string;
  providerId: string;
}) => api.post('/documentation/generate', data);

// Image analysis API calls
export const analyzeImage = (imageBlob: Blob) => {
  const formData = new FormData();
  formData.append('image', imageBlob);
  
  return api.post('/vision/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export default api;