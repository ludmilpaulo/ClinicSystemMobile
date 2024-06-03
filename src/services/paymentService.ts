import axios from 'axios';

const API_BASE_URL = 'https://api.pasfastgateway.com'; // Replace with actual API base URL
const API_KEY = 'your_api_key'; // Replace with your actual API key

interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCVC?: string;
}

export const processPayment = async (paymentData: PaymentData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/process-payment`,
      paymentData,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Payment failed');
  }
};
