import axios from 'axios';
import { store } from '@/redux/store';
import { selectUser } from '@/redux/slices/authSlice';
import { baseAPI } from '@/utils/variables';
import { AboutUsData, ApiResponse, User } from '@/utils/types';

const API_URL = baseAPI as string;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const user = selectUser(state);
    const token = user?.token;
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error('Axios error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'An error occurred while making the request.');
  } else {
    console.error('Unexpected error:', error);
    throw new Error('An unexpected error occurred.');
  }
};

export const fetchDrugs = async () => {
  try {
    const response = await axios.get(`${baseAPI}/pharmacy/drugs/`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createDrug = async (drugData: FormData) => {
  try {
    const response = await axios.post(`${baseAPI}/pharmacy/drugs/create/`, drugData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${baseAPI}/pharmacy/categories/`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateDrug = async (id: number, drugData: FormData) => {
  try {
    const response = await axios.put(`${baseAPI}/pharmacy/pharmacy/detail/${id}/`, drugData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteDrug = async (id: number) => {
  try {
    const response = await axios.delete(`${baseAPI}/pharmacy/pharmacy/detail/${id}/`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createOrder = async (orderData: any) => {
  try {
    const response = await api.post('/order/orders/', orderData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const fetchOrders = async () => {
  try {
    const response = await axios.get(`${baseAPI}/order/orders/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const updateOrderStatus = async (orderId: number, data: { status: string }) => {
  try {
    await axios.patch(`${baseAPI}/order/orders/${orderId}/update-status/`, data);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const fetchSalesSummary = async () => {
  try {
    const response = await axios.get(`${baseAPI}/order/sales-summary/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sales summary:', error);
    return { daily_sales: 0, monthly_sales: 0, yearly_sales: 0 };
  }
};

export const fetchUserStatistics = async () => {
  try {
    const response = await axios.get(`${baseAPI}/order/user-statistics/`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const fetchLocationStatistics = async () => {
  try {
    const response = await axios.get(`${baseAPI}/order/location-statistics/`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${baseAPI}/account/users/`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const fetchAboutUs = async (): Promise<ApiResponse[]> => {
  try {
    const response = await axios.get<ApiResponse[]>(`${API_URL}/info/about-us/`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching About Us data:", error);
    return [];
  }
};

export const createAboutUs = async (data: any) => {
  const response = await api.post(`${API_URL}/info/about-us/`, data);
  return response.data;
};

export const updateAboutUs = async (id: number, data: any) => {
  const response = await api.put(`${API_URL}/info/about-us/${id}/`, data);
  return response.data;
};

export const deleteAboutUs = async (id: number) => {
  const response = await api.delete(`${API_URL}/info/aboutus/${id}/`);
  return response.data;
};

export const fetchWhyChooseUs = async () => {
  const response = await api.get(`${API_URL}/info/whychooseus/`);
  return response.data;
};

export const createWhyChooseUs = async (data: any) => {
  const response = await api.post(`${API_URL}/info/whychooseus/`, data);
  return response.data;
};

export const updateWhyChooseUs = async (id: number, data: any) => {
  const response = await api.put(`${API_URL}/info/whychooseus/${id}/`, data);
  return response.data;
};

export const deleteWhyChooseUs = async (id: number) => {
  const response = await api.delete(`${API_URL}/info/whychooseus/${id}/`);
  return response.data;
};

export const fetchTeams = async () => {
  const response = await api.get(`${API_URL}/info/teams/`);
  return response.data;
};

export const createTeam = async (data: any) => {
  const response = await api.post(`${API_URL}/info/teams/`, data);
  return response.data;
};

export const updateTeam = async (id: number, data: any) => {
  const response = await api.put(`${API_URL}/info/teams/${id}/`, data);
  return response.data;
};

export const deleteTeam = async (id: number) => {
  const response = await api.delete(`${API_URL}/info/teams/${id}/`);
  return response.data;
};

export const fetchContacts = async () => {
  const response = await api.get(`${API_URL}/contacts/`);
  return response.data;
};

export const createContact = async (data: any) => {
  const response = await api.post(`${API_URL}/info/contacts/`, data);
  return response.data;
};

export const updateContact = async (id: number, data: any) => {
  const response = await api.put(`${API_URL}/info/contacts/${id}/`, data);
  return response.data;
};

export const deleteContact = async (id: number) => {
  const response = await api.delete(`${API_URL}/info/contacts/${id}/`);
  return response.data;
};

export const checkAdmin = async (user_id: string) => {
  const response = await api.get(`/users/${user_id}/`);
  return response.data.is_admin;
};

export const getUsers = async (): Promise<User[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getUser = async (id: number): Promise<User> => {
  const response = await axios.get(`${API_URL}/${id}/`);
  return response.data;
};

export const createUser = async (user: User): Promise<User> => {
  const response = await axios.post(API_URL, user);
  return response.data;
};

export const updateUser = async (id: number, user: User): Promise<User> => {
  const response = await axios.put(`${API_URL}/${id}/`, user);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}/`);
};

export const fetchResources = async (resource: string) => {
  const response = await api.get(`/${resource}/`);
  return response.data;
};

export const createResource = async (resource: string, data: any) => {
  const response = await api.post(`/${resource}/`, data);
  return response.data;
};

export const updateResource = async (resource: string, id: number, data: any) => {
  const response = await api.put(`/${resource}/${id}/`, data);
  return response.data;
};

export const deleteResource = async (resource: string, id: number) => {
  const response = await api.delete(`/${resource}/${id}/`);
  return response.data;
};

export const fetchAboutUsData = async (): Promise<ApiResponse | null> => {
  try {
    const response = await axios.get<ApiResponse>(`${API_URL}/info/about-us/`);
    return response.data || null;
  } catch (error) {
    console.error("Error fetching About Us data:", error);
    return null;
  }
};