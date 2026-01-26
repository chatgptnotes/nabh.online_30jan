import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Icon from '@mui/material/Icon';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import LinearProgress from '@mui/material/LinearProgress';
import { extractFromDocument, generateImprovedDocument, analyzeDocument } from '../services/documentExtractor';
import { HOSPITAL_INFO } from '../config/hospitalConfig';

interface StationeryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  originalFile?: string;
  originalFileName?: string;
  originalFileType?: string;
  extractedText?: string;
  analyzedData?: {
    documentType: string;
    sections: { heading: string; content: string }[];
    suggestions?: string[];
  };
  improvedContent?: string;
  userSuggestions: string[];
  status: 'pending' | 'extracted' | 'improved' | 'approved';
  createdAt: string;
  updatedAt: string;
}

const STATIONERY_CATEGORIES = [
  { id: 'forms', label: 'Patient Forms', icon: 'assignment', examples: ['Registration Form', 'Consent Form', 'Discharge Summary'] },
  { id: 'registers', label: 'Registers', icon: 'menu_book', examples: ['OPD Register', 'IPD Register', 'Medication Error Register'] },
  { id: 'letterheads', label: 'Letterheads', icon: 'mail', examples: ['Official Letterhead', 'Prescription Pad', 'Medical Certificate'] },
  { id: 'certificates', label: 'Certificates', icon: 'workspace_premium', examples: ['Birth Certificate', 'Death Certificate', 'Fitness Certificate'] },
  { id: 'consent', label: 'Consent Forms', icon: 'fact_check', examples: ['Surgical Consent', 'Blood Transfusion Consent', 'Anesthesia Consent'] },
  { id: 'reports', label: 'Report Templates', icon: 'summarize', examples: ['Lab Report', 'Radiology Report', 'Discharge Report'] },
  { id: 'labels', label: 'Labels & Tags', icon: 'label', examples: ['Patient Wristband', 'Medication Label', 'Sample Label'] },
  { id: 'checklists', label: 'Checklists', icon: 'checklist', examples: ['Surgical Safety Checklist', 'Nursing Checklist', 'Audit Checklist'] },
  { id: 'sops', label: 'SOPs', icon: 'description', examples: ['Procedure SOPs', 'Safety SOPs', 'Quality SOPs'] },
  { id: 'other', label: 'Other Documents', icon: 'folder', examples: ['Policies', 'Guidelines', 'Manuals'] },
];

const WORKFLOW_STEPS = ['Upload Document', 'Extract Content', 'Add Suggestions', 'Generate Improved'];

export default function StationeryPage() {
  const [stationeryItems, setStationeryItems] = useState<StationeryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StationeryItem | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Form states
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('forms');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string>('');
  const [extractedText, setExtractedText] = useState('');
  const [analyzedData, setAnalyzedData] = useState<StationeryItem['analyzedData'] | null>(null);
  const [userSuggestion, setUserSuggestion] = useState('');
  const [improvedContent, setImprovedContent] = useState('');

  // Loading states
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load stationery items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nabh_stationery_items');
    if (saved) {
      setStationeryItems(JSON.parse(saved));
    }
  }, []);

  // Save stationery items to localStorage
  useEffect(() => {
    if (stationeryItems.length > 0) {
      localStorage.setItem('nabh_stationery_items', JSON.stringify(stationeryItems));
    }
  }, [stationeryItems]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setActiveStep(0);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setUploadedFilePreview('');
    }

    // Auto-extract text
    await handleExtractText(file);
  };

  const handleExtractText = async (file: File) => {
    setIsExtracting(true);
    setSnackbar({ open: true, message: 'Extracting text from document...', severity: 'info' });

    try {
      const result = await extractFromDocument(file, newItemCategory);
      if (result.success) {
        setExtractedText(result.text);
        setActiveStep(1);
        setSnackbar({ open: true, message: 'Text extracted successfully!', severity: 'success' });

        // Auto-analyze the document
        await handleAnalyzeDocument(result.text);
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to extract text', severity: 'error' });
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      setSnackbar({ open: true, message: 'Failed to extract text from document', severity: 'error' });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAnalyzeDocument = async (text: string) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeDocument(text, 'stationery');
      setAnalyzedData({
        documentType: analysis.documentType,
        sections: analysis.sections,
        suggestions: analysis.suggestions,
      });

      // Auto-fill name if detected
      if (analysis.title && !newItemName) {
        setNewItemName(analysis.title);
      }
    } catch (error) {
      console.error('Error analyzing document:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateImproved = async () => {
    if (!extractedText) {
      setSnackbar({ open: true, message: 'Please extract text first', severity: 'error' });
      return;
    }

    setIsGenerating(true);
    setActiveStep(3);
    setSnackbar({ open: true, message: 'Generating improved document...', severity: 'info' });

    try {
      const content = await generateImprovedDocument(
        extractedText,
        'stationery',
        userSuggestion,
        HOSPITAL_INFO.name
      );

      if (content) {
        setImprovedContent(content);
        setSnackbar({ open: true, message: 'Improved document generated!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to generate document', severity: 'error' });
      }
    } catch (error) {
      console.error('Error generating document:', error);
      setSnackbar({ open: true, message: 'Failed to generate improved document', severity: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveItem = () => {
    if (!newItemName.trim()) {
      setSnackbar({ open: true, message: 'Please enter a name for the document', severity: 'error' });
      return;
    }

    const newItem: StationeryItem = {
      id: `stationery_${Date.now()}`,
      name: newItemName,
      category: newItemCategory,
      description: newItemDescription,
      originalFile: uploadedFilePreview,
      originalFileName: uploadedFile?.name,
      originalFileType: uploadedFile?.type,
      extractedText: extractedText,
      analyzedData: analyzedData || undefined,
      improvedContent: improvedContent,
      userSuggestions: userSuggestion ? [userSuggestion] : [],
      status: improvedContent ? 'improved' : extractedText ? 'extracted' : 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setStationeryItems(prev => [...prev, newItem]);
    setIsUploadDialogOpen(false);
    resetForm();
    setSnackbar({ open: true, message: 'Document saved successfully!', severity: 'success' });
  };

  const resetForm = () => {
    setNewItemName('');
    setNewItemCategory('forms');
    setNewItemDescription('');
    setUploadedFile(null);
    setUploadedFilePreview('');
    setExtractedText('');
    setAnalyzedData(null);
    setUserSuggestion('');
    setImprovedContent('');
    setActiveStep(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReprocessItem = async (item: StationeryItem) => {
    setSelectedItem(item);
    setNewItemName(item.name);
    setNewItemCategory(item.category);
    setNewItemDescription(item.description);
    setExtractedText(item.extractedText || '');
    setUserSuggestion(item.userSuggestions.join('\n'));
    setImprovedContent(item.improvedContent || '');
    setUploadedFilePreview(item.originalFile || '');
    setActiveStep(item.extractedText ? 2 : 0);
    setIsUploadDialogOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    setStationeryItems(prev => prev.filter(item => item.id !== itemId));
    setSnackbar({ open: true, message: 'Document deleted', severity: 'success' });
  };

  const handlePrintDocument = (content: string) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const filteredItems = selectedCategory === 'all'
    ? stationeryItems
    : stationeryItems.filter(item => item.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'extracted': return 'info';
      case 'improved': return 'success';
      case 'approved': return 'primary';
      default: return 'warning';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'extracted': return 'text_snippet';
      case 'improved': return 'check_circle';
      case 'approved': return 'verified';
      default: return 'pending';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="primary">
            Hospital Stationery
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload existing documents, extract content, and generate improved NABH-compliant versions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Icon>upload_file</Icon>}
          onClick={() => { resetForm(); setIsUploadDialogOpen(true); }}
          size="large"
        >
          Upload Document
        </Button>
      </Box>

      {/* Quick Info */}
      <Alert severity="info" icon={<Icon>lightbulb</Icon>} sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>How it works:</strong> Upload your existing hospital documents (PDF, Word, or images) and the system will extract the content,
          analyze it, and generate professionally formatted, NABH-compliant versions. You can add your suggestions for improvements before generating.
        </Typography>
      </Alert>

      {/* Category Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedCategory}
          onChange={(_, value) => setSelectedCategory(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab value="all" label="All Documents" icon={<Icon>folder</Icon>} iconPosition="start" />
          {STATIONERY_CATEGORIES.map(cat => (
            <Tab key={cat.id} value={cat.id} label={cat.label} icon={<Icon>{cat.icon}</Icon>} iconPosition="start" />
          ))}
        </Tabs>
      </Paper>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.50' }}>
            <Typography variant="h4" color="primary" fontWeight={700}>{stationeryItems.length}</Typography>
            <Typography variant="body2" color="text.secondary">Total Documents</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.50' }}>
            <Typography variant="h4" color="warning.main" fontWeight={700}>
              {stationeryItems.filter(i => i.status === 'pending').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">Pending Extraction</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.50' }}>
            <Typography variant="h4" color="info.main" fontWeight={700}>
              {stationeryItems.filter(i => i.status === 'extracted').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">Text Extracted</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.50' }}>
            <Typography variant="h4" color="success.main" fontWeight={700}>
              {stationeryItems.filter(i => i.status === 'improved').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">Improved & Ready</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Documents Grid */}
      {filteredItems.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Icon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}>inventory_2</Icon>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No documents yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Upload your existing hospital stationery to extract and improve them
          </Typography>
          <Button variant="contained" startIcon={<Icon>upload_file</Icon>} onClick={() => setIsUploadDialogOpen(true)}>
            Upload First Document
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredItems.map(item => (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Chip
                      label={STATIONERY_CATEGORIES.find(c => c.id === item.category)?.label || item.category}
                      size="small"
                      icon={<Icon sx={{ fontSize: 16 }}>{STATIONERY_CATEGORIES.find(c => c.id === item.category)?.icon}</Icon>}
                    />
                    <Chip
                      label={item.status}
                      size="small"
                      color={getStatusColor(item.status)}
                      icon={<Icon sx={{ fontSize: 16 }}>{getStatusIcon(item.status)}</Icon>}
                    />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, height: 40, overflow: 'hidden' }}>
                    {item.description || item.originalFileName || 'No description'}
                  </Typography>
                  {item.analyzedData?.suggestions && item.analyzedData.suggestions.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">AI Suggestions:</Typography>
                      <Typography variant="caption" display="block" color="info.main" noWrap>
                        {item.analyzedData.suggestions[0]}
                      </Typography>
                    </Box>
                  )}
                  {item.originalFile && (
                    <Box sx={{ mt: 1, height: 80, overflow: 'hidden', borderRadius: 1, bgcolor: 'grey.100' }}>
                      <img src={item.originalFile} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => { setSelectedItem(item); setIsViewDialogOpen(true); }}>
                        <Icon>visibility</Icon>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Re-process">
                      <IconButton size="small" color="primary" onClick={() => handleReprocessItem(item)}>
                        <Icon>refresh</Icon>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => handleDeleteItem(item.id)}>
                        <Icon>delete</Icon>
                      </IconButton>
                    </Tooltip>
                  </Box>
                  {item.improvedContent && (
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={<Icon>print</Icon>}
                      onClick={() => handlePrintDocument(item.improvedContent!)}
                    >
                      Print
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Upload/Process Dialog */}
      <Dialog open={isUploadDialogOpen} onClose={() => setIsUploadDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon color="primary">upload_file</Icon>
            {selectedItem ? 'Re-process Document' : 'Upload & Improve Document'}
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Workflow Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 3, mt: 1 }}>
            {WORKFLOW_STEPS.map((label, index) => (
              <Step key={label} completed={activeStep > index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Grid container spacing={3}>
            {/* Left Column - Upload & Details */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Document Details</Typography>
                <TextField
                  fullWidth
                  label="Document Name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g., Patient Registration Form"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  size="small"
                  sx={{ mb: 2 }}
                  slotProps={{ select: { native: true } }}
                >
                  {STATIONERY_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Description (optional)"
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  size="small"
                />
              </Paper>

              {/* File Upload Area */}
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Upload Original Document</Typography>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx"
                  style={{ display: 'none' }}
                />
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadedFilePreview ? (
                    <Box>
                      <img src={uploadedFilePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 150, borderRadius: 8 }} />
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>{uploadedFile?.name}</Typography>
                    </Box>
                  ) : uploadedFile ? (
                    <Box>
                      <Icon sx={{ fontSize: 48, color: 'primary.main' }}>description</Icon>
                      <Typography variant="body2">{uploadedFile.name}</Typography>
                    </Box>
                  ) : (
                    <>
                      <Icon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}>cloud_upload</Icon>
                      <Typography variant="body2" color="text.secondary">
                        Click to upload document
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Supports PDF, Word, and images
                      </Typography>
                    </>
                  )}
                </Box>
                {isExtracting && (
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress />
                    <Typography variant="caption" color="text.secondary">Extracting text...</Typography>
                  </Box>
                )}
              </Paper>

              {/* User Suggestions */}
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Your Improvement Suggestions</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={userSuggestion}
                  onChange={(e) => { setUserSuggestion(e.target.value); setActiveStep(Math.max(activeStep, 2)); }}
                  placeholder="What improvements would you like?&#10;e.g., Add NABH logo, include patient photo field, add QR code..."
                  size="small"
                />
              </Paper>
            </Grid>

            {/* Right Column - Extracted & Improved */}
            <Grid size={{ xs: 12, md: 7 }}>
              {/* Extracted Text */}
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">Extracted Content</Typography>
                  {isAnalyzing && <CircularProgress size={16} />}
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  placeholder="Extracted text will appear here after uploading a document..."
                  size="small"
                />
                {analyzedData?.suggestions && analyzedData.suggestions.length > 0 && (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    <Typography variant="caption" fontWeight={600}>AI Analysis Suggestions:</Typography>
                    <ul style={{ margin: '4px 0', paddingLeft: 20 }}>
                      {analyzedData.suggestions.slice(0, 3).map((s, i) => (
                        <li key={i}><Typography variant="caption">{s}</Typography></li>
                      ))}
                    </ul>
                  </Alert>
                )}
              </Paper>

              {/* Generate Button */}
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <Icon>auto_awesome</Icon>}
                  onClick={handleGenerateImproved}
                  disabled={isGenerating || !extractedText}
                  sx={{ px: 4 }}
                >
                  {isGenerating ? 'Generating...' : 'Generate Improved Document'}
                </Button>
              </Box>

              {/* Improved Preview */}
              {improvedContent && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">Improved Document Preview</Typography>
                    <Button size="small" startIcon={<Icon>print</Icon>} onClick={() => handlePrintDocument(improvedContent)}>
                      Print
                    </Button>
                  </Box>
                  <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                    <iframe
                      srcDoc={improvedContent}
                      title="Improved Document"
                      style={{ width: '100%', height: 300, border: 'none' }}
                    />
                  </Box>
                </Paper>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setIsUploadDialogOpen(false); resetForm(); }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveItem}
            startIcon={<Icon>save</Icon>}
            disabled={!newItemName}
          >
            Save Document
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onClose={() => setIsViewDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon color="primary">description</Icon>
              {selectedItem?.name}
            </Box>
            <Chip label={selectedItem?.status} color={getStatusColor(selectedItem?.status || 'pending')} />
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Grid container spacing={2}>
              {selectedItem.originalFile && (
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" gutterBottom>Original Document</Typography>
                  <Paper variant="outlined" sx={{ p: 1 }}>
                    <img src={selectedItem.originalFile} alt="Original" style={{ width: '100%', borderRadius: 4 }} />
                  </Paper>
                </Grid>
              )}
              <Grid size={{ xs: 12, md: selectedItem.originalFile ? 8 : 12 }}>
                {selectedItem.extractedText && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Extracted Text</Typography>
                    <Paper variant="outlined" sx={{ p: 2, maxHeight: 200, overflow: 'auto', bgcolor: 'grey.50' }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {selectedItem.extractedText}
                      </Typography>
                    </Paper>
                  </Box>
                )}
                {selectedItem.improvedContent && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Improved Document</Typography>
                    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
                      <iframe
                        srcDoc={selectedItem.improvedContent}
                        title="Improved"
                        style={{ width: '100%', height: 400, border: 'none' }}
                      />
                    </Paper>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          {selectedItem?.improvedContent && (
            <Button
              variant="contained"
              startIcon={<Icon>print</Icon>}
              onClick={() => handlePrintDocument(selectedItem.improvedContent!)}
            >
              Print Improved
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
