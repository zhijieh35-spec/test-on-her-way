
export enum PuzzleType {
  EXPERIENCE = 'EXPERIENCE', // Blue #9FD2E3
  DIFFICULTY = 'DIFFICULTY', // Red/Orange #F36223
  GOAL = 'GOAL',       // Yellow #FDD140
  LOCKED = 'LOCKED'
}

export interface PuzzleAuthor {
  name: string;
  avatar: string;
}

export interface PuzzleData {
  id: string;
  date: string;
  title: string;
  description: string;
  type: PuzzleType;
  rotation?: number; // Visual rotation in degrees
  shapeVariant?: 1 | 2 | 3 | 4; // Which SVG path to use
  x?: number; // For the map view
  y?: number; // For the map view
  author?: PuzzleAuthor;
}

export enum ViewMode {
  REGISTRATION = 'REGISTRATION',
  LANDING = 'LANDING',
  ONBOARDING = 'ONBOARDING',
  MY_MAP = 'MY_MAP',
  COMMUNITY = 'COMMUNITY',
  INSIGHT_SUMMARY = 'INSIGHT_SUMMARY',
  THEIR_MAP = 'THEIR_MAP'
}

export enum CommunityTab {
  EXPERIENCE = 'EXPERIENCE',
  DIFFICULTY = 'DIFFICULTY',
  GOAL = 'GOAL'
}

export type MyMapSubView = 'map' | 'plan' | 'resources' | 'network';

export interface User {
  id: string;
  nickname: string;
  account: string;
  password: string;
  avatar: string;
}

// Onboarding types (compatible with my-app backend)
export interface LifeExperience {
  id: string;
  title: string;
  description: string;
  year: string;
}

export interface PublicProfile {
  id: string;
  name: string;
  avatar: string;
  tags: {
    role_detail: string;
    location: string;
    experience: string;
    hassle: string;
    goal: string;
  };
  lifeTimeline: LifeExperience[];
}

// API interfaces (for future backend integration)
export interface RegisterRequest {
  nickname: string;
  account: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  userId?: string;
  error?: string;
}

export interface ChatRequest {
  userId: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
}

export interface ChatResponse {
  content: string;
  profile?: PublicProfile;
}

export interface LoginRequest {
  account: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}
