/**
 * Type declarations for Superior Delivery Systems LLC Logistics Website
 */

export type ActivePage = 'home' | 'about' | 'services' | 'contact';

export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  benefits: string[];
  iconName: string; // Used to reference Lucide icons dynamically
  highlight?: boolean;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model'; // Role matching Gemini SDK constraints
  text: string;
  timestamp: Date;
}

export interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceType: string;
  message: string;
}

export interface QuoteFormResponse {
  success: boolean;
  message?: string;
  reference?: string;
  error?: string;
}
