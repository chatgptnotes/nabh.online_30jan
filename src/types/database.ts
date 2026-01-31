export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      nabh_chapters: {
        Row: {
          id: string;
          chapter_number: number;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          chapter_number: number;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          chapter_number?: number;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      nabh_standards: {
        Row: {
          id: string;
          chapter_id: string;
          standard_number: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          chapter_id: string;
          standard_number: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          chapter_id?: string;
          standard_number?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      nabh_objective_elements: {
        Row: {
          id: string;
          standard_id: string;
          element_number: string;
          description: string;
          hindi_explanation: string | null;
          interpretation: string | null;
          is_core: boolean;
          status: 'Not Started' | 'In Progress' | 'Completed' | 'Not Applicable';
          assignee: string | null;
          evidence_links: string | null;
          youtube_videos: Json | null;
          notes: string | null;
          infographic_svg: string | null;
          infographic_data_url: string | null;
          infographic_created_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          standard_id: string;
          element_number: string;
          description: string;
          hindi_explanation?: string | null;
          interpretation?: string | null;
          is_core?: boolean;
          status?: 'Not Started' | 'In Progress' | 'Completed' | 'Not Applicable';
          assignee?: string | null;
          evidence_links?: string | null;
          youtube_videos?: Json | null;
          notes?: string | null;
          infographic_svg?: string | null;
          infographic_data_url?: string | null;
          infographic_created_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          standard_id?: string;
          element_number?: string;
          description?: string;
          hindi_explanation?: string | null;
          interpretation?: string | null;
          is_core?: boolean;
          status?: 'Not Started' | 'In Progress' | 'Completed' | 'Not Applicable';
          assignee?: string | null;
          evidence_links?: string | null;
          youtube_videos?: Json | null;
          notes?: string | null;
          infographic_svg?: string | null;
          infographic_data_url?: string | null;
          infographic_created_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      nabh_evidence_files: {
        Row: {
          id: string;
          element_id: string;
          file_name: string;
          file_type: 'image' | 'pdf';
          file_size: number;
          file_url: string;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          element_id: string;
          file_name: string;
          file_type: 'image' | 'pdf';
          file_size: number;
          file_url: string;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          element_id?: string;
          file_name?: string;
          file_type?: 'image' | 'pdf';
          file_size?: number;
          file_url?: string;
          uploaded_by?: string | null;
          created_at?: string;
        };
      };
      nabh_ai_generated_evidence: {
        Row: {
          id: string;
          element_id: string | null;
          prompt: string;
          generated_content: string;
          evidence_type: 'document' | 'visual';
          visual_type: string | null;
          image_url: string | null;
          language: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          element_id?: string | null;
          prompt: string;
          generated_content: string;
          evidence_type: 'document' | 'visual';
          visual_type?: string | null;
          image_url?: string | null;
          language?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          element_id?: string | null;
          prompt?: string;
          generated_content?: string;
          evidence_type?: 'document' | 'visual';
          visual_type?: string | null;
          image_url?: string | null;
          language?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
      };
      nabh_team_members: {
        Row: {
          id: string;
          name: string;
          role: string;
          designation: string;
          department: string;
          responsibilities: string[] | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: string;
          designation: string;
          department: string;
          responsibilities?: string[] | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          designation?: string;
          department?: string;
          responsibilities?: string[] | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      nabh_audit_log: {
        Row: {
          id: string;
          table_name: string;
          record_id: string;
          action: 'INSERT' | 'UPDATE' | 'DELETE';
          old_data: Json | null;
          new_data: Json | null;
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          table_name: string;
          record_id: string;
          action: 'INSERT' | 'UPDATE' | 'DELETE';
          old_data?: Json | null;
          new_data?: Json | null;
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          table_name?: string;
          record_id?: string;
          action?: 'INSERT' | 'UPDATE' | 'DELETE';
          old_data?: Json | null;
          new_data?: Json | null;
          user_id?: string | null;
          created_at?: string;
        };
      };
      nabh_infographics: {
        Row: {
          id: string;
          element_id: string;
          svg_content: string;
          data_url: string | null;
          language: 'english' | 'hindi' | 'bilingual';
          version: number;
          is_current: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          element_id: string;
          svg_content: string;
          data_url?: string | null;
          language?: 'english' | 'hindi' | 'bilingual';
          version?: number;
          is_current?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          element_id?: string;
          svg_content?: string;
          data_url?: string | null;
          language?: 'english' | 'hindi' | 'bilingual';
          version?: number;
          is_current?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
      };
      nabh_objective_edits: {
        Row: {
          id: string;
          objective_code: string;
          chapter_id: string;
          title: string | null;
          description: string | null;
          hindi_explanation: string | null;
          evidences_list: string | null;
          evidence_links: string | null;
          status: string | null;
          priority: string | null;
          assignee: string | null;
          start_date: string | null;
          end_date: string | null;
          deliverable: string | null;
          notes: string | null;
          infographic_svg: string | null;
          infographic_data_url: string | null;
          evidence_files: Json | null;
          youtube_videos: Json | null;
          training_materials: Json | null;
          sop_documents: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          objective_code: string;
          chapter_id: string;
          title?: string | null;
          description?: string | null;
          hindi_explanation?: string | null;
          evidences_list?: string | null;
          evidence_links?: string | null;
          status?: string | null;
          priority?: string | null;
          assignee?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          deliverable?: string | null;
          notes?: string | null;
          infographic_svg?: string | null;
          infographic_data_url?: string | null;
          evidence_files?: Json | null;
          youtube_videos?: Json | null;
          training_materials?: Json | null;
          sop_documents?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          objective_code?: string;
          chapter_id?: string;
          title?: string | null;
          description?: string | null;
          hindi_explanation?: string | null;
          evidences_list?: string | null;
          evidence_links?: string | null;
          status?: string | null;
          priority?: string | null;
          assignee?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          deliverable?: string | null;
          notes?: string | null;
          infographic_svg?: string | null;
          infographic_data_url?: string | null;
          evidence_files?: Json | null;
          youtube_videos?: Json | null;
          training_materials?: Json | null;
          sop_documents?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      nabh_patients: {
        Row: {
          id: string;
          sr_no: number | null;
          visit_id: string;
          patient_name: string;
          diagnosis: string | null;
          admission_date: string | null;
          discharge_date: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sr_no?: number | null;
          visit_id: string;
          patient_name: string;
          diagnosis?: string | null;
          admission_date?: string | null;
          discharge_date?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sr_no?: number | null;
          visit_id?: string;
          patient_name?: string;
          diagnosis?: string | null;
          admission_date?: string | null;
          discharge_date?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
