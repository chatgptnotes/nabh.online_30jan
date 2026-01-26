import type { ObjectiveElement } from '../types/nabh';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Type for row data from Supabase
interface ObjectiveEditRow {
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
  evidence_files: unknown[] | null;
  youtube_videos: unknown[] | null;
  training_materials: unknown[] | null;
  sop_documents: unknown[] | null;
  created_at: string;
  updated_at: string;
}

/**
 * Convert base64 data URL to Blob
 */
function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Upload infographic to Supabase Storage and return the public URL
 */
async function uploadInfographicToStorage(
  objectiveCode: string,
  dataUrl: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const blob = dataURLtoBlob(dataUrl);
    const fileName = `infographics/${objectiveCode.replace(/\./g, '_')}_${Date.now()}.png`;

    // Upload to Supabase Storage
    const uploadResponse = await fetch(
      `${SUPABASE_URL}/storage/v1/object/nabh-evidence/${fileName}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': blob.type,
          'x-upsert': 'true',
        },
        body: blob,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Storage upload failed:', uploadResponse.status, errorText);
      return { success: false, error: `Upload failed: ${errorText}` };
    }

    // Get the public URL
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/nabh-evidence/${fileName}`;
    console.log('Infographic uploaded to:', publicUrl);

    return { success: true, url: publicUrl };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error uploading infographic:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Save objective edits to Supabase using direct REST API
 */
export async function saveObjectiveToSupabase(
  chapterId: string,
  objective: ObjectiveElement
): Promise<{ success: boolean; error?: string }> {
  try {
    let infographicUrl = objective.infographicDataUrl || null;

    // If we have a base64 data URL, upload to Storage first
    if (infographicUrl && infographicUrl.startsWith('data:')) {
      console.log('Uploading infographic to Supabase Storage...');
      const uploadResult = await uploadInfographicToStorage(objective.code, infographicUrl);
      if (uploadResult.success && uploadResult.url) {
        infographicUrl = uploadResult.url;
      } else {
        console.warn('Failed to upload infographic, storing without it:', uploadResult.error);
        infographicUrl = null;
      }
    }

    const editData = {
      objective_code: objective.code,
      chapter_id: chapterId,
      title: objective.title || null,
      description: objective.description || null,
      hindi_explanation: objective.hindiExplanation || null,
      evidences_list: objective.evidencesList || null,
      evidence_links: objective.evidenceLinks || null,
      status: objective.status || null,
      priority: objective.priority || null,
      assignee: objective.assignee || null,
      start_date: objective.startDate || null,
      end_date: objective.endDate || null,
      deliverable: objective.deliverable || null,
      notes: objective.notes || null,
      infographic_svg: objective.infographicSvg || null,
      infographic_data_url: infographicUrl,
      evidence_files: objective.evidenceFiles || [],
      youtube_videos: objective.youtubeVideos || [],
      training_materials: objective.trainingMaterials || [],
      sop_documents: objective.sopDocuments || [],
    };

    console.log('Saving to Supabase, payload size:', JSON.stringify(editData).length, 'bytes');

    // Use direct REST API with proper headers
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/nabh_objective_edits?on_conflict=objective_code`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify(editData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error saving to Supabase:', response.status, errorText);
      return { success: false, error: `${response.status}: ${errorText}` };
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error saving objective:', errorMessage);
    console.error('Full error:', error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Load a single objective's edits from Supabase
 */
export async function loadObjectiveFromSupabase(
  objectiveCode: string
): Promise<{
  success: boolean;
  data?: Partial<ObjectiveElement>;
  error?: string;
}> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/nabh_objective_edits?objective_code=eq.${encodeURIComponent(objectiveCode)}&limit=1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error loading from Supabase:', response.status, errorText);
      return { success: false, error: `${response.status}: ${errorText}` };
    }

    const rows = await response.json();

    if (!rows || rows.length === 0) {
      return { success: true, data: undefined };
    }

    const data = rows[0] as ObjectiveEditRow;

    const objectiveData: Partial<ObjectiveElement> = {
      title: data.title ?? undefined,
      description: data.description ?? undefined,
      hindiExplanation: data.hindi_explanation ?? undefined,
      evidencesList: data.evidences_list ?? undefined,
      evidenceLinks: data.evidence_links ?? undefined,
      status: (data.status as ObjectiveElement['status']) ?? undefined,
      priority: (data.priority as ObjectiveElement['priority']) ?? undefined,
      assignee: data.assignee ?? undefined,
      startDate: data.start_date ?? undefined,
      endDate: data.end_date ?? undefined,
      deliverable: data.deliverable ?? undefined,
      notes: data.notes ?? undefined,
      infographicSvg: data.infographic_svg ?? undefined,
      infographicDataUrl: data.infographic_data_url ?? undefined,
      evidenceFiles: (data.evidence_files as ObjectiveElement['evidenceFiles']) ?? [],
      youtubeVideos: (data.youtube_videos as ObjectiveElement['youtubeVideos']) ?? [],
      trainingMaterials: (data.training_materials as ObjectiveElement['trainingMaterials']) ?? [],
      sopDocuments: (data.sop_documents as ObjectiveElement['sopDocuments']) ?? [],
    };

    return { success: true, data: objectiveData };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error loading objective:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Load all objective edits from Supabase
 */
export async function loadAllObjectiveEditsFromSupabase(): Promise<{
  success: boolean;
  data?: Record<string, Partial<ObjectiveElement>>;
  error?: string;
}> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/nabh_objective_edits?select=*`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error loading from Supabase:', response.status, errorText);
      return { success: false, error: `${response.status}: ${errorText}` };
    }

    const rows = await response.json();
    const editsMap: Record<string, Partial<ObjectiveElement>> = {};

    if (rows) {
      for (const row of rows as ObjectiveEditRow[]) {
        editsMap[row.objective_code] = {
          title: row.title ?? undefined,
          description: row.description ?? undefined,
          hindiExplanation: row.hindi_explanation ?? undefined,
          evidencesList: row.evidences_list ?? undefined,
          evidenceLinks: row.evidence_links ?? undefined,
          status: (row.status as ObjectiveElement['status']) ?? undefined,
          priority: (row.priority as ObjectiveElement['priority']) ?? undefined,
          assignee: row.assignee ?? undefined,
          startDate: row.start_date ?? undefined,
          endDate: row.end_date ?? undefined,
          deliverable: row.deliverable ?? undefined,
          notes: row.notes ?? undefined,
          infographicSvg: row.infographic_svg ?? undefined,
          infographicDataUrl: row.infographic_data_url ?? undefined,
          evidenceFiles: (row.evidence_files as ObjectiveElement['evidenceFiles']) ?? [],
          youtubeVideos: (row.youtube_videos as ObjectiveElement['youtubeVideos']) ?? [],
          trainingMaterials: (row.training_materials as ObjectiveElement['trainingMaterials']) ?? [],
          sopDocuments: (row.sop_documents as ObjectiveElement['sopDocuments']) ?? [],
        };
      }
    }

    return { success: true, data: editsMap };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error loading objectives:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Delete an objective's edits from Supabase
 */
export async function deleteObjectiveFromSupabase(
  objectiveCode: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/nabh_objective_edits?objective_code=eq.${encodeURIComponent(objectiveCode)}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error deleting from Supabase:', response.status, errorText);
      return { success: false, error: `${response.status}: ${errorText}` };
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting objective:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

// ============================================
// Generated Evidence Storage Functions
// ============================================

// Type for generated evidence
export interface GeneratedEvidence {
  id: string;
  objective_code: string;
  evidence_title: string;
  prompt: string;
  generated_content: string;
  html_content: string;
  evidence_type: 'document' | 'visual' | 'custom' | 'register';
  hospital_config: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    qualityCoordinator: string;
    qualityCoordinatorDesignation: string;
  };
  created_at: string;
}

/**
 * Save a generated evidence document to Supabase
 */
export async function saveGeneratedEvidence(
  evidence: Omit<GeneratedEvidence, 'id' | 'created_at'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/nabh_ai_generated_evidence`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          objective_code: evidence.objective_code,
          evidence_title: evidence.evidence_title,
          prompt: evidence.prompt,
          generated_content: evidence.generated_content,
          html_content: evidence.html_content,
          evidence_type: evidence.evidence_type,
          hospital_config: evidence.hospital_config,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error saving evidence to Supabase:', response.status, errorText);
      return { success: false, error: `${response.status}: ${errorText}` };
    }

    const data = await response.json();
    const savedId = data[0]?.id;

    return { success: true, id: savedId };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error saving evidence:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Update an existing generated evidence document
 */
export async function updateGeneratedEvidence(
  id: string,
  updates: Partial<Omit<GeneratedEvidence, 'id' | 'created_at'>>
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/nabh_ai_generated_evidence?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error updating evidence:', response.status, errorText);
      return { success: false, error: `${response.status}: ${errorText}` };
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating evidence:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Load all generated evidences for a specific objective
 */
export async function loadGeneratedEvidences(
  objectiveCode: string
): Promise<{ success: boolean; data?: GeneratedEvidence[]; error?: string }> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/nabh_ai_generated_evidence?objective_code=eq.${encodeURIComponent(objectiveCode)}&order=created_at.desc`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error loading evidences:', response.status, errorText);
      return { success: false, error: `${response.status}: ${errorText}` };
    }

    const data = await response.json();
    return { success: true, data: data as GeneratedEvidence[] };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error loading evidences:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Load a single generated evidence by ID (for sharing)
 */
export async function loadEvidenceById(
  id: string
): Promise<{ success: boolean; data?: GeneratedEvidence; error?: string }> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/nabh_ai_generated_evidence?id=eq.${id}&limit=1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error loading evidence:', response.status, errorText);
      return { success: false, error: `${response.status}: ${errorText}` };
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      return { success: false, error: 'Evidence not found' };
    }

    return { success: true, data: data[0] as GeneratedEvidence };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error loading evidence:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Delete a generated evidence document
 */
export async function deleteGeneratedEvidence(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/nabh_ai_generated_evidence?id=eq.${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error deleting evidence:', response.status, errorText);
      return { success: false, error: `${response.status}: ${errorText}` };
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting evidence:', errorMessage);
    return { success: false, error: errorMessage };
  }
}
