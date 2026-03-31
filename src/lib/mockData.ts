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
}

export interface NGO {
  id: string;
  name: string;
  areaCovered: string;
  focusArea: string;
  logo: string;
}

export const WARDS = ['Ward A - Riverside', 'Ward B - Hilltop', 'Ward C - Downtown', 'Ward D - Lakeview', 'Ward E - Greenfield'];
export const NEED_TYPES = ['Food', 'Medical', 'Education', 'Infrastructure', 'Other'] as const;
export const SKILLS = ['Medical', 'Teaching', 'Construction', 'Logistics', 'Counselling', 'Technology'];
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const mockNeeds: NeedReport[] = [
  { id: 'n1', needType: 'Food', urgency: 5, location: 'Ward A - Riverside', peopleAffected: 120, description: 'Severe food shortage after flooding. Families need emergency rations.', status: 'pending', syncStatus: 'synced', createdAt: '2026-03-28T10:00:00Z' },
  { id: 'n2', needType: 'Medical', urgency: 4, location: 'Ward C - Downtown', peopleAffected: 45, description: 'Outbreak of waterborne diseases. Urgent need for medical supplies and personnel.', status: 'pending', syncStatus: 'synced', createdAt: '2026-03-29T08:30:00Z' },
  { id: 'n3', needType: 'Education', urgency: 2, location: 'Ward B - Hilltop', peopleAffected: 200, description: 'School damaged by storm. Children need temporary learning space.', status: 'resolved', syncStatus: 'synced', createdAt: '2026-03-25T14:00:00Z' },
  { id: 'n4', needType: 'Infrastructure', urgency: 4, location: 'Ward D - Lakeview', peopleAffected: 300, description: 'Bridge collapsed blocking access to hospital and market.', status: 'pending', syncStatus: 'synced', createdAt: '2026-03-30T06:00:00Z' },
  { id: 'n5', needType: 'Food', urgency: 3, location: 'Ward E - Greenfield', peopleAffected: 80, description: 'Crop failure affecting small farming community. Need seed and supplies.', status: 'assigned', syncStatus: 'synced', createdAt: '2026-03-27T11:00:00Z' },
  { id: 'n6', needType: 'Medical', urgency: 5, location: 'Ward A - Riverside', peopleAffected: 60, description: 'Pregnant women need prenatal care. No medical facility nearby.', status: 'pending', syncStatus: 'synced', createdAt: '2026-03-30T09:00:00Z' },
  { id: 'n7', needType: 'Other', urgency: 1, location: 'Ward B - Hilltop', peopleAffected: 30, description: 'Community center needs painting and minor repairs before monsoon.', status: 'resolved', syncStatus: 'synced', createdAt: '2026-03-22T16:00:00Z' },
  { id: 'n8', needType: 'Infrastructure', urgency: 3, location: 'Ward C - Downtown', peopleAffected: 150, description: 'Street lighting damaged. Safety concerns for women and children at night.', status: 'pending', syncStatus: 'pending', createdAt: '2026-03-31T07:00:00Z' },
];

export const mockVolunteers: Volunteer[] = [
  { id: 'v1', name: 'Priya Sharma', skills: ['Medical', 'Counselling'], availability: ['Monday', 'Wednesday', 'Friday'], location: 'Ward A - Riverside', hasTransport: true, tasksCompleted: 12, avatar: 'PS' },
  { id: 'v2', name: 'Rahul Patel', skills: ['Construction', 'Logistics'], availability: ['Tuesday', 'Thursday', 'Saturday'], location: 'Ward C - Downtown', hasTransport: true, tasksCompleted: 8, avatar: 'RP' },
  { id: 'v3', name: 'Anita Desai', skills: ['Teaching', 'Counselling'], availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], location: 'Ward B - Hilltop', hasTransport: false, tasksCompleted: 15, avatar: 'AD' },
  { id: 'v4', name: 'Vikram Singh', skills: ['Logistics', 'Technology'], availability: ['Saturday', 'Sunday'], location: 'Ward D - Lakeview', hasTransport: true, tasksCompleted: 6, avatar: 'VS' },
  { id: 'v5', name: 'Meera Joshi', skills: ['Medical', 'Teaching'], availability: ['Monday', 'Wednesday', 'Friday', 'Saturday'], location: 'Ward A - Riverside', hasTransport: false, tasksCompleted: 20, avatar: 'MJ' },
  { id: 'v6', name: 'Arjun Nair', skills: ['Construction', 'Technology'], availability: ['Tuesday', 'Thursday'], location: 'Ward E - Greenfield', hasTransport: true, tasksCompleted: 10, avatar: 'AN' },
];

export const mockNGOs: NGO[] = [
  { id: 'ngo1', name: 'HopeFoundation', areaCovered: 'Ward A - Riverside', focusArea: 'Food Security', logo: 'HF' },
  { id: 'ngo2', name: 'HealthFirst', areaCovered: 'Ward C - Downtown', focusArea: 'Medical Aid', logo: 'H1' },
  { id: 'ngo3', name: 'EduRise', areaCovered: 'Ward B - Hilltop', focusArea: 'Education', logo: 'ER' },
  { id: 'ngo4', name: 'BuildTogether', areaCovered: 'Ward D - Lakeview', focusArea: 'Infrastructure', logo: 'BT' },
];

export const SKILL_TO_NEED: Record<string, string[]> = {
  'Food': ['Logistics'],
  'Medical': ['Medical', 'Counselling'],
  'Education': ['Teaching', 'Counselling'],
  'Infrastructure': ['Construction', 'Logistics'],
  'Other': ['Technology', 'Logistics'],
};
