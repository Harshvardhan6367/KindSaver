import { Incident, WardInfo, Hotspot, SanitationCrew, LiveActivity } from '../types';

export const ADMIN_PROFILE_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCC05sN2Nbzf80hxCRKqqnuUYfJyZ9vMTjn23ozgW2sd3NUhj3u5Gt9fR3NTVExGLcZaKqSiP6bPlw9EjcodyyPquU6ZWNEFc4t7OKTbYPSV89l8GhttbxdxPJQdJw5QCwf4Kt-xFwTzr7scEo7EMnJK1FcJoqz6GWJZlh7XF7pip24vcAztO_4bBUtAyogigGgjRIYcENnXTcsiUPR4oi4fMGW3YCTzgwSwPWuQ2-gLiJ_V1HuEmxrSQ';

export const CITIZEN_OFFICER_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBA0vXwKoqUsggzHqkJ5XBFK8GralKZ4iWbP7NQGGTI_zgO6UeQRn7fLhoA1IELfVemMgvvroyRVCLxL3klmbvsfb7_3yvI8XbpIttTbsBJXZO5RseX7Z4-VYRrhS1u1cr5Q-XkqL1_8XQSB8DqYe87Zq_eIGYzmtNjbkfqVjpwmzaxXr_LNdUGK4fAjySNUOWdGyhGCCH7o2NuJ9YuiRXNQezmKHk5-pSEQ8rAsWq71_zAcmlQr5BOxA';

export const ADMIN_MAP_BG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB49FS8FtEdhSKbkfaFqY3HGir9SlxtKBI70BWFMgAa6ujlO6Ncp0TJL1QLBfJ28-0p7IE-o1B5M-Yh0w9enqGG580D2-IF6fuw6L6K98-lm5Bw6t8hsSlt8ell1tyRa4Ho8t6aplANWSTQAygI4OgkLTKxqyagVpUteTXZ3QnByOPAhjgMMnXesT2Po_ZyoMrOxXzZc2S8J8qHLVDicEP08AlY7aBtokkosluZ5HH62-DTqXXE7KvCTQ';

export const CITIZEN_MAP_BG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ9InDtRcRkb_XTOVIdHD0EnE-on6KhVPWq3PfzH2BFCs-Zh455brxh9TSqaXD2Hgf0LINhzrvf3RYXIubmlKG8vZLlVZTsl4cVMjE3Lvk60-BFJ2eeD0PzIhHMw84MEMBDlYhjsAJ-nopCFXRhc4C0CsKCXcAIGyqXlfAhzTVzT8iA-gWoMN2C8hOUXsakNiwIh9ynI3ncZTBzEonx5uRNVrFxpsTvbdFQ4ppOFH2lye8YTsLV4N6xg';

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'KR-2026-0042',
    title: 'Massive Overflowing Bin',
    category: 'Massive Overflowing Bin',
    location: 'Sector 3 Market, Calgiri Marg',
    ward: 'Ward 42 - Malviya Nagar',
    wardNumber: 42,
    coordinates: { x: 62, y: 72 },
    severity: 'critical',
    status: 'assigned',
    reportsCount: 19,
    openDuration: '2d 14h open',
    slaRemaining: '14h overdue',
    isOverdue: true,
    createdAt: '2026-08-19T06:30:00Z',
    updatedAt: '2026-08-21T02:15:00Z',
    assignedTeam: 'Sanitation Team Alpha - Quick Response Van 4',
    assignedCrewContact: '+91 98290 11420',
    description: 'Community garbage dumpster is completely overflowing onto the main sidewalk, spilling into traffic lane and creating a severe pedestrian hazard.',
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
    citizenName: 'Rahul Verma',
    citizenPhone: '+91 98291 55432'
  },
  {
    id: 'KR-2026-0089',
    title: 'Illegal Dumping Site',
    category: 'Illegal Dumping Site',
    location: 'RIICO Industrial Area, Road No. 9',
    ward: 'Ward 18 - Sita Pura',
    wardNumber: 18,
    coordinates: { x: 74, y: 84 },
    severity: 'critical',
    status: 'under_review',
    reportsCount: 8,
    openDuration: '1d 2h open',
    slaRemaining: '2h remaining',
    isOverdue: false,
    createdAt: '2026-08-20T08:00:00Z',
    updatedAt: '2026-08-20T18:30:00Z',
    description: 'Unlicensed night-dumping of industrial packaging waste and commercial plaster rubble near storm drain.',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    citizenName: 'Pooja Agarwal',
    citizenPhone: '+91 94140 88219'
  },
  {
    id: 'KR-2026-0102',
    title: 'Blocked Drainage & Sludge Overflow',
    category: 'Blocked Drainage',
    location: 'Queens Road Junction, Amrapali Circle',
    ward: 'Ward 33 - Vaishali Nagar',
    wardNumber: 33,
    coordinates: { x: 38, y: 55 },
    severity: 'high',
    status: 'assigned',
    reportsCount: 4,
    openDuration: '18h open',
    slaRemaining: '5h remaining',
    isOverdue: false,
    createdAt: '2026-08-20T16:45:00Z',
    updatedAt: '2026-08-21T01:00:00Z',
    assignedTeam: 'Desilter Unit Delta-2',
    assignedCrewContact: '+91 97840 90123',
    description: 'Monsoon runoff channel clogged with heavy plastic packaging and tree trimmings, causing stagnant water buildup on street.',
    imageUrl: 'https://images.unsplash.com/photo-1594498653385-d5172c532c00?auto=format&fit=crop&w=800&q=80',
    citizenName: 'Vikram Shekhawat',
    citizenPhone: '+91 99280 44321'
  },
  {
    id: 'KR-2026-0004',
    title: 'Massive Overflowing Bin',
    category: 'Massive Overflowing Bin',
    location: 'Gaurav Tower Back Entrance, Malviya Nagar',
    ward: 'Ward 42 - Malviya Nagar',
    wardNumber: 42,
    coordinates: { x: 58, y: 68 },
    severity: 'critical',
    status: 'submitted',
    reportsCount: 19,
    openDuration: '2d 14h open',
    slaRemaining: 'Overdue by 18h',
    isOverdue: true,
    createdAt: '2026-08-19T06:00:00Z',
    updatedAt: '2026-08-21T00:30:00Z',
    description: 'Food court waste overflowing from twin 1100L green bins. Stray animals scattering trash on road.',
    imageUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
    citizenName: 'Sunita Meena',
    citizenPhone: '+91 94142 99801'
  },
  {
    id: 'KR-2026-0012',
    title: 'Illegal Dumping Site',
    category: 'Illegal Dumping Site',
    location: 'Mahatma Gandhi Hospital Road, Sita Pura',
    ward: 'Ward 18 - Sita Pura',
    wardNumber: 18,
    coordinates: { x: 68, y: 79 },
    severity: 'high',
    status: 'submitted',
    reportsCount: 8,
    openDuration: '1d 2h open',
    slaRemaining: '4h remaining',
    isOverdue: false,
    createdAt: '2026-08-20T07:15:00Z',
    updatedAt: '2026-08-20T19:00:00Z',
    description: 'Construction debris, broken bricks, and tile fragments dumped on roadside vacant plot.',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    citizenName: 'Dinesh Kumar',
    citizenPhone: '+91 98288 33210'
  },
  {
    id: 'KR-2026-0074',
    title: 'Hazardous Bio-Waste Dump',
    category: 'Hazardous Bio-Waste',
    location: 'Near Old Hospital Lane, Vidyadhar Nagar',
    ward: 'Ward 05 - Vidyadhar Nagar',
    wardNumber: 5,
    coordinates: { x: 44, y: 28 },
    severity: 'critical',
    status: 'in_progress',
    reportsCount: 12,
    openDuration: '8h open',
    slaRemaining: '1h remaining',
    isOverdue: false,
    createdAt: '2026-08-20T22:30:00Z',
    updatedAt: '2026-08-21T02:00:00Z',
    assignedTeam: 'Bio-Hazard Response Team Sigma',
    assignedCrewContact: '+91 98293 44556',
    description: 'Unidentified medical packaging and contaminated clinic materials discarded in public open bin.',
    imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
    citizenName: 'Dr. Anita Joshi',
    citizenPhone: '+91 94143 77889'
  },
  {
    id: 'KR-2026-0033',
    title: 'Cleaned Up: Open Litter Clearout',
    category: 'Street Litter & Debris',
    location: 'Madhyam Marg Market, Mansarovar',
    ward: 'Ward 12 - Mansarovar',
    wardNumber: 12,
    coordinates: { x: 42, y: 76 },
    severity: 'moderate',
    status: 'resolved',
    reportsCount: 6,
    openDuration: 'Resolved in 3h 20m',
    slaRemaining: 'Resolved within SLA',
    isOverdue: false,
    createdAt: '2026-08-20T04:00:00Z',
    updatedAt: '2026-08-20T07:20:00Z',
    assignedTeam: 'Mansarovar Rapid Sweeper Team 3',
    assignedCrewContact: '+91 94140 12345',
    description: 'Vegetable market remnant cabbage leaves, polybags, and wooden crates completely sanitized and hosed down.',
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
    resolvedImageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    resolvedAt: '2026-08-20T07:20:00Z',
    citizenName: 'Manish Pareek',
    citizenPhone: '+91 98294 66778'
  },
  {
    id: 'KR-2026-0021',
    title: 'Heritage Corridor Litter Cleared',
    category: 'Street Litter & Debris',
    location: 'Badi Chaupar, Near Hawa Mahal',
    ward: 'Ward 01 - Hawa Mahal Heritage Zone',
    wardNumber: 1,
    coordinates: { x: 57, y: 46 },
    severity: 'moderate',
    status: 'resolved',
    reportsCount: 14,
    openDuration: 'Resolved in 1h 45m',
    slaRemaining: 'Priority Target Met',
    isOverdue: false,
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-20T11:45:00Z',
    assignedTeam: 'Heritage Zone Dedicated Van 1',
    assignedCrewContact: '+91 98299 88776',
    description: 'Tourist plaza waste and packaging cleared, motorized vacuum sweeper deployed.',
    imageUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
    resolvedImageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    resolvedAt: '2026-08-20T11:45:00Z',
    citizenName: 'Govind Sharma',
    citizenPhone: '+91 98291 22334'
  }
];

export const INITIAL_WARDS: WardInfo[] = [
  {
    wardNumber: 42,
    name: 'Malviya Nagar',
    zone: 'South Jaipur',
    activeIncidents: 48,
    densityLevel: 'HIGH',
    resolutionRate7d: 68,
    assignedTrucks: 8,
    sanitationStaff: 42,
    cleanlinessScore: 62,
    supervisor: 'Rajendra Prasad Meena',
    supervisorPhone: '+91 98290 88123'
  },
  {
    wardNumber: 18,
    name: 'Sita Pura',
    zone: 'South-East Jaipur',
    activeIncidents: 35,
    densityLevel: 'ELEVATED',
    resolutionRate7d: 72,
    assignedTrucks: 6,
    sanitationStaff: 34,
    cleanlinessScore: 71,
    supervisor: 'Mukesh Choudhary',
    supervisorPhone: '+91 94140 77412'
  },
  {
    wardNumber: 33,
    name: 'Vaishali Nagar',
    zone: 'West Jaipur',
    activeIncidents: 29,
    densityLevel: 'ELEVATED',
    resolutionRate7d: 81,
    assignedTrucks: 7,
    sanitationStaff: 38,
    cleanlinessScore: 84,
    supervisor: 'Suresh Kumar Sharma',
    supervisorPhone: '+91 97840 66321'
  },
  {
    wardNumber: 5,
    name: 'Vidyadhar Nagar',
    zone: 'North Jaipur',
    activeIncidents: 22,
    densityLevel: 'MODERATE',
    resolutionRate7d: 89,
    assignedTrucks: 5,
    sanitationStaff: 30,
    cleanlinessScore: 88,
    supervisor: 'Deepak Rathore',
    supervisorPhone: '+91 98292 55214'
  },
  {
    wardNumber: 12,
    name: 'Mansarovar',
    zone: 'West Jaipur',
    activeIncidents: 18,
    densityLevel: 'MODERATE',
    resolutionRate7d: 94,
    assignedTrucks: 9,
    sanitationStaff: 46,
    cleanlinessScore: 92,
    supervisor: 'Anil Kumar Yadav',
    supervisorPhone: '+91 99281 44109'
  },
  {
    wardNumber: 1,
    name: 'Hawa Mahal Heritage Zone',
    zone: 'Central Jaipur',
    activeIncidents: 14,
    densityLevel: 'MODERATE',
    resolutionRate7d: 96,
    assignedTrucks: 6,
    sanitationStaff: 52,
    cleanlinessScore: 95,
    supervisor: 'Gopal Saini',
    supervisorPhone: '+91 94142 33118'
  },
  {
    wardNumber: 21,
    name: 'C-Scheme & Civil Lines',
    zone: 'Central Jaipur',
    activeIncidents: 11,
    densityLevel: 'LOW',
    resolutionRate7d: 97,
    assignedTrucks: 6,
    sanitationStaff: 35,
    cleanlinessScore: 96,
    supervisor: 'Kamlesh Gupta',
    supervisorPhone: '+91 98294 22001'
  }
];

export const INITIAL_HOTSPOTS: Hotspot[] = [
  {
    name: 'Malviya Nagar',
    zone: 'South Jaipur',
    wardNumber: 42,
    severity: 'Critical',
    activeReports: 19,
    primaryCategory: 'Overflowing Commercial Bins',
    trend: '+12%'
  },
  {
    name: 'Mansarovar',
    zone: 'West Jaipur',
    wardNumber: 12,
    severity: 'High',
    activeReports: 8,
    primaryCategory: 'Market Open Waste Dump',
    trend: '-5%'
  },
  {
    name: 'Sita Pura Industrial Area',
    zone: 'South-East Jaipur',
    wardNumber: 18,
    severity: 'Critical',
    activeReports: 14,
    primaryCategory: 'Illegal Rubble Dumping',
    trend: '+8%'
  },
  {
    name: 'Vaishali Nagar',
    zone: 'West Jaipur',
    wardNumber: 33,
    severity: 'Elevated',
    activeReports: 7,
    primaryCategory: 'Blocked Stormwater Drains',
    trend: 'stable'
  },
  {
    name: 'Vidyadhar Nagar',
    zone: 'North Jaipur',
    wardNumber: 5,
    severity: 'Elevated',
    activeReports: 5,
    primaryCategory: 'Clinic Waste Disposal',
    trend: '-2%'
  }
];

export const INITIAL_CREWS: SanitationCrew[] = [
  {
    id: 'CREW-01',
    name: 'Sanitation Team Alpha (QRV-4)',
    type: 'Quick Response Van',
    leader: 'Rameshwar Lal',
    phone: '+91 98290 11420',
    status: 'dispatched',
    currentWard: 'Ward 42 - Malviya Nagar',
    activeTasks: 2,
    vehicleNo: 'RJ-14-GA-4892'
  },
  {
    id: 'CREW-02',
    name: 'Heavy Compactor Squad Beta',
    type: 'Heavy Compactor',
    leader: 'Sardar Jagjit Singh',
    phone: '+91 98291 99011',
    status: 'available',
    currentWard: 'Ward 18 - Sita Pura',
    activeTasks: 0,
    vehicleNo: 'RJ-14-GB-9921'
  },
  {
    id: 'CREW-03',
    name: 'Bio-Hazard Specialized Sigma',
    type: 'Bio-Hazard Specialized',
    leader: 'Dr. Vinod Kasliwal (Officer)',
    phone: '+91 98293 44556',
    status: 'on_duty',
    currentWard: 'Ward 05 - Vidyadhar Nagar',
    activeTasks: 1,
    vehicleNo: 'RJ-14-GC-1102'
  },
  {
    id: 'CREW-04',
    name: 'Desilter Unit Delta-2',
    type: 'Drainage Desilter',
    leader: 'Ramavtar Meena',
    phone: '+91 97840 90123',
    status: 'dispatched',
    currentWard: 'Ward 33 - Vaishali Nagar',
    activeTasks: 1,
    vehicleNo: 'RJ-14-GD-7788'
  },
  {
    id: 'CREW-05',
    name: 'Heritage Rapid Sweepers (City Palace)',
    type: 'Quick Response Van',
    leader: 'Mohan Lal Verma',
    phone: '+91 98299 88776',
    status: 'available',
    currentWard: 'Ward 01 - Hawa Mahal Zone',
    activeTasks: 0,
    vehicleNo: 'RJ-14-EV-2024'
  }
];

export const INITIAL_ACTIVITIES: LiveActivity[] = [
  {
    id: 'ACT-1',
    type: 'new_report',
    message: 'New Critical report in Ward 42: Overflowing Bio-Waste.',
    ward: 'Ward 42 - Malviya Nagar',
    timeAgo: 'Just now',
    severity: 'critical'
  },
  {
    id: 'ACT-2',
    type: 'crew_assigned',
    message: 'Team Alpha dispatched to Malviya Nagar Calgiri Marg (ETA 18m).',
    ward: 'Ward 42 - Malviya Nagar',
    timeAgo: '4m ago',
    severity: 'moderate'
  },
  {
    id: 'ACT-3',
    type: 'resolved',
    message: 'Incident KR-2026-0033 marked Resolved with photo proof.',
    ward: 'Ward 12 - Mansarovar',
    timeAgo: '12m ago',
    severity: 'low'
  },
  {
    id: 'ACT-4',
    type: 'new_report',
    message: 'Citizen report KR-2026-0102 submitted in Vaishali Nagar.',
    ward: 'Ward 33 - Vaishali Nagar',
    timeAgo: '26m ago',
    severity: 'high'
  }
];
