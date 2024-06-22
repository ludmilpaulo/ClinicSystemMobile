// types.ts

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_customer: boolean;
  is_driver: boolean;
}

export interface BaseProfile {
  id: number;
  user: User;
  name: string;
  surname: string;
  phone_number?: string;
  id_number_or_passport?: string;
  gender?: "male" | "female";
  date_of_birth?: string; // using string to handle date formatting
  address?: string;
}

export interface PatientProfile extends BaseProfile {
  // Additional fields if any
}

export interface ConsultationCategory {
  id: number;
  name: string;
}

export interface DoctorProfile extends BaseProfile {
  specialty: string;
  years_of_experience: number;
  consultation_category?: ConsultationCategory;
}

export interface Appointment {
  patient: number;
  doctor: number;
  category: number;
  appointment_time: string; // using string to handle date-time formatting
  status: "scheduled" | "cancelled" | "completed";
  paid: boolean;
  fee: number;
}
export interface MedicalRecord {
  id: number;
  patient: PatientProfile;
  record_date: string; // using string to handle date formatting
  diagnosis: string;
  treatment: string;
  doctor?: DoctorProfile;
}

export interface Billing {
  id: number;
  patient: PatientProfile;
  service_name: string;
  service_fee: number;
  billing_date: string; // using string to handle date formatting
  paid: boolean;
}

export interface Document {
  id: number;
  user: User;
  document: string; // URL or path to the document
  uploaded_at: string; // using string to handle date-time formatting
}

export interface ManagementProfile extends BaseProfile {
  position: string;
}

export interface DoctorAvailability {
  id: number;
  doctor_name: string;
  doctor_surname: string;
  doctor_user_id: number;
  days_of_week: string;
  day_of_month?: number;
  start_time: string; // using string to handle time formatting
  end_time: string; // using string to handle time formatting
  year: number;
  month: number;
  slots: Slot[];
}

export interface Slot {
  time: Date;
  booked: boolean;
}

export interface Drug {
  id: number;
  name: string;
  price: number;
  quantity_available: number;
  image_urls: string[];
  description: string;
  category_name: string;
  quantity?: number; // Optional property for quantity
}

export interface Prescription {
  id: number;
  patient: PatientProfile;
  prescribed_by: DoctorProfile;
  drugs: PrescriptionDrug[];
  issue_date: string; // using string to handle date formatting
  prescription_number: string; // UUID
  notes?: string;
}

export interface PrescriptionDrug {
  id: number;
  prescription: Prescription;
  drug: Drug;
  quantity: number;
}

// utils/types.ts
// utils/types.ts
export interface AboutUsData {
  id: number;
  title: string;
  logo: string;
  backgroundImage: string;
  backgroundApp: string;
  about: string;
  born_date: string | null;
  address: string | null;
  phone: string;
  email: string;
  github: string | null;
  linkedin: string | null;
  facebook: string;
  twitter: string;
  instagram: string;
}

//export type ApiResponse = AboutUsData[];

export interface ApiResponse {
  about: AboutUsData;
  why_choose_us: any[];
  testimonials: any[];
}

export interface OrderItem {
  id: number;
  order: number; // Order ID
  drug: Drug;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  user: User;
  total_price: number;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  payment_method: "card" | "delivery" | "eft";
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  created_at: string;
  updated_at: string;
  drugs: Drug[];
  invoice?: string;
  items: OrderItem[];
}

// src/utils/types.ts
export type RootStackParamList = {
  Home: undefined;
  BannerScreen: undefined;
  DrugPage: { id: number };
  CartPage: undefined;
  CheckoutPage: undefined;
  UserProfile: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  BillingDetailsForm: { totalPrice: number }; // Add this line
};
