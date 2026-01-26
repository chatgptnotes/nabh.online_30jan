import { useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
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
import { useNABHStore } from '../store/nabhStore';
import type { Status, Priority, ElementCategory, EvidenceFile, YouTubeVideo, TrainingMaterial } from '../types/nabh';
import { ASSIGNEE_OPTIONS } from '../config/hospitalConfig';

interface ObjectiveDetailProps {
  open: boolean;
  onClose: () => void;
  chapterId: string;
  objectiveId: string | null;
}

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

export default function ObjectiveDetail({
  open,
  onClose,
  chapterId,
  objectiveId,
}: ObjectiveDetailProps) {
  const { chapters, updateObjective } = useNABHStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const trainingFileInputRef = useRef<HTMLInputElement>(null);

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

  const chapter = chapters.find((c) => c.id === chapterId);
  const objective = chapter?.objectives.find((o) => o.id === objectiveId);

  if (!objective) return null;

  const handleFieldChange = (field: string, value: string) => {
    updateObjective(chapterId, objective.id, { [field]: value });
  };

  // Helper to generate unique ID
  const generateId = (prefix: string) => {
    return `${prefix}-${crypto.randomUUID()}`;
  };

  // YouTube video handlers
  const handleAddYouTubeVideo = () => {
    if (!newVideoTitle.trim() || !newVideoUrl.trim()) return;

    const newVideo: YouTubeVideo = {
      id: generateId('video'),
      title: newVideoTitle.trim(),
      url: newVideoUrl.trim(),
      description: newVideoDescription.trim() || undefined,
      addedBy: 'Staff',
      addedAt: new Date().toISOString(),
    };

    const currentVideos = objective.youtubeVideos || [];
    updateObjective(chapterId, objective.id, {
      youtubeVideos: [...currentVideos, newVideo],
    });

    setNewVideoTitle('');
    setNewVideoUrl('');
    setNewVideoDescription('');
    setShowAddVideo(false);
  };

  const handleDeleteVideo = (videoId: string) => {
    const currentVideos = objective.youtubeVideos || [];
    updateObjective(chapterId, objective.id, {
      youtubeVideos: currentVideos.filter((v) => v.id !== videoId),
    });
  };

  // Training material handlers
  const handleTrainingFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'application/pdf'];
    const maxSize = 50 * 1024 * 1024; // 50MB for videos

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`File "${file.name}" is not supported. Only images, videos (MP4, WebM) and PDFs are allowed.`);
        return;
      }

      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Maximum size is 50MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const fileType = file.type.startsWith('image/') ? 'photo' :
                         file.type.startsWith('video/') ? 'video' : 'document';

        const newMaterial: TrainingMaterial = {
          id: generateId('training'),
          type: fileType,
          title: newTrainingTitle.trim() || file.name,
          description: newTrainingDescription.trim() || undefined,
          dataUrl,
          uploadedBy: 'Staff',
          uploadedAt: new Date().toISOString(),
          trainingDate: newTrainingDate || undefined,
        };

        const currentMaterials = objective.trainingMaterials || [];
        updateObjective(chapterId, objective.id, {
          trainingMaterials: [...currentMaterials, newMaterial],
        });
      };
      reader.readAsDataURL(file);
    });

    // Reset
    setNewTrainingTitle('');
    setNewTrainingDescription('');
    setNewTrainingDate('');
    setShowAddTraining(false);
    if (trainingFileInputRef.current) {
      trainingFileInputRef.current.value = '';
    }
  };

  const handleDeleteTrainingMaterial = (materialId: string) => {
    const currentMaterials = objective.trainingMaterials || [];
    updateObjective(chapterId, objective.id, {
      trainingMaterials: currentMaterials.filter((m) => m.id !== materialId),
    });
  };

  const getYouTubeThumbnail = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : '';
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`File "${file.name}" is not supported. Only images (JPEG, PNG, GIF, WebP) and PDFs are allowed.`);
        return;
      }

      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const newFile: EvidenceFile = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'pdf',
          size: file.size,
          dataUrl,
          uploadedAt: new Date().toISOString(),
        };

        const currentFiles = objective.evidenceFiles || [];
        updateObjective(chapterId, objective.id, {
          evidenceFiles: [...currentFiles, newFile],
        });
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteFile = (fileId: string) => {
    const currentFiles = objective.evidenceFiles || [];
    updateObjective(chapterId, objective.id, {
      evidenceFiles: currentFiles.filter((f) => f.id !== fileId),
    });
  };

  const handleViewFile = (file: EvidenceFile) => {
    const newWindow = window.open();
    if (newWindow) {
      if (file.type === 'pdf') {
        newWindow.document.write(`
          <html>
            <head><title>${file.name}</title></head>
            <body style="margin:0;padding:0;">
              <embed src="${file.dataUrl}" type="application/pdf" width="100%" height="100%" />
            </body>
          </html>
        `);
      } else {
        newWindow.document.write(`
          <html>
            <head><title>${file.name}</title></head>
            <body style="margin:0;padding:20px;background:#1a1a1a;display:flex;justify-content:center;align-items:center;min-height:100vh;">
              <img src="${file.dataUrl}" style="max-width:100%;max-height:100%;object-fit:contain;" alt="${file.name}" />
            </body>
          </html>
        `);
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const evidenceFiles = objective.evidenceFiles || [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon color="primary">description</Icon>
            <Typography variant="h6" fontWeight={600}>
              {objective.code}
            </Typography>
            {objective.isCore && (
              <Chip label="CORE" size="small" color="error" />
            )}
            {objective.priority === 'Prev NC' && (
              <Chip label="Prev NC" size="small" color="warning" />
            )}
            <Chip label={objective.category} size="small" variant="outlined" />
          </Box>
          <IconButton onClick={onClose}>
            <Icon>close</Icon>
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Title */}
          <TextField
            fullWidth
            label="Title"
            value={objective.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            size="small"
          />

          {/* Description */}
          <TextField
            fullWidth
            label="Description"
            value={objective.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            multiline
            minRows={3}
            size="small"
            sx={expandableTextFieldSx}
          />

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
                          <Box
                            sx={{
                              position: 'relative',
                              paddingTop: '56.25%',
                              bgcolor: 'grey.900',
                              cursor: 'pointer',
                            }}
                            onClick={() => window.open(video.url, '_blank')}
                          >
                            <Box
                              component="img"
                              src={getYouTubeThumbnail(video.url)}
                              alt={video.title}
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                bgcolor: 'rgba(255,0,0,0.8)',
                                borderRadius: '50%',
                                width: 48,
                                height: 48,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Icon sx={{ color: 'white', fontSize: 28 }}>play_arrow</Icon>
                            </Box>
                          </Box>
                          <CardContent sx={{ pb: 1 }}>
                            <Tooltip title={video.title}>
                              <Typography variant="subtitle2" noWrap fontWeight={600}>
                                {video.title}
                              </Typography>
                            </Tooltip>
                            {video.description && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                {video.description}
                              </Typography>
                            )}
                          </CardContent>
                          <CardActions sx={{ pt: 0 }}>
                            <Button
                              size="small"
                              startIcon={<Icon>open_in_new</Icon>}
                              onClick={() => window.open(video.url, '_blank')}
                            >
                              Watch
                            </Button>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteVideo(video.id)}
                            >
                              <Icon fontSize="small">delete</Icon>
                            </IconButton>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* Add Video Form */}
                {showAddVideo ? (
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Add YouTube Video
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Video Title"
                        placeholder="e.g., Hand Hygiene Training"
                        value={newVideoTitle}
                        onChange={(e) => setNewVideoTitle(e.target.value)}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="YouTube URL"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="Description (optional)"
                        placeholder="Brief description of the video"
                        value={newVideoDescription}
                        onChange={(e) => setNewVideoDescription(e.target.value)}
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Icon>add</Icon>}
                          onClick={handleAddYouTubeVideo}
                          disabled={!newVideoTitle.trim() || !newVideoUrl.trim()}
                        >
                          Add Video
                        </Button>
                        <Button
                          size="small"
                          onClick={() => setShowAddVideo(false)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<Icon>add</Icon>}
                    onClick={() => setShowAddVideo(true)}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Add YouTube Video
                  </Button>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Internal Training Evidence Section */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon color="success">school</Icon>
                <Typography fontWeight={600}>
                  Internal Training Evidence ({(objective.trainingMaterials || []).length})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Upload training photos, videos, certificates, and attendance sheets as evidence of staff training.
                </Typography>
              </Alert>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Existing Training Materials */}
                {(objective.trainingMaterials || []).length > 0 && (
                  <Grid container spacing={2}>
                    {(objective.trainingMaterials || []).map((material) => (
                      <Grid key={material.id} size={{ xs: 6, sm: 4, md: 3 }}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          {material.type === 'photo' && material.dataUrl && (
                            <CardMedia
                              component="img"
                              height="120"
                              image={material.dataUrl}
                              alt={material.title}
                              sx={{ objectFit: 'cover', cursor: 'pointer' }}
                              onClick={() => window.open(material.dataUrl, '_blank')}
                            />
                          )}
                          {material.type === 'video' && (
                            <Box
                              sx={{
                                height: 120,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'primary.dark',
                              }}
                            >
                              <Icon sx={{ fontSize: 48, color: 'white' }}>videocam</Icon>
                            </Box>
                          )}
                          {material.type === 'document' && (
                            <Box
                              sx={{
                                height: 120,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'error.light',
                              }}
                            >
                              <Icon sx={{ fontSize: 48, color: 'white' }}>description</Icon>
                            </Box>
                          )}
                          {material.type === 'certificate' && (
                            <Box
                              sx={{
                                height: 120,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'success.light',
                              }}
                            >
                              <Icon sx={{ fontSize: 48, color: 'white' }}>workspace_premium</Icon>
                            </Box>
                          )}
                          <CardContent sx={{ pb: 1 }}>
                            <Tooltip title={material.title}>
                              <Typography variant="caption" noWrap fontWeight={600} sx={{ display: 'block' }}>
                                {material.title}
                              </Typography>
                            </Tooltip>
                            <Chip
                              label={material.type}
                              size="small"
                              sx={{ mt: 0.5, height: 20, fontSize: 10 }}
                            />
                            {material.trainingDate && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                Training: {material.trainingDate}
                              </Typography>
                            )}
                          </CardContent>
                          <CardActions sx={{ pt: 0 }}>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteTrainingMaterial(material.id)}
                            >
                              <Icon fontSize="small">delete</Icon>
                            </IconButton>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* Add Training Material Form */}
                {showAddTraining ? (
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Add Training Evidence
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Type</InputLabel>
                        <Select
                          value={newTrainingType}
                          label="Type"
                          onChange={(e) => setNewTrainingType(e.target.value as typeof newTrainingType)}
                        >
                          <MenuItem value="photo">Training Photo</MenuItem>
                          <MenuItem value="video">Training Video</MenuItem>
                          <MenuItem value="document">Attendance Sheet / Document</MenuItem>
                          <MenuItem value="certificate">Certificate</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        fullWidth
                        size="small"
                        label="Title"
                        placeholder="e.g., Hand Hygiene Training Session"
                        value={newTrainingTitle}
                        onChange={(e) => setNewTrainingTitle(e.target.value)}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="Description (optional)"
                        placeholder="Brief description"
                        value={newTrainingDescription}
                        onChange={(e) => setNewTrainingDescription(e.target.value)}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="Training Date"
                        type="date"
                        value={newTrainingDate}
                        onChange={(e) => setNewTrainingDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Icon>upload</Icon>}
                          onClick={() => trainingFileInputRef.current?.click()}
                        >
                          Upload File
                        </Button>
                        <Button
                          size="small"
                          onClick={() => setShowAddTraining(false)}
                        >
                          Cancel
                        </Button>
                      </Box>
                      <input
                        ref={trainingFileInputRef}
                        type="file"
                        accept="image/*,video/mp4,video/webm,application/pdf"
                        onChange={handleTrainingFileUpload}
                        style={{ display: 'none' }}
                      />
                    </Box>
                  </Card>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<Icon>add</Icon>}
                    onClick={() => setShowAddTraining(true)}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Add Training Evidence
                  </Button>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>

          <Divider />

          {/* Status, Priority, Category, Assignee Row */}
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
                  <MenuItem value="Blocked">Blocked</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
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
                  <MenuItem value="P0">P0</MenuItem>
                  <MenuItem value="P1">P1</MenuItem>
                  <MenuItem value="P2">P2</MenuItem>
                  <MenuItem value="P3">P3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={objective.category || ''}
                  label="Category"
                  onChange={(e) => handleFieldChange('category', e.target.value as ElementCategory)}
                >
                  <MenuItem value="Core">Core</MenuItem>
                  <MenuItem value="Commitment">Commitment</MenuItem>
                  <MenuItem value="Achievement">Achievement</MenuItem>
                  <MenuItem value="Excellence">Excellence</MenuItem>
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
                  <MenuItem value="">Not Assigned</MenuItem>
                  {ASSIGNEE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider />

          {/* Dates Row */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Start Date"
                type="date"
                value={objective.startDate}
                onChange={(e) => handleFieldChange('startDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="End Date"
                type="date"
                value={objective.endDate}
                onChange={(e) => handleFieldChange('endDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Divider />

          {/* Evidence List */}
          <TextField
            fullWidth
            label="Evidence List"
            value={objective.evidencesList}
            onChange={(e) => handleFieldChange('evidencesList', e.target.value)}
            multiline
            minRows={3}
            size="small"
            placeholder="List the required evidences for this objective element..."
            sx={expandableTextFieldSx}
          />

          {/* Evidence Links */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <TextField
                fullWidth
                label="Evidence Links (comma-separated)"
                value={objective.evidenceLinks}
                onChange={(e) => handleFieldChange('evidenceLinks', e.target.value)}
                multiline
                minRows={2}
                size="small"
                placeholder="file1.pdf, file2.docx, folder/file3.xlsx"
                helperText="Enter file names or links separated by commas"
                sx={expandableTextFieldSx}
              />
              <Tooltip title="Upload files to add links">
                <Button
                  variant="outlined"
                  sx={{ minWidth: 'auto', px: 2, py: 1.5, mt: 0.5 }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Icon>upload_file</Icon>
                </Button>
              </Tooltip>
            </Box>
          </Box>

          {/* Evidence File Upload Section */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                <Icon sx={{ verticalAlign: 'middle', mr: 1 }}>attach_file</Icon>
                Evidence Files ({evidenceFiles.length})
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Icon>upload_file</Icon>}
                onClick={() => fileInputRef.current?.click()}
                size="small"
              >
                Upload Evidence
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                multiple
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </Box>

            {evidenceFiles.length === 0 ? (
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  bgcolor: 'action.hover',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.selected',
                  },
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Icon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}>cloud_upload</Icon>
                <Typography variant="body1" color="text.secondary">
                  Click to upload or drag and drop
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Images (JPEG, PNG, GIF, WebP) or PDF files. Max 10MB each.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {evidenceFiles.map((file) => (
                  <Grid key={file.id} size={{ xs: 6, sm: 4, md: 3 }}>
                    <Card
                      sx={{
                        position: 'relative',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {file.type === 'image' ? (
                        <CardMedia
                          component="img"
                          height="120"
                          image={file.dataUrl}
                          alt={file.name}
                          sx={{
                            objectFit: 'cover',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleViewFile(file)}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: 120,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'error.light',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleViewFile(file)}
                        >
                          <Icon sx={{ fontSize: 48, color: 'error.contrastText' }}>picture_as_pdf</Icon>
                        </Box>
                      )}
                      <Box sx={{ p: 1, flexGrow: 1 }}>
                        <Tooltip title={file.name}>
                          <Typography
                            variant="caption"
                            noWrap
                            sx={{ display: 'block', fontWeight: 500 }}
                          >
                            {file.name}
                          </Typography>
                        </Tooltip>
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(file.size)}
                        </Typography>
                      </Box>
                      <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
                        <Tooltip title="View">
                          <IconButton size="small" onClick={() => handleViewFile(file)}>
                            <Icon fontSize="small">visibility</Icon>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteFile(file.id)}
                          >
                            <Icon fontSize="small">delete</Icon>
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
                {/* Add more button */}
                <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                  <Card
                    sx={{
                      height: '100%',
                      minHeight: 180,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px dashed',
                      borderColor: 'divider',
                      bgcolor: 'transparent',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover',
                      },
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Icon sx={{ fontSize: 32, color: 'text.secondary' }}>add</Icon>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Add more
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Box>

          {/* Deliverable */}
          <TextField
            fullWidth
            label="Deliverable"
            value={objective.deliverable}
            onChange={(e) => handleFieldChange('deliverable', e.target.value)}
            multiline
            minRows={2}
            size="small"
            placeholder="What is the expected deliverable for this objective..."
            sx={expandableTextFieldSx}
          />

          <Divider />

          {/* Notes */}
          <TextField
            fullWidth
            label="Notes"
            value={objective.notes}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            multiline
            minRows={3}
            placeholder="Add notes, comments, or additional information..."
            sx={expandableTextFieldSx}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          startIcon={<Icon>save</Icon>}
          onClick={onClose}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
