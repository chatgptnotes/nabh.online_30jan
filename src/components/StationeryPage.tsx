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
import { getGeminiApiKey } from '../lib/supabase';

interface StationeryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  originalFile?: string;
  originalFileType?: string;
  improvedContent?: string;
  suggestions: string[];
  status: 'pending' | 'improved' | 'approved';
  createdAt: string;
  updatedAt: string;
}

const STATIONERY_CATEGORIES = [
  { id: 'forms', label: 'Patient Forms', icon: 'assignment' },
  { id: 'registers', label: 'Registers', icon: 'menu_book' },
  { id: 'letterheads', label: 'Letterheads', icon: 'mail' },
  { id: 'certificates', label: 'Certificates', icon: 'workspace_premium' },
  { id: 'consent', label: 'Consent Forms', icon: 'fact_check' },
  { id: 'reports', label: 'Report Templates', icon: 'summarize' },
  { id: 'labels', label: 'Labels & Tags', icon: 'label' },
  { id: 'other', label: 'Other Documents', icon: 'description' },
];

export default function StationeryPage() {
  const [stationeryItems, setStationeryItems] = useState<StationeryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StationeryItem | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('forms');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string>('');
  const [userSuggestion, setUserSuggestion] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
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
    localStorage.setItem('nabh_stationery_items', JSON.stringify(stationeryItems));
  }, [stationeryItems]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Extract text using Gemini Vision
      await extractTextFromImage(file);
    } else {
      setUploadedFilePreview('');
      setExtractedText('PDF or document file - text extraction will be attempted');
    }
  };

  const extractTextFromImage = async (file: File) => {
    const geminiApiKey = getGeminiApiKey();
    if (!geminiApiKey) {
      setSnackbar({ open: true, message: 'Please configure Gemini API key in settings', severity: 'error' });
      return;
    }

    setIsExtracting(true);
    try {
      const base64 = await fileToBase64(file);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: 'Extract all text content from this hospital stationery/document image. Identify: 1) Document type, 2) All text fields and their labels, 3) Any formatting issues, 4) Suggestions for improvement. Format the output clearly.' },
                { inline_data: { mime_type: file.type, data: base64.split(',')[1] } }
              ]
            }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
          }),
        }
      );

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Could not extract text';
      setExtractedText(text);
    } catch (error) {
      console.error('Error extracting text:', error);
      setSnackbar({ open: true, message: 'Failed to extract text from image', severity: 'error' });
    } finally {
      setIsExtracting(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleAddStationery = () => {
    if (!newItemName.trim()) {
      setSnackbar({ open: true, message: 'Please enter a name for the stationery item', severity: 'error' });
      return;
    }

    const newItem: StationeryItem = {
      id: `stationery_${Date.now()}`,
      name: newItemName,
      category: newItemCategory,
      description: newItemDescription,
      originalFile: uploadedFilePreview,
      originalFileType: uploadedFile?.type,
      suggestions: userSuggestion ? [userSuggestion] : [],
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setStationeryItems([...stationeryItems, newItem]);
    setIsUploadDialogOpen(false);
    resetForm();
    setSnackbar({ open: true, message: 'Stationery item added successfully', severity: 'success' });
  };

  const resetForm = () => {
    setNewItemName('');
    setNewItemCategory('forms');
    setNewItemDescription('');
    setUploadedFile(null);
    setUploadedFilePreview('');
    setUserSuggestion('');
    setExtractedText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImproveStationery = async (item: StationeryItem) => {
    const geminiApiKey = getGeminiApiKey();
    if (!geminiApiKey) {
      setSnackbar({ open: true, message: 'Please configure Gemini API key in settings', severity: 'error' });
      return;
    }

    setIsImproving(true);
    setSelectedItem(item);

    try {
      const prompt = `You are a hospital quality documentation expert. Create an improved version of this hospital stationery/document.

Document Name: ${item.name}
Category: ${item.category}
Description: ${item.description}
${item.suggestions.length > 0 ? `User Suggestions: ${item.suggestions.join(', ')}` : ''}

Requirements:
1. Create a professional, NABH-compliant document template
2. Use proper hospital branding (Hope Hospital)
3. Include all necessary fields and sections
4. Ensure proper formatting and layout
5. Add any missing required fields for NABH compliance
6. Make it print-ready with proper margins

Generate complete HTML with embedded CSS for the improved document. Include:
- Hospital header with logo placeholder
- Professional typography
- Clear field labels and input areas
- Footer with document control information
- Print-friendly styling`;

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

      const data = await response.json();
      let content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Extract HTML from response
      const htmlMatch = content.match(/```html\n?([\s\S]*?)\n?```/);
      if (htmlMatch) {
        content = htmlMatch[1];
      }

      // Update item with improved content
      setStationeryItems(prev => prev.map(i =>
        i.id === item.id
          ? { ...i, improvedContent: content, status: 'improved' as const, updatedAt: new Date().toISOString() }
          : i
      ));

      setSnackbar({ open: true, message: 'Document improved successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error improving document:', error);
      setSnackbar({ open: true, message: 'Failed to improve document', severity: 'error' });
    } finally {
      setIsImproving(false);
    }
  };

  const handleAddSuggestion = (itemId: string, suggestion: string) => {
    if (!suggestion.trim()) return;

    setStationeryItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, suggestions: [...item.suggestions, suggestion], updatedAt: new Date().toISOString() }
        : item
    ));
  };

  const handleDeleteItem = (itemId: string) => {
    setStationeryItems(prev => prev.filter(item => item.id !== itemId));
    setSnackbar({ open: true, message: 'Item deleted', severity: 'success' });
  };

  const filteredItems = selectedCategory === 'all'
    ? stationeryItems
    : stationeryItems.filter(item => item.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'improved': return 'success';
      case 'approved': return 'primary';
      default: return 'warning';
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
            Manage and improve hospital stationery, forms, and documents
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Icon>add</Icon>}
          onClick={() => setIsUploadDialogOpen(true)}
        >
          Add Stationery
        </Button>
      </Box>

      {/* Category Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedCategory}
          onChange={(_, value) => setSelectedCategory(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab value="all" label="All Items" icon={<Icon>folder</Icon>} iconPosition="start" />
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
            <Typography variant="body2" color="text.secondary">Total Items</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.50' }}>
            <Typography variant="h4" color="warning.main" fontWeight={700}>
              {stationeryItems.filter(i => i.status === 'pending').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">Pending</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.50' }}>
            <Typography variant="h4" color="success.main" fontWeight={700}>
              {stationeryItems.filter(i => i.status === 'improved').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">Improved</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.50' }}>
            <Typography variant="h4" color="info.main" fontWeight={700}>
              {stationeryItems.filter(i => i.status === 'approved').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">Approved</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Stationery Items Grid */}
      {filteredItems.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Icon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}>inventory_2</Icon>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No stationery items yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Start by uploading your hospital's existing stationery to improve them
          </Typography>
          <Button variant="contained" startIcon={<Icon>add</Icon>} onClick={() => setIsUploadDialogOpen(true)}>
            Add First Item
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
                      icon={<Icon sx={{ fontSize: 16 }}>{STATIONERY_CATEGORIES.find(c => c.id === item.category)?.icon || 'description'}</Icon>}
                    />
                    <Chip label={item.status} size="small" color={getStatusColor(item.status)} />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {item.description || 'No description'}
                  </Typography>
                  {item.suggestions.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">Suggestions:</Typography>
                      {item.suggestions.map((s, i) => (
                        <Chip key={i} label={s} size="small" variant="outlined" sx={{ m: 0.5 }} />
                      ))}
                    </Box>
                  )}
                  {item.originalFile && (
                    <Box sx={{ mt: 1 }}>
                      <img src={item.originalFile} alt={item.name} style={{ width: '100%', maxHeight: 100, objectFit: 'contain', borderRadius: 8 }} />
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <Tooltip title="View/Edit">
                      <IconButton size="small" onClick={() => { setSelectedItem(item); setIsViewDialogOpen(true); }}>
                        <Icon>visibility</Icon>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => handleDeleteItem(item.id)}>
                        <Icon>delete</Icon>
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={isImproving && selectedItem?.id === item.id ? <CircularProgress size={16} color="inherit" /> : <Icon>auto_fix_high</Icon>}
                    onClick={() => handleImproveStationery(item)}
                    disabled={isImproving}
                  >
                    {item.status === 'improved' ? 'Re-improve' : 'Improve'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onClose={() => setIsUploadDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon color="primary">upload_file</Icon>
            Add New Stationery Item
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Item Name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="e.g., Patient Registration Form"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                select
                label="Category"
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
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
                label="Description"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder="Brief description of the document"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Improvement Suggestions"
                value={userSuggestion}
                onChange={(e) => setUserSuggestion(e.target.value)}
                placeholder="What improvements would you like? (optional)"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,.pdf"
                style={{ display: 'none' }}
              />
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                  minHeight: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadedFilePreview ? (
                  <Box>
                    <img src={uploadedFilePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 150, borderRadius: 8 }} />
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>{uploadedFile?.name}</Typography>
                  </Box>
                ) : (
                  <>
                    <Icon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}>cloud_upload</Icon>
                    <Typography variant="body2" color="text.secondary">
                      Click to upload existing document
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Supports images and PDF files
                    </Typography>
                  </>
                )}
              </Paper>
              {isExtracting && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="caption">Extracting text...</Typography>
                </Box>
              )}
              {extractedText && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  <Typography variant="caption">{extractedText.substring(0, 200)}...</Typography>
                </Alert>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setIsUploadDialogOpen(false); resetForm(); }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddStationery} startIcon={<Icon>add</Icon>}>
            Add Item
          </Button>
        </DialogActions>
      </Dialog>

      {/* View/Edit Dialog */}
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
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" gutterBottom>Original Document</Typography>
                  <Paper variant="outlined" sx={{ p: 1 }}>
                    <img src={selectedItem.originalFile} alt="Original" style={{ width: '100%', borderRadius: 4 }} />
                  </Paper>
                </Grid>
              )}
              <Grid size={{ xs: 12, md: selectedItem.originalFile ? 6 : 12 }}>
                <Typography variant="subtitle2" gutterBottom>Improved Document</Typography>
                {selectedItem.improvedContent ? (
                  <Paper variant="outlined" sx={{ p: 1, maxHeight: 400, overflow: 'auto' }}>
                    <iframe
                      srcDoc={selectedItem.improvedContent}
                      title="Improved"
                      style={{ width: '100%', minHeight: 350, border: 'none' }}
                    />
                  </Paper>
                ) : (
                  <Alert severity="info">
                    Click "Improve" to generate an improved version of this document
                  </Alert>
                )}
              </Grid>
              <Grid size={12}>
                <Typography variant="subtitle2" gutterBottom>Add Suggestion</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter your suggestion for improvement..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddSuggestion(selectedItem.id, (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <Button variant="outlined" startIcon={<Icon>send</Icon>}>Add</Button>
                </Box>
                {selectedItem.suggestions.length > 0 && (
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selectedItem.suggestions.map((s, i) => (
                      <Chip key={i} label={s} size="small" variant="outlined" />
                    ))}
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
              onClick={() => {
                const printWindow = window.open('', '_blank');
                if (printWindow && selectedItem.improvedContent) {
                  printWindow.document.write(selectedItem.improvedContent);
                  printWindow.document.close();
                  printWindow.print();
                }
              }}
            >
              Print
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
