export type Priority = 'CORE' | 'Prev NC' | 'P0' | 'P1' | 'P2' | 'P3' | '';
export type Status = 'Not started' | 'In progress' | 'Blocked' | 'Completed' | '';
export type ElementCategory = 'Core' | 'Commitment' | 'Achievement' | 'Excellence';
export type ChapterType = 'Patient Centered' | 'Organization Centered';

export interface EvidenceFile {
  id: string;
  name: string;
  type: 'image' | 'pdf';
  size: number;
  dataUrl: string;              // Base64 data URL for local storage
  uploadedAt: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  url: string;
  description?: string;
  addedBy?: string;
  addedAt?: string;
}

export interface TrainingMaterial {
  id: string;
  type: 'video' | 'photo' | 'document' | 'certificate';
  title: string;
  description?: string;
  fileUrl?: string;
  dataUrl?: string;              // Base64 for locally stored files
  thumbnailUrl?: string;
  uploadedBy: string;
  uploadedAt: string;
  trainingDate?: string;
  participants?: string[];
}

export interface ObjectiveElement {
  id: string;
  code: string;
  title: string;
  description: string;          // NABH SHCO 3rd Edition description
  hindiExplanation: string;     // Hindi explanation for staff
  category: ElementCategory;    // Core, Commitment, Achievement, Excellence
  isCore: boolean;              // Quick check for core elements
  evidencesList: string;
  evidenceLinks: string;
  evidenceFiles: EvidenceFile[]; // Uploaded evidence files (images, PDFs)
  youtubeVideos: YouTubeVideo[]; // YouTube training videos
  trainingMaterials: TrainingMaterial[]; // Internal training evidence
  priority: Priority;
  assignee: string;
  status: Status;
  startDate: string;
  endDate: string;
  deliverable: string;
  notes: string;
}

export interface Standard {
  code: string;
  title: string;
  intent?: string;
}

export interface Chapter {
  id: string;
  code: string;
  name: string;
  fullName: string;
  type: ChapterType;
  objectives: ObjectiveElement[];
}

export interface NABHData {
  chapters: Chapter[];
  lastUpdated: string;
}

export const CHAPTER_NAMES: Record<string, string> = {
  AAC: 'Access, Assessment and Continuity of Care',
  COP: 'Care of Patients',
  MOM: 'Management of Medication',
  PRE: 'Patient Rights and Education',
  HIC: 'Hospital Infection Control',
  CQI: 'Continuous Quality Improvement',  // SHCO uses CQI instead of PSQ
  PSQ: 'Patient Safety and Quality Improvement',
  ROM: 'Responsibilities of Management',
  FMS: 'Facility Management and Safety',
  HRM: 'Human Resource Management',
  IMS: 'Information Management System',
};

export const CHAPTER_TYPES: Record<string, ChapterType> = {
  AAC: 'Patient Centered',
  COP: 'Patient Centered',
  MOM: 'Patient Centered',
  PRE: 'Patient Centered',
  HIC: 'Patient Centered',
  CQI: 'Organization Centered',
  PSQ: 'Organization Centered',
  ROM: 'Organization Centered',
  FMS: 'Organization Centered',
  HRM: 'Organization Centered',
  IMS: 'Organization Centered',
};
