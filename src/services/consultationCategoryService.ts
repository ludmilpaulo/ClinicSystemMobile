import axios from 'axios';
import { baseAPI } from '@/utils/variables';

const API_BASE_URL = baseAPI;

export const getConsultationCategories = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/manager/consultation-categories/`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    console.log('Categories fetched api:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching consultation categories:', error);
    throw error;
  }
};

export const createConsultationCategory = async (categoryName: string, token: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/account/consultation-categories/`, { name: categoryName }, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating consultation category:', error);
    throw error;
  }
};

