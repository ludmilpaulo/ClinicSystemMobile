import axios from "axios";

interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCVC?: string;
}
