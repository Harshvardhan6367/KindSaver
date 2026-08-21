export type SeverityLevel = 'low' | 'moderate' | 'high' | 'critical';

export type IncidentStatus = 'submitted' | 'under_review' | 'assigned' | 'in_progress' | 'resolved';

export interface Incident {
  id: string; // e.g. "KR-2026-0042"
  title: string;
  category: 'Massive Overflowing Bin' | 'Illegal Dumping Site' | 'Blocked Drainage' | 'Hazardous Bio-Waste' | 'Street Litter & Debris' | 'Dead Animal';
  location: string;
  ward: string; // e.g. "Ward 42 - Malviya Nagar"
  wardNumber: number;
  coordinates: { x: number; y: number; lat?: number; lng?: number }; // percentage on map (x: 0-100, y: 0-100)
  severity: SeverityLevel;
  status: IncidentStatus;
  reportsCount: number;
  openDuration: string; // e.g. "2d 14h open"
  slaRemaining: string; // e.g. "14h overdue" or "2h remaining"
  isOverdue: boolean;
  createdAt: string;
  updatedAt: string;
  assignedTeam?: string;
  assignedCrewContact?: string;
  description: string;
  imageUrl?: string;
  resolvedImageUrl?: string;
  resolvedAt?: string;
  citizenName?: string;
  citizenPhone?: string;
}

export interface WardInfo {
  wardNumber: number;
  name: string;
  zone: string; // e.g. "South Jaipur", "West Jaipur", "Central Jaipur"
  activeIncidents: number;
  densityLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  resolutionRate7d: number; // percentage e.g. 68
  assignedTrucks: number;
  sanitationStaff: number;
  cleanlinessScore: number; // 0-100
  supervisor: string;
  supervisorPhone: string;
}

export interface Hotspot {
  name: string;
  zone: string;
  wardNumber: number;
  severity: 'Critical' | 'High' | 'Elevated' | 'Moderate';
  activeReports: number;
  primaryCategory: string;
  trend: string;
}

export interface SanitationCrew {
  id: string;
  name: string;
  type: 'Quick Response Van' | 'Heavy Compactor' | 'Bio-Hazard Specialized' | 'Drainage Desilter';
  leader: string;
  phone: string;
  status: 'available' | 'on_duty' | 'dispatched' | 'maintenance';
  currentWard: string;
  activeTasks: number;
  vehicleNo: string;
}

export interface LiveActivity {
  id: string;
  type: 'new_report' | 'crew_assigned' | 'status_update' | 'resolved';
  message: string;
  ward: string;
  timeAgo: string;
  severity: SeverityLevel;
}
