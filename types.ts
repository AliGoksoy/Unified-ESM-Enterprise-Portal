
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  TICKET_LIST = 'TICKET_LIST',
  TICKET_DETAIL = 'TICKET_DETAIL',
  DEPARTMENTS_LIST = 'DEPARTMENTS_LIST',
  DEPT_HR = 'DEPT_HR',
  DEPT_PROCUREMENT = 'DEPT_PROCUREMENT',
  DEPT_IT = 'DEPT_IT',
  DEPT_FINANCE = 'DEPT_FINANCE',
  DEPT_OPERATIONS = 'DEPT_OPERATIONS',
  DEPT_LEGAL = 'DEPT_LEGAL',
  DEPT_MARKETING = 'DEPT_MARKETING',
  GENERIC_REQUEST = 'GENERIC_REQUEST',
  ADMIN_SETTINGS = 'ADMIN_SETTINGS',
  APP_INTEGRATIONS = 'APP_INTEGRATIONS',
  SETTINGS = 'SETTINGS', // New View
  REPORTS = 'REPORTS',
  USER_PROFILE = 'USER_PROFILE',
  CONNECT = 'CONNECT',
  MESSAGES = 'MESSAGES',
  INBOX = 'INBOX'
}

export type FormType = 'GENERAL' | 'HARDWARE' | 'SOFTWARE' | 'ACCESS' | 'DATE_RANGE' | 'FINANCE' | 'SECURITY';
export type TicketStatus = 'Open' | 'In Progress' | 'Pending Approval' | 'Resolved' | 'Closed';
export type TicketPriority = 'High' | 'Medium' | 'Low';

// --- INTEGRATION TYPES ---
export interface IntegrationApp {
  id: string;
  name: string;
  description: string;
  category: 'Communication' | 'Development' | 'HR' | 'Finance' | 'Productivity';
  logo: string; // Icon name or image URL
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  isInstalled: boolean;
  config?: {
    apiKey?: string;
    webhookUrl?: string;
    syncFrequency?: string;
  };
}

// --- IDENTITY / ACTIVE DIRECTORY TYPES ---
export type IdentityType = 'USER' | 'GROUP';

export interface IdentityEntity {
  id: string;
  displayName: string;
  type: IdentityType;
  email?: string; // Only for Users
  title?: string; // Job Title for Users
  department?: string;
  avatar?: string; // Initials or Icon
  memberCount?: number; // Only for Groups
}

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  // Instead of static user IDs, we store references to Identity Entities (User IDs or AD Group IDs)
  members: string[]; 
  managerId?: string; // Optional: The lead of this specific resolution group
}

export interface TicketLog {
  id: string;
  type: 'message' | 'system' | 'approval';
  user?: string;
  avatar?: string;
  message: string;
  timestamp: string;
  isInternal?: boolean;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  requester: string;
  requesterAvatar?: string;
  department: string;
  category: string;
  assignedTo?: string; // Support agent name
  createdDate: string;
  slaDue?: string; // ISO date string
  logs: TicketLog[];
}

export interface ServiceCategory {
  id: string;
  title: string;
  description?: string;
  icon: string; // Material symbol name
  formType: FormType;
  assignedGroupId?: string; // The specific resolution team (e.g., Network Team)
  sla?: string; // Target resolution time (e.g., "4 Saat", "2 Gün")
  isActive?: boolean;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  categories: ServiceCategory[];
  isActive?: boolean;
  viewState?: ViewState; // Link to the portal view
  managerId?: string; // Link to Identity User
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string; // HTML or Markdown content
  tags: string[];
  likes: number;
  views: number;
}

export interface Asset {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  type: 'HARDWARE' | 'SOFTWARE' | 'ACCESSORY';
  status: 'ACTIVE' | 'REPAIR' | 'RETIRED';
  assignedDate: string;
  warrantyEnd: string;
  icon: string;
}
