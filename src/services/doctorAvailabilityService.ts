import axios from 'axios';
import { baseAPI } from '@/utils/variables';

const API_BASE_URL = baseAPI;

export const getDoctorAvailabilities = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/manager/doctor-availabilities/`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor availabilities:', error);
    throw error;
  }
};

export const createDoctorAvailability = async (availabilityData: any, token: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/manager/doctor-availability/`, availabilityData, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating doctor availability:', error);
    throw error;
  }
};

export const updateDoctorAvailability = async (id: number, availabilityData: any, token: string) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/manager/doctor-availability/${id}/`, availabilityData, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating doctor availability:', error);
    throw error;
  }
};

export const deleteDoctorAvailability = async (id: number, token: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/manager/doctor-availability/${id}/`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
  } catch (error) {
    console.error('Error deleting doctor availability:', error);
    throw error;
  }
};
