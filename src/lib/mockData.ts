/**
 * Community Bridge - Tactical Data Engine
 * UPDATED: 2026-04-18
 * FEATURES: GPS Tracking, OTP Security, National Node Support.
 */

export interface NeedReport {
  id: string;
  needType: 'Food' | 'Medical' | 'Education' | 'Infrastructure' | 'Other';
  urgency: number; 
  location: string;
  peopleAffected: number;
  description: string;
  status: 'pending' | 'resolved' | 'assigned';
  syncStatus: 'synced' | 'pending';
  createdAt: string;
  sharedBy?: string; 
  acceptedBy?: string;
  // TACTICAL ADDITIONS
  lat: number; 
  lng: number; 
  otp: string; // Secure 4-digit code
  requesterPhone: string; // For Proximity Notifications
}

export interface Volunteer {
  id: string;
  name: string;
  skills: string[];
  availability: string[];
  location: string;
  hasTransport: boolean;
  tasksCompleted: number;
  avatar: string;
  lat: number; 
  lng: number; 
}

export interface NGO {
  id: string;
  name: string;
  areaCovered: string;
  focusArea: string;
  logo: string;
}

// --- CONSTANTS PRESERVED ---
export const WARDS = [
  'Ward A - Riverside', 
  'Ward B - Hilltop', 
  'Ward C - Downtown', 
  'Ward D - Lakeview', 
  'Ward E - Greenfield'
];

export const NEED_TYPES = ['Food', 'Medical', 'Education', 'Infrastructure', 'Other'] as const;

export const SKILLS = [
  'Medical', 'Teaching', 'Construction', 'Logistics', 'Counselling', 'Technology'
];

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// --- NATIONAL GRID DATABASE (INDIA GPS) ---
export const mockNeeds: NeedReport[] = [
  { 
    id: 'n1', needType: 'Food', urgency: 5, location: 'Patna, Bihar', 
    peopleAffected: 120, description: 'Severe food shortage after flooding.', 
    status: 'pending', syncStatus: 'synced', createdAt: '2026-04-10T10:00:00Z', 
    lat: 25.5941, lng: 85.1376, otp: '4821', requesterPhone: '+919876543210' 
  },
  { 
    id: 'n2', needType: 'Medical', urgency: 4, location: 'Mumbai, MH', 
    peopleAffected: 45, description: 'Outbreak of waterborne diseases.', 
    status: 'pending', syncStatus: 'synced', createdAt: '2026-04-12T08:30:00Z', 
    lat: 19.0760, lng: 72.8777, otp: '9902', requesterPhone: '+919876543211' 
  },
  { 
    id: 'n3', needType: 'Education', urgency: 2, location: 'Delhi NCR', 
    peopleAffected: 200, description: 'School infrastructure damaged.', 
    status: 'resolved', syncStatus: 'synced', createdAt: '2026-04-05T14:00:00Z', 
    lat: 28.6139, lng: 77.2090, otp: '1122', requesterPhone: '+919876543212' 
  },
  { 
    id: 'n4', needType: 'Infrastructure', urgency: 4, location: 'Mohali, PB', 
    peopleAffected: 300, description: 'Bridge collapsed near Sector 62.', 
    status: 'pending', syncStatus: 'synced', createdAt: '2026-04-15T06:00:00Z', 
    lat: 30.7046, lng: 76.7179, otp: '8845', requesterPhone: '+919876543213' 
  },
  { 
    id: 'n5', needType: 'Food', urgency: 3, location: 'Bangalore, KA', 
    peopleAffected: 80, description: 'Supply chain disruption in local shelter.', 
    status: 'assigned', syncStatus: 'synced', createdAt: '2026-04-14T11:00:00Z', 
    lat: 12.9716, lng: 77.5946, otp: '5561', requesterPhone: '+919876543214' 
  }
];

export const mockVolunteers: Volunteer[] = [
  { id: 'v1', name: 'Priya Sharma', skills: ['Medical'], availability: ['Monday'], location: 'Patna', hasTransport: true, tasksCompleted: 12, avatar: 'PS', lat: 25.6100, lng: 85.1500 },
  { id: 'v2', name: 'Rahul Patel', skills: ['Construction'], availability: ['Tuesday'], location: 'Mumbai', hasTransport: true, tasksCompleted: 8, avatar: 'RP', lat: 19.0800, lng: 72.8800 },
  { id: 'v3', name: 'Aryan (Lead)', skills: ['Technology'], availability: ['Monday', 'Friday'], location: 'Mohali', hasTransport: true, tasksCompleted: 25, avatar: 'AR', lat: 30.7046, lng: 76.7179 },
];

export const mockNGOs: NGO[] = [
  { id: 'ngo1', name: 'Hope Foundation', areaCovered: 'Riverside', focusArea: 'Food Security', logo: 'HF' },
  { id: 'ngo2', name: 'Health First', areaCovered: 'Downtown', focusArea: 'Medical Aid', logo: 'H1' },
];

export const SKILL_TO_NEED: Record<string, string[]> = {
  'Food': ['Logistics'],
  'Medical': ['Medical', 'Counselling'],
  'Education': ['Teaching', 'Counselling'],
  'Infrastructure': ['Construction', 'Logistics'],
  'Other': ['Technology', 'Logistics'],
};

export const NGO_LANGS = [
  { name: "English", code: "en" },
  { name: "Hindi (हिंदी)", code: "hi" },
  { name: "Bhojpuri (भोजपुरी)", code: "bho" },
  { name: "Maithili (मैथिली)", code: "mai" },
  { name: "Bengali (বাংলা)", code: "bn" },
  { name: "Marathi (मराठी)", code: "mr" },
  { name: "Spanish", code: "es" },
  { name: "French", code: "fr" }
];

export const liveEmergencies = [
  { id: "e1", place: "Patna, Bihar", issue: "Urgent Blood Donor (O-) required at City Hospital" },
  { id: "e2", place: "Mohali, Sector 62", issue: "Emergency food rations needed for 50 families" },
  { id: "e3", place: "Mumbai West", issue: "Medical team requested for local health camp" }
];