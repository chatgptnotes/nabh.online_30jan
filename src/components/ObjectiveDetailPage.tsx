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
import { useNABHStore } from '../store/nabhStore';
import type { Status, Priority, ElementCategory, EvidenceFile, YouTubeVideo, TrainingMaterial, SOPDocument } from '../types/nabh';
import { ASSIGNEE_OPTIONS, HOSPITAL_INFO } from '../config/hospitalConfig';
import { getClaudeApiKey } from '../lib/supabase';

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

  // State for AI Evidence Generator
  const [isGeneratingEvidence, setIsGeneratingEvidence] = useState(false);
  const [generatedEvidenceList, setGeneratedEvidenceList] = useState<string[]>([]);
  const [isGeneratingHindi, setIsGeneratingHindi] = useState(false);

  // Find chapter and objective
  const chapter = chapters.find((c) => c.id === chapterId);
  const objective = chapter?.objectives.find((o) => o.id === objectiveId);

  // Set selected chapter when page loads
  useEffect(() => {
    if (chapterId) {
      setSelectedChapter(chapterId);
    }
  }, [chapterId, setSelectedChapter]);

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

  const handleFieldChange = (field: string, value: string | Status | Priority | ElementCategory) => {
    updateObjective(chapter.id, objective.id, { [field]: value });
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
    updateObjective(chapter.id, objective.id, {
      evidenceFiles: [...existingFiles, ...newFiles],
    });
  };

  const handleRemoveFile = (fileId: string) => {
    const existingFiles = objective.evidenceFiles || [];
    updateObjective(chapter.id, objective.id, {
      evidenceFiles: existingFiles.filter((f) => f.id !== fileId),
    });
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
    updateObjective(chapter.id, objective.id, {
      youtubeVideos: [...existingVideos, newVideo],
    });

    setNewVideoTitle('');
    setNewVideoUrl('');
    setNewVideoDescription('');
    setShowAddVideo(false);
  };

  const handleRemoveVideo = (videoId: string) => {
    const existingVideos = objective.youtubeVideos || [];
    updateObjective(chapter.id, objective.id, {
      youtubeVideos: existingVideos.filter((v) => v.id !== videoId),
    });
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
    updateObjective(chapter.id, objective.id, {
      trainingMaterials: [...existingMaterials, newMaterial],
    });

    setNewTrainingTitle('');
    setNewTrainingDescription('');
    setNewTrainingDate('');
    setShowAddTraining(false);
  };

  const handleRemoveTrainingMaterial = (materialId: string) => {
    const existingMaterials = objective.trainingMaterials || [];
    updateObjective(chapter.id, objective.id, {
      trainingMaterials: existingMaterials.filter((m) => m.id !== materialId),
    });
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
    updateObjective(chapter.id, objective.id, {
      sopDocuments: [...existingSOPs, newSOP],
    });

    setNewSOPTitle('');
    setNewSOPVersion('1.0');
    setNewSOPEffectiveDate('');
    setNewSOPDescription('');
    setShowAddSOP(false);
  };

  const handleRemoveSOP = (sopId: string) => {
    const existingSOPs = objective.sopDocuments || [];
    updateObjective(chapter.id, objective.id, {
      sopDocuments: existingSOPs.filter((s) => s.id !== sopId),
    });
  };

  // Generate SOP using AI
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

  // Generate AI Evidence List based on interpretation
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
          {objective.hindiExplanation && (
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
                    This explanation is for staff training purposes. Share with your team.
                  </Typography>
                </Alert>
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
              </AccordionDetails>
            </Accordion>
          )}

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

          {/* AI Evidence Generator Section */}
          <Accordion defaultExpanded sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
            <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon color="primary">auto_awesome</Icon>
                <Typography fontWeight={600}>AI Evidence Generator</Typography>
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
                {isGeneratingEvidence ? 'Generating Evidence List...' : 'Generate Evidence List with AI'}
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
            helperText="List evidences in order of priority. Use AI generator above to auto-generate."
          />
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
                          Generate with AI
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
    </Box>
  );
}
