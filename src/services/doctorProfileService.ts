import axios from 'axios';
import { baseAPI } from '@/utils/variables';

const API_BASE_URL = baseAPI; // Replace with your backend URL

export const getDoctorProfile = async (doctorId: number, token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/account/doctor-profile/${doctorId}/`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    throw error;
  }
};

export const updateDoctorProfile = async (doctorId: number, profileData: any, token: string) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/account/doctor-profile/${doctorId}/`, profileData, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    throw error;
  }
};

export const createDoctorProfile = async (profileData: any, token: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/account/doctor-profile/`, profileData, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating doctor profile:', error);
    throw error;
  }
};
