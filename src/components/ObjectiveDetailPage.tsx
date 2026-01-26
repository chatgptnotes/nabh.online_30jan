import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Tooltip from '@mui/material/Tooltip';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Snackbar from '@mui/material/Snackbar';
import { useNABHStore } from '../store/nabhStore';
import type { Status, Priority, ElementCategory, EvidenceFile, YouTubeVideo, TrainingMaterial, SOPDocument } from '../types/nabh';
import { ASSIGNEE_OPTIONS, HOSPITAL_INFO, getNABHCoordinator } from '../config/hospitalConfig';
import { getClaudeApiKey, getGeminiApiKey } from '../lib/supabase';
import {
  saveObjectiveToSupabase,
  loadObjectiveFromSupabase,
  saveGeneratedEvidence,
  updateGeneratedEvidence,
  loadGeneratedEvidences,
  deleteGeneratedEvidence,
  type GeneratedEvidence,
} from '../services/objectiveStorage';

// Expandable TextField styles
const expandableTextFieldSx = {
  '& .MuiInputBase-root': {
    resize: 'vertical',
    overflow: 'auto',
    minHeight: '80px',
  },
  '& .MuiInputBase-inputMultiline': {
    resize: 'vertical',
    overflow: 'auto !important',
  },
};

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export default function ObjectiveDetailPage() {
  const { chapterId, objectiveId } = useParams<{ chapterId: string; objectiveId: string }>();
  const navigate = useNavigate();
  const { chapters, updateObjective, setSelectedChapter } = useNABHStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const trainingFileInputRef = useRef<HTMLInputElement>(null);
  const sopFileInputRef = useRef<HTMLInputElement>(null);

  // State for adding YouTube video
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoDescription, setNewVideoDescription] = useState('');

  // State for adding training material
  const [showAddTraining, setShowAddTraining] = useState(false);
  const [newTrainingTitle, setNewTrainingTitle] = useState('');
  const [newTrainingDescription, setNewTrainingDescription] = useState('');
  const [newTrainingType, setNewTrainingType] = useState<'video' | 'photo' | 'document' | 'certificate'>('photo');
  const [newTrainingDate, setNewTrainingDate] = useState('');

  // State for SOP management
  const [showAddSOP, setShowAddSOP] = useState(false);
  const [newSOPTitle, setNewSOPTitle] = useState('');
  const [newSOPVersion, setNewSOPVersion] = useState('1.0');
  const [newSOPEffectiveDate, setNewSOPEffectiveDate] = useState('');
  const [newSOPDescription, setNewSOPDescription] = useState('');
  const [isGeneratingSOP, setIsGeneratingSOP] = useState(false);
  const [generatedSOPContent, setGeneratedSOPContent] = useState('');

  // State for Evidence Generator
  const [isGeneratingEvidence, setIsGeneratingEvidence] = useState(false);
  const [generatedEvidenceList, setGeneratedEvidenceList] = useState<string[]>([]);
  const [isGeneratingHindi, setIsGeneratingHindi] = useState(false);

  // State for Infographic Generator
  const [isGeneratingInfographic, setIsGeneratingInfographic] = useState(false);
  const [generatedInfographicSvg, setGeneratedInfographicSvg] = useState<string>('');
  const [infographicSaveStatus, setInfographicSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // State for Supabase persistence
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isLoadingFromDb, setIsLoadingFromDb] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // State for Evidence Document Generator
  interface ParsedEvidenceItem {
    id: string;
    text: string;
    selected: boolean;
  }
  const [parsedEvidenceItems, setParsedEvidenceItems] = useState<ParsedEvidenceItem[]>([]);
  const [isGeneratingDocuments, setIsGeneratingDocuments] = useState(false);
  const [documentGenerationProgress, setDocumentGenerationProgress] = useState({ current: 0, total: 0 });
  const [savedEvidences, setSavedEvidences] = useState<GeneratedEvidence[]>([]);
  const [isLoadingEvidences, setIsLoadingEvidences] = useState(false);
  const [evidenceViewModes, setEvidenceViewModes] = useState<Record<string, number>>({});
  const [editingEvidenceContent, setEditingEvidenceContent] = useState<Record<string, string>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // State for custom prompt-based evidence generation
  const [customEvidencePrompt, setCustomEvidencePrompt] = useState('');
  const [isGeneratingCustomEvidence, setIsGeneratingCustomEvidence] = useState(false);

  // State for registers section
  interface RegisterItem {
    id: string;
    name: string;
    description: string;
    htmlContent: string;
    isGenerated: boolean;
  }
  const [suggestedRegisters, setSuggestedRegisters] = useState<RegisterItem[]>([]);
  const [selectedRegisters, setSelectedRegisters] = useState<string[]>([]);
  const [isGeneratingRegisters, setIsGeneratingRegisters] = useState(false);

  // Hospital config for evidence generation
  const nabhCoordinator = getNABHCoordinator();
  const hospitalConfig = {
    name: HOSPITAL_INFO.name,
    address: HOSPITAL_INFO.address,
    phone: HOSPITAL_INFO.phone,
    email: HOSPITAL_INFO.email,
    website: HOSPITAL_INFO.website,
    qualityCoordinator: nabhCoordinator.name,
    qualityCoordinatorDesignation: nabhCoordinator.designation,
  };

  // Find chapter and objective
  const chapter = chapters.find((c) => c.id === chapterId);
  const objective = chapter?.objectives.find((o) => o.id === objectiveId);

  // Set selected chapter when page loads
  useEffect(() => {
    if (chapterId) {
      setSelectedChapter(chapterId);
    }
  }, [chapterId, setSelectedChapter]);

  // Load data from Supabase when page loads
  useEffect(() => {
    const loadFromSupabase = async () => {
      if (!objective?.code) return;

      setIsLoadingFromDb(true);
      try {
        const result = await loadObjectiveFromSupabase(objective.code);
        if (result.success && result.data && chapter) {
          // Merge Supabase data with local state
          const updates: Partial<typeof objective> = {};

          if (result.data.description) updates.description = result.data.description;
          if (result.data.hindiExplanation) updates.hindiExplanation = result.data.hindiExplanation;
          if (result.data.title) updates.title = result.data.title;
          if (result.data.evidencesList) updates.evidencesList = result.data.evidencesList;
          if (result.data.evidenceLinks) updates.evidenceLinks = result.data.evidenceLinks;
          if (result.data.status) updates.status = result.data.status;
          if (result.data.priority) updates.priority = result.data.priority;
          if (result.data.assignee) updates.assignee = result.data.assignee;
          if (result.data.startDate) updates.startDate = result.data.startDate;
          if (result.data.endDate) updates.endDate = result.data.endDate;
          if (result.data.deliverable) updates.deliverable = result.data.deliverable;
          if (result.data.notes) updates.notes = result.data.notes;
          if (result.data.infographicSvg) updates.infographicSvg = result.data.infographicSvg;
          if (result.data.infographicDataUrl) updates.infographicDataUrl = result.data.infographicDataUrl;
          if (result.data.evidenceFiles?.length) updates.evidenceFiles = result.data.evidenceFiles;
          if (result.data.youtubeVideos?.length) updates.youtubeVideos = result.data.youtubeVideos;
          if (result.data.trainingMaterials?.length) updates.trainingMaterials = result.data.trainingMaterials;
          if (result.data.sopDocuments?.length) updates.sopDocuments = result.data.sopDocuments;

          if (Object.keys(updates).length > 0) {
            updateObjective(chapter.id, objective.id, updates);
          }
        }
      } catch (error) {
        console.warn('Could not load from Supabase:', error);
      } finally {
        setIsLoadingFromDb(false);
      }
    };

    loadFromSupabase();
  }, [objective?.code]); // Only reload when objective code changes

  // Parse evidence list into checkable items when evidencesList changes
  useEffect(() => {
    if (!objective?.evidencesList) {
      setParsedEvidenceItems([]);
      return;
    }

    const lines = objective.evidencesList.split('\n').filter(line => line.trim());
    const items: ParsedEvidenceItem[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      // Match lines that start with numbers, bullets, or dashes
      if (trimmed.match(/^(\d+[.):]|-|\*|•)/)) {
        items.push({
          id: `evidence-item-${index}`,
          text: trimmed,
          selected: false,
        });
      }
    });

    setParsedEvidenceItems(items);
  }, [objective?.evidencesList]);

  // Load saved evidences when objective changes
  useEffect(() => {
    const loadSavedEvidences = async () => {
      if (!objective?.code) return;

      setIsLoadingEvidences(true);
      try {
        const result = await loadGeneratedEvidences(objective.code);
        if (result.success && result.data) {
          setSavedEvidences(result.data);
        }
      } catch (error) {
        console.warn('Could not load saved evidences:', error);
      } finally {
        setIsLoadingEvidences(false);
      }
    };

    loadSavedEvidences();
  }, [objective?.code]);

  if (!chapter || !objective) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Icon sx={{ fontSize: 64, color: 'text.disabled' }}>error_outline</Icon>
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          Objective not found
        </Typography>
        <Button
          variant="contained"
          startIcon={<Icon>arrow_back</Icon>}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  // Save current objective to Supabase
  const saveToSupabase = async (updatedObjective: typeof objective) => {
    if (!chapter || !updatedObjective) return;

    setSaveStatus('saving');
    try {
      const result = await saveObjectiveToSupabase(chapter.id, updatedObjective);
      if (result.success) {
        setSaveStatus('saved');
        setLastSaved(new Date());
        // Reset status after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        console.error('Failed to save to Supabase:', result.error);
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      setSaveStatus('error');
    }
  };

  // Debounced save to Supabase
  const debouncedSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleFieldChange = (field: string, value: string | Status | Priority | ElementCategory) => {
    // Update local store immediately
    updateObjective(chapter.id, objective.id, { [field]: value });

    // Debounce Supabase save (save after 1 second of no changes)
    if (debouncedSaveRef.current) {
      clearTimeout(debouncedSaveRef.current);
    }

    debouncedSaveRef.current = setTimeout(() => {
      // Get the updated objective from store
      const updatedChapter = chapters.find((c) => c.id === chapter.id);
      const updatedObjective = updatedChapter?.objectives.find((o) => o.id === objective.id);
      if (updatedObjective) {
        saveToSupabase({ ...updatedObjective, [field]: value });
      }
    }, 1000);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: EvidenceFile[] = await Promise.all(
      Array.from(files).map(async (file) => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' as const : 'pdf' as const,
        size: file.size,
        dataUrl: await fileToBase64(file),
        uploadedAt: new Date().toISOString(),
      }))
    );

    const existingFiles = objective.evidenceFiles || [];
    const updatedFiles = [...existingFiles, ...newFiles];
    updateObjective(chapter.id, objective.id, {
      evidenceFiles: updatedFiles,
    });

    // Save to Supabase
    saveToSupabase({ ...objective, evidenceFiles: updatedFiles });
  };

  const handleRemoveFile = (fileId: string) => {
    const existingFiles = objective.evidenceFiles || [];
    const updatedFiles = existingFiles.filter((f) => f.id !== fileId);
    updateObjective(chapter.id, objective.id, {
      evidenceFiles: updatedFiles,
    });

    // Save to Supabase
    saveToSupabase({ ...objective, evidenceFiles: updatedFiles });
  };

  // YouTube Video functions
  const handleAddVideo = () => {
    if (!newVideoTitle.trim() || !newVideoUrl.trim()) return;

    const newVideo: YouTubeVideo = {
      id: `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: newVideoTitle.trim(),
      url: newVideoUrl.trim(),
      description: newVideoDescription.trim(),
      addedBy: 'Current User',
      addedAt: new Date().toISOString(),
    };

    const existingVideos = objective.youtubeVideos || [];
    const updatedVideos = [...existingVideos, newVideo];
    updateObjective(chapter.id, objective.id, {
      youtubeVideos: updatedVideos,
    });

    // Save to Supabase
    saveToSupabase({ ...objective, youtubeVideos: updatedVideos });

    setNewVideoTitle('');
    setNewVideoUrl('');
    setNewVideoDescription('');
    setShowAddVideo(false);
  };

  const handleRemoveVideo = (videoId: string) => {
    const existingVideos = objective.youtubeVideos || [];
    const updatedVideos = existingVideos.filter((v) => v.id !== videoId);
    updateObjective(chapter.id, objective.id, {
      youtubeVideos: updatedVideos,
    });

    // Save to Supabase
    saveToSupabase({ ...objective, youtubeVideos: updatedVideos });
  };

  // Training Material functions
  const handleTrainingFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !files[0]) return;

    const file = files[0];
    const newMaterial: TrainingMaterial = {
      id: `training-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: newTrainingTitle.trim() || file.name,
      type: newTrainingType,
      dataUrl: await fileToBase64(file),
      description: newTrainingDescription.trim(),
      trainingDate: newTrainingDate,
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString(),
    };

    const existingMaterials = objective.trainingMaterials || [];
    const updatedMaterials = [...existingMaterials, newMaterial];
    updateObjective(chapter.id, objective.id, {
      trainingMaterials: updatedMaterials,
    });

    // Save to Supabase
    saveToSupabase({ ...objective, trainingMaterials: updatedMaterials });

    setNewTrainingTitle('');
    setNewTrainingDescription('');
    setNewTrainingDate('');
    setShowAddTraining(false);
  };

  const handleRemoveTrainingMaterial = (materialId: string) => {
    const existingMaterials = objective.trainingMaterials || [];
    const updatedMaterials = existingMaterials.filter((m) => m.id !== materialId);
    updateObjective(chapter.id, objective.id, {
      trainingMaterials: updatedMaterials,
    });

    // Save to Supabase
    saveToSupabase({ ...objective, trainingMaterials: updatedMaterials });
  };

  // SOP functions
  const handleSOPFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !files[0]) return;

    const file = files[0];
    const fileType = file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.docx') ? 'docx' : 'doc';

    const newSOP: SOPDocument = {
      id: `sop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: newSOPTitle.trim() || file.name,
      fileName: file.name,
      fileType: fileType as 'pdf' | 'doc' | 'docx',
      fileSize: file.size,
      dataUrl: await fileToBase64(file),
      version: newSOPVersion,
      effectiveDate: newSOPEffectiveDate,
      description: newSOPDescription.trim(),
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString(),
    };

    const existingSOPs = objective.sopDocuments || [];
    const updatedSOPs = [...existingSOPs, newSOP];
    updateObjective(chapter.id, objective.id, {
      sopDocuments: updatedSOPs,
    });

    // Save to Supabase
    saveToSupabase({ ...objective, sopDocuments: updatedSOPs });

    setNewSOPTitle('');
    setNewSOPVersion('1.0');
    setNewSOPEffectiveDate('');
    setNewSOPDescription('');
    setShowAddSOP(false);
  };

  const handleRemoveSOP = (sopId: string) => {
    const existingSOPs = objective.sopDocuments || [];
    const updatedSOPs = existingSOPs.filter((s) => s.id !== sopId);
    updateObjective(chapter.id, objective.id, {
      sopDocuments: updatedSOPs,
    });

    // Save to Supabase
    saveToSupabase({ ...objective, sopDocuments: updatedSOPs });
  };

  // Generate SOP
  const handleGenerateSOP = async () => {
    setIsGeneratingSOP(true);
    setGeneratedSOPContent('');

    try {
      const apiKey = await getClaudeApiKey();
      if (!apiKey) {
        throw new Error('API key not configured');
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          messages: [
            {
              role: 'user',
              content: `Generate a Standard Operating Procedure (SOP) document for NABH accreditation compliance.

Objective Code: ${objective.code}
Objective Title: ${objective.description}
Category: ${objective.category}
Hospital Name: ${HOSPITAL_INFO.name}

Generate a comprehensive SOP that includes:
1. Purpose and Scope
2. Definitions
3. Responsibilities
4. Procedure Steps (detailed, numbered)
5. Documentation Requirements
6. Quality Indicators
7. References

Format it professionally with clear sections and bullet points.`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate SOP');
      }

      const data = await response.json();
      const content = data.content[0]?.text || 'Failed to generate SOP';
      setGeneratedSOPContent(content);
    } catch (error) {
      console.error('Error generating SOP:', error);
      setGeneratedSOPContent('Error generating SOP. Please check your API key configuration.');
    } finally {
      setIsGeneratingSOP(false);
    }
  };

  const getYouTubeThumbnail = (url: string): string => {
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/)?.[1];
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '';
  };

  // Generate Evidence List based on interpretation
  const handleGenerateEvidenceList = async () => {
    setIsGeneratingEvidence(true);
    setGeneratedEvidenceList([]);

    try {
      const apiKey = await getClaudeApiKey();
      if (!apiKey) {
        throw new Error('API key not configured');
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2048,
          messages: [
            {
              role: 'user',
              content: `For the following NABH accreditation objective element, generate a prioritized list of exactly 10 evidences that would be required to demonstrate compliance. List them in order of importance (most important first).

Objective Code: ${objective.code}
Interpretation: ${objective.description}
Category: ${objective.category}
${objective.isCore ? 'This is a CORE element which is mandatorily assessed.' : ''}

Format your response as a numbered list (1-10) with each evidence item on a new line. Be specific about the type of document, record, or proof needed. Start directly with the list, no introduction.`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate evidence list');
      }

      const data = await response.json();
      const content = data.content[0]?.text || '';

      // Parse the numbered list
      const evidenceItems = content
        .split('\n')
        .filter((line: string) => line.trim().match(/^\d+\.\s/))
        .map((line: string) => line.trim().replace(/^\d+\.\s*/, ''))
        .slice(0, 10);

      setGeneratedEvidenceList(evidenceItems);

      // Auto-populate the evidencesList field
      if (evidenceItems.length > 0) {
        const formattedList = evidenceItems.map((item: string, idx: number) => `${idx + 1}. ${item}`).join('\n');
        handleFieldChange('evidencesList', formattedList);
      }
    } catch (error) {
      console.error('Error generating evidence list:', error);
      setGeneratedEvidenceList(['Error generating evidence list. Please check your API key configuration.']);
    } finally {
      setIsGeneratingEvidence(false);
    }
  };

  // Toggle evidence item selection
  const handleToggleEvidenceItem = (id: string) => {
    setParsedEvidenceItems(items =>
      items.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Select/deselect all evidence items
  const handleSelectAllEvidenceItems = () => {
    const allSelected = parsedEvidenceItems.every(item => item.selected);
    setParsedEvidenceItems(items =>
      items.map(item => ({ ...item, selected: !allSelected }))
    );
  };

  // Get formatted dates
  const getFormattedDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Document dates should be 9 months prior to current date (for NABH audit compliance)
  const today = new Date();
  const documentDate = new Date(today.getFullYear(), today.getMonth() - 9, today.getDate());
  const effectiveDate = getFormattedDate(documentDate);
  const reviewDate = getFormattedDate(new Date(documentDate.getFullYear() + 1, documentDate.getMonth(), documentDate.getDate()));

  // Logo URL - use production URL for generated documents stored in database
  const logoUrl = window.location.hostname === 'localhost'
    ? `${window.location.origin}/hospital-logo.png`
    : 'https://www.nabh.online/hospital-logo.png';

  // Get the HTML template for evidence documents
  const getEvidenceDocumentPrompt = () => `You are an expert in NABH (National Accreditation Board for Hospitals and Healthcare Providers) accreditation documentation for Hope Hospital.

Generate a complete HTML document for the selected evidence item in ENGLISH ONLY (internal document).

IMPORTANT: Generate the output as a complete, valid HTML document with embedded CSS styling. The document must be modern, professional, and print-ready.

Use EXACTLY this HTML template structure (fill in the content sections):

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>[Document Title] - Hope Hospital</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; line-height: 1.6; color: #333; padding: 20px; max-width: 800px; margin: 0 auto; }
    .header { text-align: center; border-bottom: 3px solid #1565C0; padding-bottom: 10px; margin-bottom: 20px; }
    .logo { width: 180px; height: auto; margin: 0 auto 5px; display: block; }
    .hospital-address { font-size: 11px; color: #666; }
    .doc-title { background: linear-gradient(135deg, #1565C0, #0D47A1); color: white; padding: 12px; font-size: 16px; font-weight: bold; text-align: center; margin: 20px 0; border-radius: 5px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .info-table th, .info-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    .info-table th { background: #f5f5f5; font-weight: 600; width: 25%; }
    .auth-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .auth-table th { background: linear-gradient(135deg, #1565C0, #0D47A1); color: white; padding: 10px; text-align: center; }
    .auth-table td { border: 1px solid #ddd; padding: 15px; text-align: center; vertical-align: top; }
    .signature-box { margin-top: 10px; padding: 8px; border: 1px solid #1565C0; border-radius: 5px; background: #f8f9fa; }
    .signature-name { font-weight: bold; color: #1565C0; font-size: 14px; }
    .signature-line { font-family: 'Brush Script MT', cursive; font-size: 18px; color: #0D47A1; margin: 5px 0; }
    .section { margin: 20px 0; }
    .section-title { background: #e3f2fd; padding: 8px 12px; font-weight: bold; color: #1565C0; border-left: 4px solid #1565C0; margin-bottom: 10px; }
    .section-content { padding: 10px 15px; }
    .section-content ul { margin-left: 20px; }
    .section-content li { margin: 5px 0; }
    .procedure-step { margin: 10px 0; padding: 10px; background: #fafafa; border-radius: 5px; border-left: 3px solid #1565C0; }
    .step-number { display: inline-block; width: 25px; height: 25px; background: #1565C0; color: white; border-radius: 50%; text-align: center; line-height: 25px; margin-right: 10px; font-weight: bold; }
    .data-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    .data-table th { background: #1565C0; color: white; padding: 10px; text-align: left; }
    .data-table td { border: 1px solid #ddd; padding: 8px; }
    .data-table tr:nth-child(even) { background: #f9f9f9; }
    .footer { margin-top: 30px; padding-top: 15px; border-top: 2px solid #1565C0; text-align: center; font-size: 10px; color: #666; }
    .revision-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 11px; }
    .revision-table th { background: #455a64; color: white; padding: 8px; }
    .revision-table td { border: 1px solid #ddd; padding: 8px; }
    .stamp-area { border: 2px solid #1565C0; border-radius: 10px; padding: 15px; text-align: center; margin: 20px 0; background: #f8f9fa; }
    .stamp-text { font-weight: bold; color: #1565C0; font-size: 14px; }
    @media print { body { padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <img src="${logoUrl}" alt="Hope Hospital" class="logo" onerror="this.style.display='none'">
    <div class="hospital-address">${hospitalConfig.address} | Phone: +91-9373111709</div>
  </div>

  <div class="doc-title">[DOCUMENT TITLE - Replace with appropriate title]</div>

  <table class="info-table">
    <tr><th>Document No</th><td>[Generate appropriate doc number like POL-QMS-001, SOP-AAC-001, etc.]</td><th>Version</th><td>1.0</td></tr>
    <tr><th>Department</th><td>[Appropriate department]</td><th>Category</th><td>[Policy/SOP/Record/Format]</td></tr>
    <tr><th>Effective Date</th><td>${effectiveDate}</td><th>Review Date</th><td>${reviewDate}</td></tr>
  </table>

  <table class="auth-table">
    <tr><th>PREPARED BY</th><th>REVIEWED BY</th><th>APPROVED BY</th></tr>
    <tr>
      <td>
        <div class="signature-box">
          <div class="signature-name">Jagruti</div>
          <div>Quality Manager / HR</div>
          <div>Date: ${effectiveDate}</div>
          <div class="signature-line">Jagruti</div>
        </div>
      </td>
      <td>
        <div class="signature-box">
          <div class="signature-name">Gaurav</div>
          <div>Hospital Administrator</div>
          <div>Date: ${effectiveDate}</div>
          <div class="signature-line">Gaurav</div>
        </div>
      </td>
      <td>
        <div class="signature-box">
          <div class="signature-name">Dr. Shiraz Sheikh</div>
          <div>NABH Coordinator / Administrator</div>
          <div>Date: ${effectiveDate}</div>
          <div class="signature-line">Dr. Shiraz Sheikh</div>
        </div>
      </td>
    </tr>
  </table>

  [MAIN CONTENT - Generate detailed content using sections below]

  <div class="section">
    <div class="section-title">1. Purpose</div>
    <div class="section-content">[Purpose of this document]</div>
  </div>

  <div class="section">
    <div class="section-title">2. Scope</div>
    <div class="section-content">[Scope and applicability]</div>
  </div>

  <div class="section">
    <div class="section-title">3. Responsibilities</div>
    <div class="section-content">[Who is responsible for what]</div>
  </div>

  <div class="section">
    <div class="section-title">4. Procedure / Policy</div>
    <div class="section-content">[Detailed procedure or policy content]</div>
  </div>

  <div class="section">
    <div class="section-title">5. Documentation</div>
    <div class="section-content">[Related forms, records, registers]</div>
  </div>

  <div class="section">
    <div class="section-title">6. References</div>
    <div class="section-content">NABH SHCO 3rd Edition Standards</div>
  </div>

  <table class="revision-table">
    <tr><th>Version</th><th>Date</th><th>Description</th><th>Changed By</th></tr>
    <tr><td>1.0</td><td>${effectiveDate}</td><td>Initial Release</td><td>Quality Department</td></tr>
  </table>

  <div class="stamp-area">
    <div class="stamp-text">DR. MURALI'S HOPE HOSPITAL</div>
    <div>QUALITY MANAGEMENT SYSTEM</div>
    <div style="margin-top: 5px; font-size: 10px;">Controlled Document</div>
  </div>

  <div class="footer">
    <strong>Hope Hospital</strong> | ${hospitalConfig.address}<br>
    Phone: +91-9373111709 | Email: ${hospitalConfig.email} | Website: ${hospitalConfig.website}<br>
    This is a controlled document. Unauthorized copying or distribution is prohibited.
  </div>
</body>
</html>

Generate the complete HTML with all sections filled in appropriately based on the evidence item provided. Make the content detailed, practical, and ready for NABH assessment.`;

  // Extract HTML from AI response (handles markdown code blocks)
  const extractHTMLFromResponse = (response: string): string => {
    let content = response.trim();

    // Remove markdown code blocks if present
    const htmlCodeBlockMatch = content.match(/```html\s*([\s\S]*?)```/i);
    if (htmlCodeBlockMatch) {
      content = htmlCodeBlockMatch[1].trim();
    } else {
      // Try generic code block
      const codeBlockMatch = content.match(/```\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        content = codeBlockMatch[1].trim();
      }
    }

    // If content starts with DOCTYPE or html tag, return as-is
    if (content.startsWith('<!DOCTYPE') || content.startsWith('<html')) {
      return content;
    }

    // Try to find HTML document in the response
    const doctypeIndex = content.indexOf('<!DOCTYPE html>');
    if (doctypeIndex !== -1) {
      return content.substring(doctypeIndex);
    }

    const htmlIndex = content.indexOf('<html');
    if (htmlIndex !== -1) {
      return content.substring(htmlIndex);
    }

    // If no proper HTML found, wrap in basic structure with logo
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Evidence Document - Dr. Murali's Hope Hospital</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; line-height: 1.6; color: #333; padding: 20px; max-width: 800px; margin: 0 auto; }
    .header { text-align: center; border-bottom: 3px solid #1565C0; padding-bottom: 15px; margin-bottom: 20px; }
    .logo { width: 180px; height: auto; margin: 0 auto 10px; display: block; }
    .tagline { font-size: 11px; color: #666; font-style: italic; margin-bottom: 5px; }
    .hospital-address { font-size: 11px; color: #666; }
    .content { padding: 20px 0; white-space: pre-wrap; line-height: 1.8; }
    .footer { margin-top: 30px; padding-top: 15px; border-top: 2px solid #1565C0; text-align: center; font-size: 10px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <img src="${logoUrl}" alt="Dr. Murali's Hope Hospital" class="logo" onerror="this.style.display='none'">
    <div class="tagline">Assured | Committed | Proficient</div>
    <div class="hospital-address">${hospitalConfig.address} | Phone: ${hospitalConfig.phone}</div>
  </div>
  <div class="content">${content}</div>
  <div class="footer">
    <strong>Dr. Murali's Hope Hospital</strong> | ${hospitalConfig.address}<br>
    Phone: ${hospitalConfig.phone} | Email: ${hospitalConfig.email}
  </div>
</body>
</html>`;
  };

  // Post-process HTML to ensure correct branding, dates, and signatures
  const postProcessHTML = (html: string): string => {
    let processed = html;

    // 0. FIRST - Replace ALL variations of "Dr. Murali's Hope Hospital" with "Hope Hospital" EVERYWHERE
    // This must happen FIRST before any other processing
    processed = processed.replace(/Dr\.?\s*Murali'?s?\s+Hope\s+Hospital/gi, 'Hope Hospital');
    processed = processed.replace(/Dr\.?\s*Murali'?s?\s*Hope\s*Hospital/gi, 'Hope Hospital');
    processed = processed.replace(/DR\.?\s*MURALI'?S?\s+HOPE\s+HOSPITAL/gi, 'HOPE HOSPITAL');
    processed = processed.replace(/DR\.?\s*MURALI'?S?\s*HOPE\s*HOSPITAL/gi, 'HOPE HOSPITAL');

    // 1. REMOVE the tagline div completely (handles nested divs issue)
    processed = processed.replace(/<div[^>]*class="tagline"[^>]*>[\s\S]*?<\/div>/gi, '');

    // 2. Remove tagline text anywhere it appears
    processed = processed.replace(/Assured\s*\|\s*Committed\s*\|\s*Proficient/gi, '');

    // 3. Fix the logo - replace any logo with correct one (2px margin = ~0.5cm spacing)
    const logoImg = `<img src="${logoUrl}" alt="Hope Hospital" class="logo" style="width: 180px; height: auto; margin: 0 auto 2px; display: block;" onerror="this.style.display='none'">`;

    processed = processed.replace(
      /<img[^>]*class="logo"[^>]*>/gi,
      logoImg
    );

    // 4. Replace logo placeholders - various patterns AI might generate
    processed = processed.replace(
      /<div[^>]*class="logo-area"[^>]*>[\s\S]*?<\/div>/gi,
      logoImg
    );
    processed = processed.replace(
      /<div[^>]*class="logo"[^>]*>[\s\S]*?<\/div>/gi,
      logoImg
    );
    processed = processed.replace(
      /HOSPITAL\s*(<br\s*\/?>)?\s*LOGO/gi,
      logoImg
    );
    // Replace SVG logo placeholders
    processed = processed.replace(
      /<svg[^>]*class="logo"[^>]*>[\s\S]*?<\/svg>/gi,
      logoImg
    );
    // Replace any img with logo in src that isn't our actual logo
    processed = processed.replace(
      /<img[^>]*src="[^"]*logo[^"]*"[^>]*>/gi,
      logoImg
    );
    // Replace text-based logo placeholders in header
    processed = processed.replace(
      /<div[^>]*class="hospital-logo"[^>]*>[\s\S]*?<\/div>/gi,
      logoImg
    );
    // Replace [LOGO] or [Hospital Logo] placeholders
    processed = processed.replace(
      /\[(?:HOSPITAL\s*)?LOGO\]/gi,
      logoImg
    );
    // Replace "Hope ring eran" or similar broken text (from SVG rendering)
    processed = processed.replace(
      /Hope\s*ring\s*eran/gi,
      ''
    );

    // 4b. Replace placeholder boxes (gray boxes, empty divs for logo)
    // Match any div that looks like a placeholder box with specific dimensions
    processed = processed.replace(
      /<div[^>]*style="[^"]*(?:width:\s*(?:80|100|120|150|180)px[^"]*height:\s*(?:60|80|100)px|height:\s*(?:60|80|100)px[^"]*width:\s*(?:80|100|120|150|180)px)[^"]*(?:background|border)[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
      logoImg
    );
    // Match placeholder text patterns
    processed = processed.replace(
      /\[?(?:Logo|Hospital\s*Logo|Logo\s*Here|Insert\s*Logo)\]?/gi,
      logoImg
    );

    // 4c. Inject logo into header if not present - replace hospital name at top with logo + name
    if (!processed.includes(logoUrl)) {
      // Replace the first "Hope Hospital" heading with logo + name
      processed = processed.replace(
        /<h1[^>]*>Hope Hospital<\/h1>/i,
        `<div style="text-align: center;">${logoImg}<h1 style="margin-top: 5px; font-size: 24px; color: #1565C0;">Hope Hospital</h1></div>`
      );
      // Also try with div class hospital-name
      processed = processed.replace(
        /<div[^>]*class="hospital-name"[^>]*>Hope Hospital<\/div>/i,
        `<div style="text-align: center;">${logoImg}<div class="hospital-name" style="margin-top: 5px; font-size: 20px; font-weight: bold; color: #1565C0;">Hope Hospital</div></div>`
      );
      // Insert logo at the very beginning of header div if no logo found
      processed = processed.replace(
        /<div[^>]*class="header"[^>]*>/i,
        `<div class="header" style="text-align: center;">${logoImg}`
      );
    }

    // 5. Fix hospital-address div to have correct phone
    processed = processed.replace(
      /<div[^>]*class="hospital-address"[^>]*>[\s\S]*?<\/div>/gi,
      `<div class="hospital-address" style="font-size: 11px; color: #666;">${hospitalConfig.address} | Phone: +91-9373111709</div>`
    );

    // 6. Fix dates
    processed = processed.replace(/Date:\s*<\/div>/gi, `Date: ${effectiveDate}</div>`);
    processed = processed.replace(/Date:\s*$/gm, `Date: ${effectiveDate}`);
    processed = processed.replace(/\[DD\/MM\/YYYY\]/g, effectiveDate);
    processed = processed.replace(/\[Date\]/g, effectiveDate);
    processed = processed.replace(/Effective Date<\/th><td>[^<]*<\/td>/gi, `Effective Date</th><td>${effectiveDate}</td>`);
    processed = processed.replace(/Review Date<\/th><td>[^<]*<\/td>/gi, `Review Date</th><td>${reviewDate}</td>`);

    // 7. Fix signature sections with realistic handwritten signatures
    const jagrutiSignature = `<svg width="120" height="40" viewBox="0 0 120 40" style="display:inline-block;vertical-align:middle;">
      <path d="M5,25 Q15,10 25,20 T45,15 Q55,25 65,20 T85,25 Q95,15 105,22"
            stroke="#1565C0" stroke-width="2" fill="none" stroke-linecap="round"/>
      <text x="10" y="38" font-family="serif" font-size="8" fill="#666">Jagruti</text>
    </svg>`;
    const drShirazSignature = `<svg width="140" height="45" viewBox="0 0 140 45" style="display:inline-block;vertical-align:middle;">
      <path d="M10,20 Q20,5 35,18 T55,12 Q70,22 85,15 T110,20 Q120,10 130,18"
            stroke="#0D47A1" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <text x="15" y="42" font-family="serif" font-size="9" fill="#444">Dr. Shiraz Sheikh</text>
    </svg>`;

    processed = processed.replace(
      /Name:\s*(Quality Manager|Quality Officer|Staff|Prepared By Staff|\[Name\])?(\s*<br|\s*$)/gi,
      `Name: Jagruti$2`
    );
    processed = processed.replace(
      /Designation:\s*(Quality Officer|Staff|\[Designation\])?(\s*<br|\s*$)/gi,
      `Designation: Quality Manager / HR$2`
    );
    processed = processed.replace(
      /Signature:\s*<\/td>/gi,
      `Signature: ${jagrutiSignature}</td>`
    );
    processed = processed.replace(
      /Sd\/-/gi,
      jagrutiSignature
    );

    // 8. Ensure Dr. Shiraz Sheikh is in Approved By with realistic signature
    if (!processed.includes('Dr. Shiraz Sheikh') && processed.includes('APPROVED BY')) {
      processed = processed.replace(
        /APPROVED BY<\/th>[\s\S]*?<td>([\s\S]*?)<\/td>/i,
        `APPROVED BY</th></tr><tr><td style="text-align: center; padding: 15px;">
          <div><strong>Dr. Shiraz Sheikh</strong></div>
          <div>NABH Coordinator / Administrator</div>
          <div>Date: ${effectiveDate}</div>
          <div style="margin-top: 8px;">${drShirazSignature}</div>
        </td>`
      );
    }

    // 9. Fix phone numbers
    processed = processed.replace(
      /Phone:\s*\+?91-?X+|\+91-XXXX-XXXXXX/gi,
      'Phone: +91-9373111709'
    );

    // 10. Fix stamp area content - just "HOPE HOSPITAL"
    processed = processed.replace(
      /<div[^>]*class="stamp-area"[^>]*>([\s\S]*?)<\/div>/gi,
      `<div class="stamp-area" style="border: 2px solid #1565C0; border-radius: 10px; padding: 15px; text-align: center; margin: 20px 0; background: #f8f9fa;">
        <div style="font-weight: bold; color: #1565C0; font-size: 14px;">HOPE HOSPITAL</div>
        <div style="font-weight: 600; margin-top: 5px;">QUALITY MANAGEMENT SYSTEM</div>
        <div style="margin-top: 5px; font-size: 11px; color: #666;">Controlled Document</div>
      </div>`
    );

    // 11. Fix margins - reduce to 2px for tighter spacing
    processed = processed.replace(/margin:\s*0\s*auto\s*10px/gi, 'margin: 0 auto 2px');
    processed = processed.replace(/margin:\s*0\s*auto\s*5px/gi, 'margin: 0 auto 2px');
    processed = processed.replace(/margin-bottom:\s*10px/gi, 'margin-bottom: 2px');
    processed = processed.replace(/margin-bottom:\s*5px/gi, 'margin-bottom: 2px');

    // 12. Final cleanup - remove any remaining tagline text
    processed = processed.replace(/>\s*Assured\s*\|\s*Committed\s*\|\s*Proficient\s*</gi, '><');

    // 13. Final pass - ensure no "Dr. Murali" text remains anywhere
    processed = processed.replace(/Dr\.?\s*Murali/gi, '');

    return processed;
  };

  // Extract editable text from HTML content
  const extractTextFromHTML = (html: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Remove script and style elements
    const scripts = tempDiv.querySelectorAll('script, style');
    scripts.forEach(el => el.remove());

    const sections: string[] = [];

    // Extract title
    const title = tempDiv.querySelector('.doc-title, h1, title');
    if (title) {
      sections.push(`TITLE: ${title.textContent?.trim() || ''}`);
      sections.push('');
    }

    // Extract sections
    const sectionElements = tempDiv.querySelectorAll('.section');
    sectionElements.forEach(section => {
      const sectionTitle = section.querySelector('.section-title');
      const sectionContent = section.querySelector('.section-content');

      if (sectionTitle) {
        sections.push(`## ${sectionTitle.textContent?.trim()}`);
      }
      if (sectionContent) {
        sections.push(sectionContent.textContent?.trim() || '');
      }
      sections.push('');
    });

    // If no structured content found, get all text
    if (sections.length < 3) {
      return tempDiv.textContent?.trim() || html;
    }

    return sections.join('\n');
  };

  // Generate evidence documents for selected items
  const handleGenerateEvidenceDocuments = async () => {
    const selectedItems = parsedEvidenceItems.filter(item => item.selected);
    if (selectedItems.length === 0) return;

    setIsGeneratingDocuments(true);
    setDocumentGenerationProgress({ current: 0, total: selectedItems.length });

    const geminiApiKey = getGeminiApiKey();
    const claudeApiKey = getClaudeApiKey();
    const contentPrompt = getEvidenceDocumentPrompt();

    for (let i = 0; i < selectedItems.length; i++) {
      const item = selectedItems[i];
      setDocumentGenerationProgress({ current: i + 1, total: selectedItems.length });

      const userMessage = `Objective Element: ${objective?.description}

Evidence Item to Generate:
${item.text}

Generate complete, ready-to-use content/template for this evidence in ENGLISH ONLY (internal document) with the hospital header, footer, signature and stamp sections as specified.`;

      try {
        let rawContent: string = '';

        // Try Gemini first, fallback to Claude
        if (geminiApiKey) {
          try {
            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: `${contentPrompt}\n\n${userMessage}` }] }],
                  generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
                }),
              }
            );
            if (response.ok) {
              const data = await response.json();
              rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            }
          } catch (geminiErr) {
            console.warn('Gemini failed:', geminiErr);
          }
        }

        if (!rawContent && claudeApiKey) {
          const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': claudeApiKey,
              'anthropic-version': '2023-06-01',
              'anthropic-dangerous-direct-browser-access': 'true',
            },
            body: JSON.stringify({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 4096,
              messages: [{ role: 'user', content: `${contentPrompt}\n\n${userMessage}` }],
            }),
          });
          if (response.ok) {
            const data = await response.json();
            rawContent = data.content?.[0]?.text || '';
          }
        }

        if (rawContent) {
          // Extract clean HTML from response and post-process it
          const extractedHtml = extractHTMLFromResponse(rawContent);
          const htmlContent = postProcessHTML(extractedHtml);

          // Extract title from the evidence item
          const title = item.text.replace(/^\d+[.):]\s*/, '').substring(0, 100);

          // Save to Supabase
          const result = await saveGeneratedEvidence({
            objective_code: objective?.code || '',
            evidence_title: title,
            prompt: item.text,
            generated_content: extractTextFromHTML(htmlContent),
            html_content: htmlContent,
            evidence_type: 'document',
            hospital_config: hospitalConfig,
          });

          if (result.success && result.id) {
            // Add to local state
            const newEvidence: GeneratedEvidence = {
              id: result.id,
              objective_code: objective?.code || '',
              evidence_title: title,
              prompt: item.text,
              generated_content: extractTextFromHTML(htmlContent),
              html_content: htmlContent,
              evidence_type: 'document',
              hospital_config: hospitalConfig,
              created_at: new Date().toISOString(),
            };
            setSavedEvidences(prev => [newEvidence, ...prev]);
            setSnackbarMessage(`Generated: ${title.substring(0, 50)}...`);
            setSnackbarOpen(true);
          } else {
            console.error('Failed to save evidence:', result.error);
            setSnackbarMessage('Failed to save evidence. Check console for details.');
            setSnackbarOpen(true);
          }
        } else {
          console.error('No content generated for:', item.text);
          setSnackbarMessage('Failed to generate content. Check API keys.');
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error('Error generating evidence document:', error);
        setSnackbarMessage('Error generating document. Check console.');
        setSnackbarOpen(true);
      }
    }

    setIsGeneratingDocuments(false);
    // Deselect all items after generation
    setParsedEvidenceItems(items => items.map(item => ({ ...item, selected: false })));
  };

  // Copy share link to clipboard
  const handleCopyShareLink = (evidenceId: string) => {
    const shareUrl = `${window.location.origin}/evidence/${evidenceId}`;
    navigator.clipboard.writeText(shareUrl);
    setSnackbarMessage('Share link copied to clipboard');
    setSnackbarOpen(true);
  };

  // Handle edit mode content change
  const handleEditContent = (evidenceId: string, content: string) => {
    setEditingEvidenceContent(prev => ({ ...prev, [evidenceId]: content }));
  };


  // Delete evidence
  const handleDeleteEvidence = async (evidenceId: string) => {
    const result = await deleteGeneratedEvidence(evidenceId);
    if (result.success) {
      setSavedEvidences(prev => prev.filter(ev => ev.id !== evidenceId));
      setSnackbarMessage('Evidence deleted');
      setSnackbarOpen(true);
    }
  };

  // Preview evidence in new window
  const handlePreviewEvidence = (content: string, _title: string) => {
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(content);
      previewWindow.document.close();
    }
  };

  // Print evidence
  const handlePrintEvidence = (content: string) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Generate custom evidence from user prompt
  const handleGenerateCustomEvidence = async () => {
    if (!customEvidencePrompt.trim()) {
      setSnackbarMessage('Please enter a prompt for the evidence document');
      setSnackbarOpen(true);
      return;
    }

    setIsGeneratingCustomEvidence(true);

    try {
      const geminiApiKey = await getGeminiApiKey();
      if (!geminiApiKey) {
        throw new Error('Gemini API key not configured');
      }

      const prompt = `${getEvidenceDocumentPrompt()}

OBJECTIVE: ${objective?.code} - ${objective?.title}

USER REQUEST: ${customEvidencePrompt}

Generate a complete, professional HTML document for the above requirement. Include realistic dummy data, proper formatting, and all sections as specified in the template.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
          }),
        }
      );

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (rawContent) {
        const extractedHtml = extractHTMLFromResponse(rawContent);
        const htmlContent = postProcessHTML(extractedHtml);
        const title = customEvidencePrompt.substring(0, 100);

        const result = await saveGeneratedEvidence({
          objective_code: objective?.code || '',
          evidence_title: title,
          prompt: customEvidencePrompt,
          generated_content: extractTextFromHTML(htmlContent),
          html_content: htmlContent,
          evidence_type: 'custom',
          hospital_config: hospitalConfig,
        });

        if (result.success && result.id) {
          const newEvidence: GeneratedEvidence = {
            id: result.id,
            objective_code: objective?.code || '',
            evidence_title: title,
            prompt: customEvidencePrompt,
            generated_content: extractTextFromHTML(htmlContent),
            html_content: htmlContent,
            evidence_type: 'custom',
            hospital_config: hospitalConfig,
            created_at: new Date().toISOString(),
          };
          setSavedEvidences(prev => [newEvidence, ...prev]);
          setCustomEvidencePrompt('');
          setSnackbarMessage('Custom evidence document generated successfully');
          setSnackbarOpen(true);
        }
      }
    } catch (error) {
      console.error('Error generating custom evidence:', error);
      setSnackbarMessage('Error generating custom evidence. Check console.');
      setSnackbarOpen(true);
    }

    setIsGeneratingCustomEvidence(false);
  };

  // Get suggested registers based on objective
  const getSuggestedRegistersForObjective = (): RegisterItem[] => {
    const objectiveCode = objective?.code || '';

    // Common registers for different NABH objectives
    const registerSuggestions: Record<string, RegisterItem[]> = {
      'AAC': [
        { id: 'reg-aac-1', name: 'Patient Registration Register', description: 'Register of all patients with UHID, demographics, and admission details', htmlContent: '', isGenerated: false },
        { id: 'reg-aac-2', name: 'Admission Register', description: 'Daily admission register with patient details and bed allocation', htmlContent: '', isGenerated: false },
        { id: 'reg-aac-3', name: 'Discharge Register', description: 'Patient discharge details with outcomes and follow-up instructions', htmlContent: '', isGenerated: false },
        { id: 'reg-aac-4', name: 'Transfer Register', description: 'Inter-department and external transfer records', htmlContent: '', isGenerated: false },
        { id: 'reg-aac-5', name: 'Bed Occupancy Register', description: 'Daily bed census and occupancy tracking', htmlContent: '', isGenerated: false },
      ],
      'COP': [
        { id: 'reg-cop-1', name: 'Patient Assessment Register', description: 'Initial and ongoing patient assessment records', htmlContent: '', isGenerated: false },
        { id: 'reg-cop-2', name: 'Clinical Care Plan Register', description: 'Individualized care plans for patients', htmlContent: '', isGenerated: false },
        { id: 'reg-cop-3', name: 'Nursing Care Register', description: 'Daily nursing care documentation', htmlContent: '', isGenerated: false },
        { id: 'reg-cop-4', name: 'Patient Education Register', description: 'Patient and family education records', htmlContent: '', isGenerated: false },
        { id: 'reg-cop-5', name: 'Consent Register', description: 'All consent forms obtained from patients', htmlContent: '', isGenerated: false },
      ],
      'MOM': [
        { id: 'reg-mom-1', name: 'Drug Inventory Register', description: 'Stock register for all medications', htmlContent: '', isGenerated: false },
        { id: 'reg-mom-2', name: 'High Alert Medication Register', description: 'Tracking of high-alert and look-alike drugs', htmlContent: '', isGenerated: false },
        { id: 'reg-mom-3', name: 'Narcotic Drug Register', description: 'Controlled substance tracking and accountability', htmlContent: '', isGenerated: false },
        { id: 'reg-mom-4', name: 'Adverse Drug Reaction Register', description: 'ADR reporting and monitoring', htmlContent: '', isGenerated: false },
        { id: 'reg-mom-5', name: 'Emergency Drug Register', description: 'Emergency medication usage tracking', htmlContent: '', isGenerated: false },
      ],
      'PRE': [
        { id: 'reg-pre-1', name: 'Patient Rights Register', description: 'Documentation of patient rights information provided', htmlContent: '', isGenerated: false },
        { id: 'reg-pre-2', name: 'Complaint Register', description: 'Patient complaints and grievance handling', htmlContent: '', isGenerated: false },
        { id: 'reg-pre-3', name: 'Feedback Register', description: 'Patient feedback and satisfaction records', htmlContent: '', isGenerated: false },
        { id: 'reg-pre-4', name: 'Informed Consent Register', description: 'All informed consents obtained', htmlContent: '', isGenerated: false },
      ],
      'HIC': [
        { id: 'reg-hic-1', name: 'Hand Hygiene Audit Register', description: 'Hand hygiene compliance monitoring', htmlContent: '', isGenerated: false },
        { id: 'reg-hic-2', name: 'Hospital Acquired Infection Register', description: 'HAI surveillance and tracking', htmlContent: '', isGenerated: false },
        { id: 'reg-hic-3', name: 'Biomedical Waste Register', description: 'BMW generation and disposal tracking', htmlContent: '', isGenerated: false },
        { id: 'reg-hic-4', name: 'Sterilization Register', description: 'CSSD sterilization records', htmlContent: '', isGenerated: false },
        { id: 'reg-hic-5', name: 'Needle Stick Injury Register', description: 'NSI incidents and post-exposure prophylaxis', htmlContent: '', isGenerated: false },
      ],
      'FMS': [
        { id: 'reg-fms-1', name: 'Equipment Maintenance Register', description: 'Preventive and breakdown maintenance records', htmlContent: '', isGenerated: false },
        { id: 'reg-fms-2', name: 'Fire Safety Drill Register', description: 'Mock drill records and observations', htmlContent: '', isGenerated: false },
        { id: 'reg-fms-3', name: 'Incident Register', description: 'All facility-related incidents', htmlContent: '', isGenerated: false },
        { id: 'reg-fms-4', name: 'Calibration Register', description: 'Equipment calibration tracking', htmlContent: '', isGenerated: false },
      ],
      'HRM': [
        { id: 'reg-hrm-1', name: 'Staff Attendance Register', description: 'Daily attendance and leave tracking', htmlContent: '', isGenerated: false },
        { id: 'reg-hrm-2', name: 'Training Register', description: 'Staff training records and certifications', htmlContent: '', isGenerated: false },
        { id: 'reg-hrm-3', name: 'Credential Verification Register', description: 'License and credential verification', htmlContent: '', isGenerated: false },
        { id: 'reg-hrm-4', name: 'Performance Appraisal Register', description: 'Annual performance reviews', htmlContent: '', isGenerated: false },
      ],
      'QI': [
        { id: 'reg-qi-1', name: 'Quality Indicator Register', description: 'Monthly quality indicators tracking', htmlContent: '', isGenerated: false },
        { id: 'reg-qi-2', name: 'CAPA Register', description: 'Corrective and Preventive Actions tracking', htmlContent: '', isGenerated: false },
        { id: 'reg-qi-3', name: 'Near Miss Register', description: 'Near miss events reporting', htmlContent: '', isGenerated: false },
        { id: 'reg-qi-4', name: 'Sentinel Event Register', description: 'Sentinel events and RCA documentation', htmlContent: '', isGenerated: false },
        { id: 'reg-qi-5', name: 'Patient Safety Incident Register', description: 'All patient safety incidents', htmlContent: '', isGenerated: false },
      ],
    };

    // Find matching registers based on objective code prefix
    const prefix = objectiveCode.substring(0, 3).toUpperCase();
    let registers = registerSuggestions[prefix] || [];

    // If no exact match, provide generic registers
    if (registers.length === 0) {
      registers = [
        { id: 'reg-gen-1', name: 'Activity Register', description: `Register for ${objective?.title || 'activities'}`, htmlContent: '', isGenerated: false },
        { id: 'reg-gen-2', name: 'Compliance Checklist Register', description: 'Daily/weekly compliance tracking', htmlContent: '', isGenerated: false },
        { id: 'reg-gen-3', name: 'Audit Register', description: 'Internal audit findings and actions', htmlContent: '', isGenerated: false },
        { id: 'reg-gen-4', name: 'Training Record Register', description: 'Related training documentation', htmlContent: '', isGenerated: false },
      ];
    }

    return registers;
  };

  // Load suggested registers when objective changes
  useEffect(() => {
    if (objective?.code) {
      const registers = getSuggestedRegistersForObjective();
      setSuggestedRegisters(registers);
    }
  }, [objective?.code]);

  // Toggle register selection
  const handleToggleRegister = (registerId: string) => {
    setSelectedRegisters(prev =>
      prev.includes(registerId)
        ? prev.filter(id => id !== registerId)
        : [...prev, registerId]
    );
  };

  // Generate selected registers
  const handleGenerateRegisters = async () => {
    if (selectedRegisters.length === 0) {
      setSnackbarMessage('Please select at least one register to generate');
      setSnackbarOpen(true);
      return;
    }

    setIsGeneratingRegisters(true);

    try {
      const geminiApiKey = await getGeminiApiKey();
      if (!geminiApiKey) throw new Error('Gemini API key not configured');

      for (const registerId of selectedRegisters) {
        const register = suggestedRegisters.find(r => r.id === registerId);
        if (!register) continue;

        const prompt = `Generate a complete HTML document for a hospital register/log book.

HOSPITAL: Hope Hospital, ${hospitalConfig.address}
REGISTER NAME: ${register.name}
DESCRIPTION: ${register.description}
NABH OBJECTIVE: ${objective?.code} - ${objective?.title}

Create a professional, print-ready HTML document with:
1. Hospital header with logo placeholder and address
2. Register title and purpose
3. A table with realistic dummy data (at least 15-20 entries spanning the last 9 months)
4. Columns appropriate for this type of register
5. Space for signatures/verifications
6. Footer with controlled document stamp

For CAPA entries, include:
- Finding/Issue description
- Root cause analysis
- Corrective action taken
- Preventive measures implemented
- Responsible person
- Target date and completion date
- Verification status

Use realistic Indian names, dates (within last 9 months), and data that would be acceptable to NABH auditors.

Generate complete HTML with embedded CSS. Do NOT use markdown or code blocks.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
            }),
          }
        );

        if (!response.ok) continue;
        const data = await response.json();
        const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        if (rawContent) {
          const extractedHtml = extractHTMLFromResponse(rawContent);
          const htmlContent = postProcessHTML(extractedHtml);

          // Save to Supabase
          const result = await saveGeneratedEvidence({
            objective_code: objective?.code || '',
            evidence_title: register.name,
            prompt: `Register: ${register.name} - ${register.description}`,
            generated_content: extractTextFromHTML(htmlContent),
            html_content: htmlContent,
            evidence_type: 'register',
            hospital_config: hospitalConfig,
          });

          if (result.success && result.id) {
            const newEvidence: GeneratedEvidence = {
              id: result.id,
              objective_code: objective?.code || '',
              evidence_title: register.name,
              prompt: `Register: ${register.name}`,
              generated_content: extractTextFromHTML(htmlContent),
              html_content: htmlContent,
              evidence_type: 'register',
              hospital_config: hospitalConfig,
              created_at: new Date().toISOString(),
            };
            setSavedEvidences(prev => [newEvidence, ...prev]);
          }
        }
      }

      setSelectedRegisters([]);
      setSnackbarMessage(`Generated ${selectedRegisters.length} register(s) successfully`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error generating registers:', error);
      setSnackbarMessage('Error generating registers. Check console.');
      setSnackbarOpen(true);
    }

    setIsGeneratingRegisters(false);
  };

  const selectedEvidenceCount = parsedEvidenceItems.filter(item => item.selected).length;

  // Generate Hindi explanation based on interpretation
  const handleGenerateHindiExplanation = async (interpretation: string) => {
    if (!interpretation.trim()) return;

    setIsGeneratingHindi(true);

    try {
      const apiKey = await getClaudeApiKey();
      if (!apiKey) {
        throw new Error('API key not configured');
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: `Translate and explain the following NABH accreditation standard interpretation into Hindi. The explanation should be detailed and accurate. You may use complex sentences if necessary, but the meaning must not be changed. This is for hospital staff training purposes.

Objective Code: ${objective.code}
English Interpretation: ${interpretation}
${objective.isCore ? 'Note: This is a CORE element which is critical for patient safety.' : ''}

Provide only the Hindi explanation, no English text. The explanation should be comprehensive and explain what the hospital needs to do to comply with this standard.`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate Hindi explanation');
      }

      const data = await response.json();
      const hindiContent = data.content[0]?.text || '';

      if (hindiContent.trim()) {
        updateObjective(chapter.id, objective.id, { hindiExplanation: hindiContent.trim() });

        // Save to Supabase
        saveToSupabase({ ...objective, hindiExplanation: hindiContent.trim() });
      }
    } catch (error) {
      console.error('Error generating Hindi explanation:', error);
    } finally {
      setIsGeneratingHindi(false);
    }
  };

  // Handle interpretation change with debounced Hindi generation
  const handleInterpretationChange = (newInterpretation: string) => {
    handleFieldChange('description', newInterpretation);
  };

  // Handle interpretation save (blur event) to trigger Hindi generation
  const handleInterpretationBlur = async () => {
    if (objective.description && objective.description.trim()) {
      await handleGenerateHindiExplanation(objective.description);
    }
  };

  // Save infographic to Supabase using the objective_edits table
  const saveInfographicToSupabase = async (imageDataUrl: string) => {
    setInfographicSaveStatus('saving');
    try {
      // Save to nabh_objective_edits table (which exists)
      const result = await saveObjectiveToSupabase(chapter.id, {
        ...objective,
        infographicSvg: '', // We're using image now, not SVG
        infographicDataUrl: imageDataUrl,
      });

      if (result.success) {
        setInfographicSaveStatus('saved');
        setLastSaved(new Date());
        return true;
      } else {
        console.warn('Infographic not saved to Supabase:', result.error);
        setInfographicSaveStatus('error');
        return false;
      }
    } catch (error) {
      console.warn('Infographic storage to Supabase failed:', error);
      setInfographicSaveStatus('error');
      return false;
    }
  };

  // Generate Bilingual Infographic using Gemini Image Generation
  const handleGenerateInfographic = async () => {
    if (!objective.description) return;

    setIsGeneratingInfographic(true);
    setGeneratedInfographicSvg('');

    try {
      const apiKey = getGeminiApiKey();
      if (!apiKey) {
        throw new Error('Gemini API key not configured');
      }

      // Create the prompt for infographic generation
      const prompt = `Create a professional bilingual healthcare infographic poster for hospital display.

TITLE: ${objective.code} - NABH Accreditation Standard
${objective.isCore ? 'CORE ELEMENT - Critical for Patient Safety' : ''}

ENGLISH SECTION:
${objective.description}

HINDI SECTION (हिंदी):
${objective.hindiExplanation || 'हिंदी व्याख्या उपलब्ध नहीं है'}

HOSPITAL: ${HOSPITAL_INFO.name}

DESIGN REQUIREMENTS:
- Portrait orientation (suitable for A4/A3 printing)
- Professional healthcare color scheme (blue #1565C0, white background, red #D32F2F accent)
- Hospital name at the top with medical cross symbol
- Objective code prominently displayed
- Split layout: English on left/top, Hindi on right/bottom
- 3-5 key compliance points with checkmark icons
- Healthcare icons (stethoscope, heart, shield, medical cross)
- Footer: "NABH Accreditation Compliance"
- Clean, professional, easy to read from distance
- Include visual hierarchy with headers and bullet points`;

      // Use Gemini 3.0 Pro Image (Nano Banana Pro) for generation
      // API reference: https://ai.google.dev/gemini-api/docs/image-generation
      // Model: gemini-3-pro-image-preview (Nano Banana Pro - professional image generation)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `Generate an infographic image: ${prompt}` }
                ]
              }
            ],
            generationConfig: {
              responseModalities: ['TEXT', 'IMAGE'],
            }
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to generate infographic');
      }

      const data = await response.json();
      console.log('Gemini API Response:', JSON.stringify(data, null, 2));

      // Extract image from response
      let imageDataUrl = '';
      let textContent = '';
      const candidate = data.candidates?.[0];

      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            const base64Data = part.inlineData.data;
            console.log('Base64 data length:', base64Data?.length);
            console.log('Base64 first 100 chars:', base64Data?.substring(0, 100));
            console.log('Base64 last 100 chars:', base64Data?.substring(base64Data.length - 100));
            imageDataUrl = `data:${mimeType};base64,${base64Data}`;
            console.log('Found image in response, mimeType:', mimeType);
            console.log('Image data URL length:', imageDataUrl.length);
          }
          if (part.text) {
            textContent = part.text;
            console.log('Found text in response:', textContent.substring(0, 200));
          }
        }
      }

      if (imageDataUrl) {
        console.log('Using generated image, data URL length:', imageDataUrl.length);
        console.log('Setting state with image...');
        setGeneratedInfographicSvg(imageDataUrl);
        console.log('State set successfully');

        // Update objective with infographic (local storage)
        updateObjective(chapter.id, objective.id, {
          infographicSvg: '',
          infographicDataUrl: imageDataUrl,
        });

        // Save to Supabase for persistence
        await saveInfographicToSupabase(imageDataUrl);
      } else {
        // No image was generated - show error with details
        const errorMsg = textContent
          ? `Gemini returned text instead of image. Model may not support image generation. Response: ${textContent.substring(0, 100)}...`
          : 'No image generated. The model may not support image generation with current settings.';
        console.error(errorMsg);
        console.error('Full response:', data);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Error generating infographic:', error);
      setGeneratedInfographicSvg(''); // Clear on error
      alert(`Failed to generate infographic: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingInfographic(false);
    }
  };

  // Download infographic as PNG
  const handleDownloadInfographic = () => {
    const imageUrl = generatedInfographicSvg || objective.infographicDataUrl;
    if (!imageUrl) return;

    // If it's already a data URL (base64 image), download directly
    if (imageUrl.startsWith('data:image/')) {
      const link = document.createElement('a');
      link.download = `${objective.code}-infographic.png`;
      link.href = imageUrl;
      link.click();
      return;
    }

    // If it's SVG (legacy), convert to PNG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    const svgBlob = new Blob([imageUrl], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width || 800;
      canvas.height = img.height || 1000;
      ctx?.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${objective.code}-infographic.png`;
      link.href = pngUrl;
      link.click();
    };

    img.src = url;
  };

  const evidenceFiles = objective.evidenceFiles || [];

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/')}
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          underline="hover"
        >
          <Icon sx={{ mr: 0.5, fontSize: 18 }}>home</Icon>
          Dashboard
        </Link>
        <Link
          component="button"
          variant="body2"
          onClick={() => {
            setSelectedChapter(chapter.id);
            navigate('/');
          }}
          underline="hover"
          sx={{ cursor: 'pointer' }}
        >
          {chapter.code} - {chapter.fullName}
        </Link>
        <Typography color="text.primary">{objective.code}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<Icon>arrow_back</Icon>}
              onClick={handleBack}
              size="small"
            >
              Back
            </Button>
            <Icon color="primary" sx={{ fontSize: 32 }}>description</Icon>
            <Typography variant="h5" fontWeight={600}>
              {objective.code}
            </Typography>
            {objective.isCore && (
              <Chip label="CORE" size="medium" color="error" />
            )}
            {objective.priority === 'Prev NC' && (
              <Chip label="Prev NC" size="medium" color="warning" />
            )}
            <Chip label={objective.category} size="medium" variant="outlined" />
          </Box>
          {/* Save Status Indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isLoadingFromDb && (
              <Chip
                icon={<CircularProgress size={14} />}
                label="Loading..."
                size="small"
                color="default"
              />
            )}
            {saveStatus === 'saving' && (
              <Chip
                icon={<CircularProgress size={14} />}
                label="Saving..."
                size="small"
                color="info"
              />
            )}
            {saveStatus === 'saved' && (
              <Chip
                icon={<Icon sx={{ fontSize: 16 }}>cloud_done</Icon>}
                label="Saved"
                size="small"
                color="success"
              />
            )}
            {saveStatus === 'error' && (
              <Chip
                icon={<Icon sx={{ fontSize: 16 }}>cloud_off</Icon>}
                label="Save failed"
                size="small"
                color="error"
              />
            )}
            {lastSaved && saveStatus === 'idle' && (
              <Typography variant="caption" color="text.secondary">
                Last saved: {lastSaved.toLocaleTimeString()}
              </Typography>
            )}
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {objective.description}
        </Typography>
      </Paper>

      {/* Main Content */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Title */}
          <TextField
            fullWidth
            label="Title"
            value={objective.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            size="small"
          />

          {/* Interpretation (formerly Description) */}
          <Box>
            <TextField
              fullWidth
              label="Interpretation"
              value={objective.description}
              onChange={(e) => handleInterpretationChange(e.target.value)}
              onBlur={handleInterpretationBlur}
              multiline
              minRows={3}
              size="small"
              sx={expandableTextFieldSx}
              helperText="Hindi explanation will be auto-generated when you finish editing"
            />
            {isGeneratingHindi && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="caption" color="text.secondary">
                  Generating Hindi explanation...
                </Typography>
              </Box>
            )}
          </Box>

          {/* Hindi Explanation Section */}
          <Accordion defaultExpanded sx={{ bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
            <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon color="warning">translate</Icon>
                <Typography fontWeight={600}>Hindi Explanation (Staff Training)</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Alert severity="info" icon={<Icon>school</Icon>} sx={{ mb: 2 }}>
                <Typography variant="body2">
                  This explanation is for staff training purposes. If the interpretation above has been edited, click the button below to regenerate the Hindi translation.
                </Typography>
              </Alert>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={isGeneratingHindi ? <CircularProgress size={16} color="inherit" /> : <Icon>refresh</Icon>}
                  onClick={() => handleGenerateHindiExplanation(objective.description)}
                  disabled={isGeneratingHindi || !objective.description}
                  size="small"
                >
                  {isGeneratingHindi ? 'Generating...' : 'Update Hindi Explanation from Interpretation'}
                </Button>
              </Box>
              {objective.hindiExplanation ? (
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: '"Noto Sans Devanagari", "Mangal", sans-serif',
                    lineHeight: 1.8,
                    fontSize: '1rem',
                    bgcolor: 'background.paper',
                    p: 2,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  {objective.hindiExplanation}
                </Typography>
              ) : (
                <Alert severity="warning" icon={<Icon>info</Icon>}>
                  <Typography variant="body2">
                    No Hindi explanation available. Click the button above to generate one from the interpretation.
                  </Typography>
                </Alert>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Bilingual Infographic Section */}
          <Accordion sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
            <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon color="info">image</Icon>
                <Typography fontWeight={600}>Bilingual Infographic (English + Hindi)</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Alert severity="info" icon={<Icon>lightbulb</Icon>} sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Generate a professional bilingual infographic for display in hospital areas. The infographic includes both English and Hindi content based on the interpretation.
                </Typography>
              </Alert>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Button
                  variant="contained"
                  color="info"
                  startIcon={isGeneratingInfographic ? <CircularProgress size={16} color="inherit" /> : <Icon>auto_awesome</Icon>}
                  onClick={handleGenerateInfographic}
                  disabled={isGeneratingInfographic || !objective.description}
                >
                  {isGeneratingInfographic ? 'Generating Infographic...' : 'Generate Infographic'}
                </Button>
                {(generatedInfographicSvg || objective.infographicDataUrl) && (
                  <Button
                    variant="outlined"
                    color="info"
                    startIcon={<Icon>download</Icon>}
                    onClick={handleDownloadInfographic}
                  >
                    Download as PNG
                  </Button>
                )}
                {infographicSaveStatus === 'saving' && (
                  <Chip
                    icon={<CircularProgress size={14} />}
                    label="Saving to cloud..."
                    size="small"
                    color="default"
                  />
                )}
                {infographicSaveStatus === 'saved' && (
                  <Chip
                    icon={<Icon sx={{ fontSize: 16 }}>cloud_done</Icon>}
                    label="Saved to Supabase"
                    size="small"
                    color="success"
                  />
                )}
                {infographicSaveStatus === 'error' && (
                  <Chip
                    icon={<Icon sx={{ fontSize: 16 }}>cloud_off</Icon>}
                    label="Save failed (stored locally)"
                    size="small"
                    color="warning"
                  />
                )}
              </Box>

              {/* Display generated or saved infographic */}
              {(generatedInfographicSvg || objective.infographicDataUrl) && (
                <Box
                  sx={{
                    border: '2px solid',
                    borderColor: 'info.200',
                    borderRadius: 2,
                    p: 2,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                    maxHeight: 700,
                    textAlign: 'center',
                  }}
                >
                  <img
                    src={generatedInfographicSvg || objective.infographicDataUrl}
                    alt={`${objective.code} Infographic`}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      display: 'block',
                      margin: '0 auto',
                      borderRadius: '8px',
                    }}
                    onError={(e) => {
                      console.error('Image failed to load:', e);
                      console.log('Image src length:', (generatedInfographicSvg || objective.infographicDataUrl || '').length);
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully');
                    }}
                  />
                </Box>
              )}

              {!generatedInfographicSvg && !objective.infographicDataUrl && (
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'grey.300',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    bgcolor: 'grey.50',
                  }}
                >
                  <Icon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }}>image</Icon>
                  <Typography color="text.secondary">
                    Click "Generate Infographic" to create a bilingual visual for this objective
                  </Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>

          <Divider />

          {/* Status and Assignment Section */}
          <Typography variant="subtitle1" fontWeight={600}>
            Status & Assignment
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={objective.status || ''}
                  label="Status"
                  onChange={(e) => handleFieldChange('status', e.target.value as Status)}
                >
                  <MenuItem value="">Not Set</MenuItem>
                  <MenuItem value="Not started">Not Started</MenuItem>
                  <MenuItem value="In progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Blocked">Blocked</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={objective.priority || ''}
                  label="Priority"
                  onChange={(e) => handleFieldChange('priority', e.target.value as Priority)}
                >
                  <MenuItem value="">Not Set</MenuItem>
                  <MenuItem value="CORE">CORE</MenuItem>
                  <MenuItem value="Prev NC">Previous NC</MenuItem>
                  <MenuItem value="P0">P0 - Critical</MenuItem>
                  <MenuItem value="P1">P1 - High</MenuItem>
                  <MenuItem value="P2">P2 - Medium</MenuItem>
                  <MenuItem value="P3">P3 - Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Assignee</InputLabel>
                <Select
                  value={objective.assignee || ''}
                  label="Assignee"
                  onChange={(e) => handleFieldChange('assignee', e.target.value)}
                >
                  <MenuItem value="">Unassigned</MenuItem>
                  {ASSIGNEE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={objective.endDate || ''}
                onChange={(e) => handleFieldChange('endDate', e.target.value)}
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
          </Grid>

          <Divider />

          {/* Evidence Generator Section */}
          <Accordion defaultExpanded sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
            <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon color="primary">auto_awesome</Icon>
                <Typography fontWeight={600}>Evidence Generator</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Alert severity="info" icon={<Icon>lightbulb</Icon>} sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Generate a prioritized list of up to 10 evidences specific to this objective element.
                  The list will be sorted by importance (most critical first).
                </Typography>
              </Alert>
              <Button
                variant="contained"
                startIcon={isGeneratingEvidence ? <CircularProgress size={20} color="inherit" /> : <Icon>auto_awesome</Icon>}
                onClick={handleGenerateEvidenceList}
                disabled={isGeneratingEvidence || !objective.description}
                sx={{ mb: 2 }}
              >
                {isGeneratingEvidence ? 'Generating Evidence List...' : 'Generate Evidence List'}
              </Button>
              {generatedEvidenceList.length > 0 && (
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Icon color="success" fontSize="small">check_circle</Icon>
                    Generated Evidence List (Priority Order):
                  </Typography>
                  <Box component="ol" sx={{ m: 0, pl: 3 }}>
                    {generatedEvidenceList.map((evidence, idx) => (
                      <Box component="li" key={idx} sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          {idx < 3 && <Chip label={idx === 0 ? 'P0' : idx === 1 ? 'P1' : 'P2'} size="small" color={idx === 0 ? 'error' : idx === 1 ? 'warning' : 'info'} sx={{ mr: 1, height: 20, fontSize: '0.7rem' }} />}
                          {evidence}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>

          <Divider />

          {/* Evidence Section */}
          <Typography variant="subtitle1" fontWeight={600}>
            Evidence & Documentation (Max 10 items, sorted by priority)
          </Typography>
          <TextField
            fullWidth
            label="Evidence List"
            value={objective.evidencesList}
            onChange={(e) => handleFieldChange('evidencesList', e.target.value)}
            multiline
            minRows={2}
            size="small"
            placeholder="List the evidence required for this objective (max 10 items, highest priority first)..."
            sx={expandableTextFieldSx}
            helperText="List evidences in order of priority. Use generator above to auto-generate."
          />

          {/* Evidence Document Generator */}
          {parsedEvidenceItems.length > 0 && (
            <Accordion defaultExpanded sx={{ bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
              <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Icon color="success">description</Icon>
                  <Typography fontWeight={600}>Generate Evidence Documents</Typography>
                  {selectedEvidenceCount > 0 && (
                    <Chip
                      label={`${selectedEvidenceCount} selected`}
                      size="small"
                      color="success"
                    />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Alert severity="info" icon={<Icon>lightbulb</Icon>} sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Select evidence items below and click "Generate Documents" to create professional,
                    hospital-branded evidence documents. Each document will be saved with a shareable link.
                  </Typography>
                </Alert>

                {/* Select All / Generate Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Button
                    size="small"
                    startIcon={<Icon>select_all</Icon>}
                    onClick={handleSelectAllEvidenceItems}
                  >
                    {parsedEvidenceItems.every(item => item.selected) ? 'Deselect All' : 'Select All'}
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={isGeneratingDocuments ? <CircularProgress size={20} color="inherit" /> : <Icon>auto_awesome</Icon>}
                    onClick={handleGenerateEvidenceDocuments}
                    disabled={isGeneratingDocuments || selectedEvidenceCount === 0}
                  >
                    {isGeneratingDocuments
                      ? `Generating ${documentGenerationProgress.current}/${documentGenerationProgress.total}...`
                      : `Generate Documents (${selectedEvidenceCount})`}
                  </Button>
                </Box>

                {/* Evidence Items Checklist */}
                <Paper variant="outlined" sx={{ p: 2, maxHeight: 300, overflow: 'auto', bgcolor: 'background.paper' }}>
                  <FormGroup>
                    {parsedEvidenceItems.map((item) => (
                      <FormControlLabel
                        key={item.id}
                        control={
                          <Checkbox
                            checked={item.selected}
                            onChange={() => handleToggleEvidenceItem(item.id)}
                            color="success"
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                            {item.text}
                          </Typography>
                        }
                        sx={{
                          alignItems: 'flex-start',
                          mb: 1,
                          p: 1,
                          borderRadius: 1,
                          bgcolor: item.selected ? 'success.50' : 'transparent',
                          '&:hover': { bgcolor: item.selected ? 'success.100' : 'grey.100' },
                        }}
                      />
                    ))}
                  </FormGroup>
                </Paper>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Custom Evidence Generator */}
          <Accordion sx={{ bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
            <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon color="warning">edit_note</Icon>
                <Typography fontWeight={600}>Custom Evidence Generator</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Alert severity="info" icon={<Icon>lightbulb</Icon>} sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Enter your own requirement to generate a custom evidence document. Describe what document you need and the system will create it with proper hospital branding and formatting.
                </Typography>
              </Alert>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Enter your evidence document requirement"
                placeholder="Example: Create a patient feedback form for OPD services with fields for patient name, date, department visited, doctor name, waiting time, staff behavior rating, facility cleanliness rating, overall satisfaction, and suggestions..."
                value={customEvidencePrompt}
                onChange={(e) => setCustomEvidencePrompt(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="warning"
                startIcon={isGeneratingCustomEvidence ? <CircularProgress size={20} color="inherit" /> : <Icon>auto_awesome</Icon>}
                onClick={handleGenerateCustomEvidence}
                disabled={isGeneratingCustomEvidence || !customEvidencePrompt.trim()}
              >
                {isGeneratingCustomEvidence ? 'Generating Custom Evidence...' : 'Generate Custom Evidence'}
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Registers Section */}
          <Accordion sx={{ bgcolor: 'secondary.50', border: '1px solid', borderColor: 'secondary.200' }}>
            <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon color="secondary">menu_book</Icon>
                <Typography fontWeight={600}>Generate Registers & CAPA Records</Typography>
                {selectedRegisters.length > 0 && (
                  <Chip label={`${selectedRegisters.length} selected`} size="small" color="secondary" />
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Alert severity="info" icon={<Icon>lightbulb</Icon>} sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Generate digital registers with realistic dummy data for NABH audit. Registers include tables with entries spanning 9 months, CAPA documentation, and analysis data acceptable to auditors.
                </Typography>
              </Alert>

              {/* Register Selection */}
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Suggested Registers for {objective?.code}:
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 2, maxHeight: 250, overflow: 'auto' }}>
                <FormGroup>
                  {suggestedRegisters.map((register) => (
                    <FormControlLabel
                      key={register.id}
                      control={
                        <Checkbox
                          checked={selectedRegisters.includes(register.id)}
                          onChange={() => handleToggleRegister(register.id)}
                          color="secondary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" fontWeight={500}>{register.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{register.description}</Typography>
                        </Box>
                      }
                      sx={{
                        alignItems: 'flex-start',
                        mb: 1,
                        p: 1,
                        borderRadius: 1,
                        bgcolor: selectedRegisters.includes(register.id) ? 'secondary.50' : 'transparent',
                        '&:hover': { bgcolor: 'grey.100' },
                      }}
                    />
                  ))}
                </FormGroup>
              </Paper>

              <Button
                variant="contained"
                color="secondary"
                startIcon={isGeneratingRegisters ? <CircularProgress size={20} color="inherit" /> : <Icon>table_chart</Icon>}
                onClick={handleGenerateRegisters}
                disabled={isGeneratingRegisters || selectedRegisters.length === 0}
              >
                {isGeneratingRegisters ? 'Generating Registers...' : `Generate Selected Registers (${selectedRegisters.length})`}
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Generated Evidences Section - Always visible */}
          <Accordion defaultExpanded sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
            <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon color="info">folder_open</Icon>
                <Typography fontWeight={600}>Generated Evidence Documents & Registers</Typography>
                <Chip
                  label={savedEvidences.length}
                  size="small"
                  color="info"
                />
                {(isGeneratingDocuments || isGeneratingCustomEvidence || isGeneratingRegisters) && (
                  <CircularProgress size={16} sx={{ ml: 1 }} />
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {isLoadingEvidences ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={32} />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                    Loading saved evidences...
                  </Typography>
                </Box>
              ) : savedEvidences.length === 0 ? (
                <Alert severity="info" icon={<Icon>info</Icon>}>
                  <Typography variant="body2">
                    No generated documents yet. Use the sections above to generate evidence documents, custom documents, or registers.
                  </Typography>
                </Alert>
              ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {savedEvidences.map((evidence) => (
                      <Card key={evidence.id} variant="outlined" sx={{ overflow: 'visible' }}>
                        <CardContent sx={{ pb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Icon color={evidence.evidence_type === 'register' ? 'secondary' : evidence.evidence_type === 'custom' ? 'warning' : 'info'}>
                                {evidence.evidence_type === 'register' ? 'menu_book' : evidence.evidence_type === 'custom' ? 'edit_note' : 'description'}
                              </Icon>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {evidence.evidence_title}
                              </Typography>
                              <Chip
                                size="small"
                                label={evidence.evidence_type === 'register' ? 'Register' : evidence.evidence_type === 'custom' ? 'Custom' : 'Document'}
                                color={evidence.evidence_type === 'register' ? 'secondary' : evidence.evidence_type === 'custom' ? 'warning' : 'info'}
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                size="small"
                                label={`ID: ${evidence.id.substring(0, 8)}...`}
                                variant="outlined"
                              />
                              <Typography variant="caption" color="text.secondary">
                                {new Date(evidence.created_at).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>

                          {/* View Mode Tabs */}
                          <Tabs
                            value={evidenceViewModes[evidence.id] || 0}
                            onChange={(_, newValue) => setEvidenceViewModes(prev => ({ ...prev, [evidence.id]: newValue }))}
                            sx={{ minHeight: 40, mb: 2, borderBottom: 1, borderColor: 'divider' }}
                          >
                            <Tab
                              icon={<Icon sx={{ fontSize: 20 }}>visibility</Icon>}
                              iconPosition="start"
                              label="Preview"
                              sx={{ minHeight: 40, py: 1 }}
                            />
                            <Tab
                              icon={<Icon sx={{ fontSize: 20 }}>text_fields</Icon>}
                              iconPosition="start"
                              label="Edit Text"
                              sx={{ minHeight: 40, py: 1 }}
                            />
                            <Tab
                              icon={<Icon sx={{ fontSize: 20 }}>code</Icon>}
                              iconPosition="start"
                              label="Edit HTML"
                              sx={{ minHeight: 40, py: 1 }}
                            />
                          </Tabs>

                          {/* Preview Mode */}
                          {(evidenceViewModes[evidence.id] || 0) === 0 && (
                            <Paper
                              variant="outlined"
                              sx={{
                                bgcolor: 'white',
                                overflow: 'hidden',
                                minHeight: 500,
                              }}
                            >
                              {evidence.html_content ? (
                                <iframe
                                  srcDoc={evidence.html_content}
                                  title={evidence.evidence_title}
                                  sandbox="allow-same-origin allow-scripts"
                                  style={{
                                    width: '100%',
                                    height: '600px',
                                    border: 'none',
                                    display: 'block',
                                    backgroundColor: 'white',
                                  }}
                                />
                              ) : (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                  <Icon sx={{ fontSize: 48, color: 'grey.400' }}>error_outline</Icon>
                                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                                    No content available
                                  </Typography>
                                </Box>
                              )}
                            </Paper>
                          )}

                          {/* Edit Text Mode */}
                          {(evidenceViewModes[evidence.id] || 0) === 1 && (
                            <Box>
                              <Alert severity="info" icon={<Icon>info</Icon>} sx={{ mb: 2 }}>
                                <Typography variant="body2">
                                  Edit the text content below. Changes will update the HTML document.
                                </Typography>
                              </Alert>
                              <TextField
                                fullWidth
                                multiline
                                minRows={15}
                                maxRows={30}
                                value={editingEvidenceContent[evidence.id] ?? (evidence.generated_content || extractTextFromHTML(evidence.html_content))}
                                onChange={(e) => handleEditContent(evidence.id, e.target.value)}
                                sx={{
                                  '& .MuiInputBase-root': {
                                    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.6,
                                  },
                                }}
                                placeholder="Edit document text content..."
                              />
                              {editingEvidenceContent[evidence.id] !== undefined && editingEvidenceContent[evidence.id] !== (evidence.generated_content || extractTextFromHTML(evidence.html_content)) && (
                                <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => {
                                      setEditingEvidenceContent(prev => {
                                        const next = { ...prev };
                                        delete next[evidence.id];
                                        return next;
                                      });
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    startIcon={<Icon>save</Icon>}
                                    onClick={async () => {
                                      const newText = editingEvidenceContent[evidence.id];
                                      // Update both generated_content and regenerate simple HTML
                                      const simpleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${evidence.evidence_title} - ${hospitalConfig.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; line-height: 1.6; color: #333; padding: 20px; max-width: 800px; margin: 0 auto; }
    .header { text-align: center; border-bottom: 3px solid #1565C0; padding-bottom: 15px; margin-bottom: 20px; }
    .hospital-name { font-size: 24px; font-weight: bold; color: #1565C0; margin: 10px 0 5px; }
    .hospital-address { font-size: 11px; color: #666; }
    .doc-title { background: #1565C0; color: white; padding: 12px; font-size: 16px; font-weight: bold; text-align: center; margin: 20px 0; border-radius: 5px; }
    .content { padding: 20px 0; white-space: pre-wrap; line-height: 1.8; }
    .footer { margin-top: 30px; padding-top: 15px; border-top: 2px solid #1565C0; text-align: center; font-size: 10px; color: #666; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="hospital-name">${hospitalConfig.name}</div>
    <div class="hospital-address">${hospitalConfig.address}</div>
  </div>
  <div class="doc-title">${evidence.evidence_title}</div>
  <div class="content">${newText}</div>
  <div class="footer">
    <strong>${hospitalConfig.name}</strong> | ${hospitalConfig.address}<br>
    Phone: ${hospitalConfig.phone} | Email: ${hospitalConfig.email}
  </div>
</body>
</html>`;
                                      const result = await updateGeneratedEvidence(evidence.id, {
                                        generated_content: newText,
                                        html_content: simpleHtml,
                                      });
                                      if (result.success) {
                                        setSavedEvidences(prev =>
                                          prev.map(ev =>
                                            ev.id === evidence.id
                                              ? { ...ev, generated_content: newText, html_content: simpleHtml }
                                              : ev
                                          )
                                        );
                                        setSnackbarMessage('Evidence updated successfully');
                                        setSnackbarOpen(true);
                                        setEditingEvidenceContent(prev => {
                                          const next = { ...prev };
                                          delete next[evidence.id];
                                          return next;
                                        });
                                      }
                                    }}
                                  >
                                    Save Changes
                                  </Button>
                                </Box>
                              )}
                            </Box>
                          )}

                          {/* Edit HTML Mode */}
                          {(evidenceViewModes[evidence.id] || 0) === 2 && (
                            <Box>
                              <Alert severity="warning" icon={<Icon>code</Icon>} sx={{ mb: 2 }}>
                                <Typography variant="body2">
                                  Advanced: Edit the raw HTML code directly. Be careful with syntax.
                                </Typography>
                              </Alert>
                              <TextField
                                fullWidth
                                multiline
                                minRows={15}
                                maxRows={30}
                                value={editingEvidenceContent[`html-${evidence.id}`] ?? evidence.html_content}
                                onChange={(e) => handleEditContent(`html-${evidence.id}`, e.target.value)}
                                sx={{
                                  '& .MuiInputBase-root': {
                                    fontFamily: 'monospace',
                                    fontSize: '0.75rem',
                                    lineHeight: 1.4,
                                    bgcolor: '#1e1e1e',
                                    color: '#d4d4d4',
                                  },
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'grey.700',
                                  },
                                }}
                                placeholder="Edit HTML content..."
                              />
                              {editingEvidenceContent[`html-${evidence.id}`] && editingEvidenceContent[`html-${evidence.id}`] !== evidence.html_content && (
                                <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => {
                                      setEditingEvidenceContent(prev => {
                                        const next = { ...prev };
                                        delete next[`html-${evidence.id}`];
                                        return next;
                                      });
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="warning"
                                    startIcon={<Icon>save</Icon>}
                                    onClick={async () => {
                                      const newHtml = editingEvidenceContent[`html-${evidence.id}`];
                                      const result = await updateGeneratedEvidence(evidence.id, { html_content: newHtml });
                                      if (result.success) {
                                        setSavedEvidences(prev =>
                                          prev.map(ev => (ev.id === evidence.id ? { ...ev, html_content: newHtml } : ev))
                                        );
                                        setSnackbarMessage('HTML updated successfully');
                                        setSnackbarOpen(true);
                                        setEditingEvidenceContent(prev => {
                                          const next = { ...prev };
                                          delete next[`html-${evidence.id}`];
                                          return next;
                                        });
                                        setEvidenceViewModes(prev => ({ ...prev, [evidence.id]: 0 }));
                                      }
                                    }}
                                  >
                                    Save HTML
                                  </Button>
                                </Box>
                              )}
                            </Box>
                          )}
                        </CardContent>
                        <Divider />
                        <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Open in New Window">
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Icon>open_in_new</Icon>}
                                onClick={() => handlePreviewEvidence(evidence.html_content, evidence.evidence_title)}
                              >
                                Open
                              </Button>
                            </Tooltip>
                            <Tooltip title="Print Document">
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Icon>print</Icon>}
                                onClick={() => handlePrintEvidence(evidence.html_content)}
                              >
                                Print
                              </Button>
                            </Tooltip>
                            <Tooltip title="Delete Document">
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<Icon>delete</Icon>}
                                onClick={() => handleDeleteEvidence(evidence.id)}
                              >
                                Delete
                              </Button>
                            </Tooltip>
                          </Box>
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            startIcon={<Icon>share</Icon>}
                            onClick={() => handleCopyShareLink(evidence.id)}
                          >
                            Copy Share Link
                          </Button>
                        </CardActions>
                      </Card>
                    ))}
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>

          <TextField
            fullWidth
            label="Evidence Links"
            value={objective.evidenceLinks}
            onChange={(e) => handleFieldChange('evidenceLinks', e.target.value)}
            multiline
            minRows={2}
            size="small"
            placeholder="Add links to evidence documents..."
            sx={expandableTextFieldSx}
          />

          {/* File Upload */}
          <Box>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*,.pdf"
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              startIcon={<Icon>upload_file</Icon>}
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Evidence Files
            </Button>
          </Box>

          {/* Uploaded Files Grid */}
          {evidenceFiles.length > 0 && (
            <Grid container spacing={2}>
              {evidenceFiles.map((file) => (
                <Grid key={file.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card variant="outlined">
                    {file.type === 'image' ? (
                      <CardMedia
                        component="img"
                        height="140"
                        image={file.dataUrl}
                        alt={file.name}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 140,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'grey.100',
                        }}
                      >
                        <Icon sx={{ fontSize: 48, color: 'grey.500' }}>picture_as_pdf</Icon>
                      </Box>
                    )}
                    <CardContent sx={{ py: 1 }}>
                      <Typography variant="body2" noWrap>
                        {file.name}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() => window.open(file.dataUrl, '_blank')}
                        >
                          <Icon>visibility</Icon>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveFile(file.id)}
                        >
                          <Icon>delete</Icon>
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          <Divider />

          {/* YouTube Training Videos Section */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon color="error">play_circle</Icon>
                <Typography fontWeight={600}>
                  Training Videos ({(objective.youtubeVideos || []).length})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Existing Videos */}
                {(objective.youtubeVideos || []).length > 0 && (
                  <Grid container spacing={2}>
                    {(objective.youtubeVideos || []).map((video) => (
                      <Grid key={video.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card variant="outlined">
                          <CardMedia
                            component="img"
                            height="140"
                            image={getYouTubeThumbnail(video.url)}
                            alt={video.title}
                            sx={{ cursor: 'pointer' }}
                            onClick={() => window.open(video.url, '_blank')}
                          />
                          <CardContent sx={{ py: 1 }}>
                            <Typography variant="body2" fontWeight={600} noWrap>
                              {video.title}
                            </Typography>
                            {video.description && (
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {video.description}
                              </Typography>
                            )}
                          </CardContent>
                          <CardActions>
                            <Tooltip title="Watch Video">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => window.open(video.url, '_blank')}
                              >
                                <Icon>play_circle</Icon>
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove Video">
                              <IconButton
                                size="small"
                                onClick={() => video.id && handleRemoveVideo(video.id)}
                              >
                                <Icon>delete</Icon>
                              </IconButton>
                            </Tooltip>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* Add Video Form */}
                {showAddVideo ? (
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Add YouTube Video
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        fullWidth
                        label="Video Title"
                        value={newVideoTitle}
                        onChange={(e) => setNewVideoTitle(e.target.value)}
                        size="small"
                      />
                      <TextField
                        fullWidth
                        label="YouTube URL"
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                        size="small"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      <TextField
                        fullWidth
                        label="Interpretation (optional)"
                        value={newVideoDescription}
                        onChange={(e) => setNewVideoDescription(e.target.value)}
                        size="small"
                        multiline
                        rows={2}
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleAddVideo}
                          disabled={!newVideoTitle.trim() || !newVideoUrl.trim()}
                        >
                          Add Video
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setShowAddVideo(false)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<Icon>add</Icon>}
                    onClick={() => setShowAddVideo(true)}
                    size="small"
                  >
                    Add YouTube Video
                  </Button>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Training Materials Section */}
          <Accordion>
            <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon color="primary">school</Icon>
                <Typography fontWeight={600}>
                  Training Materials ({(objective.trainingMaterials || []).length})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Existing Materials */}
                {(objective.trainingMaterials || []).length > 0 && (
                  <Grid container spacing={2}>
                    {(objective.trainingMaterials || []).map((material) => (
                      <Grid key={material.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card variant="outlined">
                          {material.type === 'photo' ? (
                            <CardMedia
                              component="img"
                              height="140"
                              image={material.dataUrl || material.fileUrl}
                              alt={material.title}
                            />
                          ) : (
                            <Box
                              sx={{
                                height: 140,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'grey.100',
                              }}
                            >
                              <Icon sx={{ fontSize: 48, color: 'grey.500' }}>
                                {material.type === 'certificate' ? 'workspace_premium' : material.type === 'video' ? 'videocam' : 'description'}
                              </Icon>
                            </Box>
                          )}
                          <CardContent sx={{ py: 1 }}>
                            <Typography variant="body2" fontWeight={600} noWrap>
                              {material.title}
                            </Typography>
                            <Chip label={material.type} size="small" sx={{ mt: 0.5 }} />
                          </CardContent>
                          <CardActions>
                            <Tooltip title="View">
                              <IconButton
                                size="small"
                                onClick={() => window.open(material.dataUrl || material.fileUrl, '_blank')}
                              >
                                <Icon>visibility</Icon>
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveTrainingMaterial(material.id)}
                              >
                                <Icon>delete</Icon>
                              </IconButton>
                            </Tooltip>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* Add Training Form */}
                {showAddTraining ? (
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Add Training Material
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        fullWidth
                        label="Title"
                        value={newTrainingTitle}
                        onChange={(e) => setNewTrainingTitle(e.target.value)}
                        size="small"
                      />
                      <FormControl fullWidth size="small">
                        <InputLabel>Type</InputLabel>
                        <Select
                          value={newTrainingType}
                          label="Type"
                          onChange={(e) => setNewTrainingType(e.target.value as 'video' | 'photo' | 'document' | 'certificate')}
                        >
                          <MenuItem value="photo">Photo</MenuItem>
                          <MenuItem value="video">Video</MenuItem>
                          <MenuItem value="document">Document</MenuItem>
                          <MenuItem value="certificate">Certificate</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        fullWidth
                        label="Training Date"
                        type="date"
                        value={newTrainingDate}
                        onChange={(e) => setNewTrainingDate(e.target.value)}
                        size="small"
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                      <TextField
                        fullWidth
                        label="Interpretation"
                        value={newTrainingDescription}
                        onChange={(e) => setNewTrainingDescription(e.target.value)}
                        size="small"
                        multiline
                        rows={2}
                      />
                      <input
                        type="file"
                        ref={trainingFileInputRef}
                        onChange={handleTrainingFileUpload}
                        accept="image/*,video/*,.pdf,.doc,.docx"
                        style={{ display: 'none' }}
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => trainingFileInputRef.current?.click()}
                        >
                          Select File & Upload
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setShowAddTraining(false)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<Icon>add</Icon>}
                    onClick={() => setShowAddTraining(true)}
                    size="small"
                  >
                    Add Training Material
                  </Button>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* SOP Documents Section */}
          <Accordion>
            <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon color="success">policy</Icon>
                <Typography fontWeight={600}>
                  SOP Documents ({(objective.sopDocuments || []).length})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Existing SOPs */}
                {(objective.sopDocuments || []).length > 0 && (
                  <Grid container spacing={2}>
                    {(objective.sopDocuments || []).map((sop) => (
                      <Grid key={sop.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card variant="outlined">
                          <Box
                            sx={{
                              height: 100,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: 'success.50',
                            }}
                          >
                            <Icon sx={{ fontSize: 48, color: 'success.main' }}>policy</Icon>
                          </Box>
                          <CardContent sx={{ py: 1 }}>
                            <Typography variant="body2" fontWeight={600} noWrap>
                              {sop.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Version: {sop.version} | {sop.effectiveDate}
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Tooltip title="View SOP">
                              <IconButton
                                size="small"
                                onClick={() => window.open(sop.dataUrl, '_blank')}
                              >
                                <Icon>visibility</Icon>
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveSOP(sop.id)}
                              >
                                <Icon>delete</Icon>
                              </IconButton>
                            </Tooltip>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* Add SOP Form */}
                {showAddSOP ? (
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Add SOP Document
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        fullWidth
                        label="SOP Title"
                        value={newSOPTitle}
                        onChange={(e) => setNewSOPTitle(e.target.value)}
                        size="small"
                      />
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                          <TextField
                            fullWidth
                            label="Version"
                            value={newSOPVersion}
                            onChange={(e) => setNewSOPVersion(e.target.value)}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <TextField
                            fullWidth
                            label="Effective Date"
                            type="date"
                            value={newSOPEffectiveDate}
                            onChange={(e) => setNewSOPEffectiveDate(e.target.value)}
                            size="small"
                            slotProps={{ inputLabel: { shrink: true } }}
                          />
                        </Grid>
                      </Grid>
                      <TextField
                        fullWidth
                        label="Interpretation"
                        value={newSOPDescription}
                        onChange={(e) => setNewSOPDescription(e.target.value)}
                        size="small"
                        multiline
                        rows={2}
                      />
                      <input
                        type="file"
                        ref={sopFileInputRef}
                        onChange={handleSOPFileUpload}
                        accept=".pdf,.doc,.docx"
                        style={{ display: 'none' }}
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => sopFileInputRef.current?.click()}
                        >
                          Select File & Upload
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={isGeneratingSOP ? <CircularProgress size={16} /> : <Icon>auto_awesome</Icon>}
                          onClick={handleGenerateSOP}
                          disabled={isGeneratingSOP}
                        >
                          Generate
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setShowAddSOP(false)}
                        >
                          Cancel
                        </Button>
                      </Box>
                      {generatedSOPContent && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Generated SOP Content:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.75rem' }}
                          >
                            {generatedSOPContent}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<Icon>add</Icon>}
                    onClick={() => setShowAddSOP(true)}
                    size="small"
                  >
                    Add SOP Document
                  </Button>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>

          <Divider />

          {/* Notes */}
          <TextField
            fullWidth
            label="Notes"
            value={objective.notes || ''}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            multiline
            minRows={3}
            size="small"
            placeholder="Add any additional notes..."
            sx={expandableTextFieldSx}
          />
        </Box>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
