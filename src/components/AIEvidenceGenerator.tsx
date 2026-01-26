import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CardMedia from '@mui/material/CardMedia';
import { useNABHStore } from '../store/nabhStore';
import { HOSPITAL_INFO, getNABHCoordinator, NABH_ASSESSOR_PROMPT } from '../config/hospitalConfig';
import { getClaudeApiKey } from '../lib/supabase';

// Expandable TextField styles
const expandableTextFieldSx = {
  '& .MuiInputBase-root': {
    resize: 'vertical',
    overflow: 'auto',
    minHeight: '120px',
  },
  '& .MuiInputBase-inputMultiline': {
    resize: 'vertical',
    overflow: 'auto !important',
  },
};

// Hospital configuration interface
interface HospitalConfig {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  qualityCoordinator: string;
  qualityCoordinatorDesignation: string;
  logo: string;
}

const nabhCoordinator = getNABHCoordinator();

const defaultHospitalConfig: HospitalConfig = {
  name: HOSPITAL_INFO.name,
  address: HOSPITAL_INFO.address,
  phone: HOSPITAL_INFO.phone,
  email: HOSPITAL_INFO.email,
  website: HOSPITAL_INFO.website,
  qualityCoordinator: nabhCoordinator.name,
  qualityCoordinatorDesignation: nabhCoordinator.designation,
  logo: HOSPITAL_INFO.logo,
};

const defaultListPrompt = NABH_ASSESSOR_PROMPT;

const getContentPrompt = (config: HospitalConfig) => `You are an expert in NABH (National Accreditation Board for Hospitals and Healthcare Providers) accreditation documentation for ${config.name}.

Generate detailed, ready-to-use evidence content/template for the selected evidence item in ENGLISH ONLY (these are internal documents).

IMPORTANT: Every document MUST include the following professional table-based structure:

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│                        ╔═══════════════════════════╗                           │
│                        ║    [HOSPITAL LOGO]        ║                           │
│                        ║      (Large Size)         ║                           │
│                        ╚═══════════════════════════╝                           │
│                                                                                 │
│                            ${config.name.toUpperCase()}                              │
│                              ${config.address}                                  │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                              [DOCUMENT TITLE]                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│ DOCUMENT CONTROL INFORMATION                                                    │
├──────────────────────┬──────────────────────┬───────────────────────────────────┤
│ Document No:         │ Version:             │ Page: 1 of X                      │
│ [DOC-XXX-001]        │ 1.0                  │                                   │
├──────────────────────┼──────────────────────┼───────────────────────────────────┤
│ Department:          │ Category:            │ NABH Chapter:                     │
│ [Department Name]    │ [Policy/SOP/Record]  │ [Chapter Code]                    │
├──────────────────────┼──────────────────────┼───────────────────────────────────┤
│ Effective Date:      │ Review Date:         │ Supersedes:                       │
│ [DD/MM/YYYY]         │ [DD/MM/YYYY]         │ [Previous Version if any]         │
├──────────────────────┴──────────────────────┴───────────────────────────────────┤
│ DOCUMENT AUTHORIZATION                                                          │
├──────────────────────┬──────────────────────┬───────────────────────────────────┤
│ PREPARED BY          │ REVIEWED BY          │ APPROVED BY                       │
├──────────────────────┼──────────────────────┼───────────────────────────────────┤
│ Name:                │ Name:                │ Name: ${config.qualityCoordinator}        │
│ Designation:         │ Designation:         │ Designation: ${config.qualityCoordinatorDesignation} │
│ Date:                │ Date:                │ Date:                             │
│ Signature:           │ Signature:           │ Signature:                        │
└──────────────────────┴──────────────────────┴───────────────────────────────────┘

[MAIN CONTENT SECTION]

The content should be:
1. Professional and compliant with NABH standards
2. In English only (internal documentation)
3. Ready to be customized with hospital-specific details
4. Well-structured with clear headings and numbered sections

If it's a policy or SOP, include:
1. PURPOSE
2. SCOPE
3. DEFINITIONS
4. RESPONSIBILITIES (in table format)
5. PROCEDURE (numbered steps)
6. DOCUMENTATION REQUIREMENTS
7. REFERENCES
8. REVISION HISTORY

If it's a register or record format, include:
- Clear column headers in table format
- Sample entries
- Instructions for filling

┌─────────────────────────────────────────────────────────────────────────────────┐
│ REVISION HISTORY                                                                │
├──────────┬────────────┬─────────────────────────────────┬───────────────────────┤
│ Version  │ Date       │ Description of Changes          │ Changed By            │
├──────────┼────────────┼─────────────────────────────────┼───────────────────────┤
│ 1.0      │ [Date]     │ Initial Release                 │ [Name]                │
└──────────┴────────────┴─────────────────────────────────┴───────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DOCUMENT FOOTER                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ ${config.name} | ${config.address}                              │
│ Phone: ${config.phone} | Email: ${config.email}                                │
│ Website: ${config.website}                                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│ This is a controlled document. Unauthorized copying or distribution prohibited.│
│                         [HOSPITAL STAMP AREA]                                   │
└─────────────────────────────────────────────────────────────────────────────────┘`;

// Visual evidence types for image generation
const visualEvidenceTypes = [
  { value: 'signage', label: 'Signage / Display Board', icon: 'signpost' },
  { value: 'poster', label: 'Awareness Poster', icon: 'image' },
  { value: 'flyer', label: 'Information Flyer', icon: 'description' },
  { value: 'banner', label: 'Banner / Standee', icon: 'view_day' },
  { value: 'infographic', label: 'Infographic', icon: 'analytics' },
  { value: 'checklist', label: 'Visual Checklist', icon: 'checklist' },
];

interface EvidenceItem {
  id: string;
  text: string;
  selected: boolean;
}

interface GeneratedContent {
  evidenceItem: string;
  content: string;
}

interface GeneratedImage {
  prompt: string;
  imageUrl: string;
  type: string;
}

// Claude API call for text generation
async function callClaudeText(apiKey: string, prompt: string, userMessage: string): Promise<string> {
  // Validate API key
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Claude API key is not configured. Please add VITE_CLAUDE_API_KEY to your .env file and restart the development server.');
  }

  try {
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
            content: `${prompt}\n\n${userMessage}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `API request failed with status ${response.status}`;

      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your VITE_CLAUDE_API_KEY in the .env file.');
      } else if (response.status === 403) {
        throw new Error('API access forbidden. The API key may not have the required permissions or CORS may be blocking the request.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.content?.[0]?.text || '';
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to Claude API. Please check your internet connection.');
    }
    throw err;
  }
}

// Visual placeholder generation (bilingual English/Hindi)
// Returns a styled SVG that can be used as visual evidence
async function generateVisualPlaceholder(
  topic: string,
  type: string,
  hospitalName: string,
  hospitalAddress: string
): Promise<string> {
  // Create an SVG placeholder with bilingual text (English and Hindi)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1565C0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0D47A1;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>

      <!-- Hospital Header -->
      <text x="400" y="60" font-family="Arial, sans-serif" font-size="28" fill="white" text-anchor="middle" font-weight="bold">${hospitalName}</text>
      <text x="400" y="90" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" opacity="0.8">${hospitalAddress}</text>

      <!-- Type Badge -->
      <rect x="300" y="120" width="200" height="40" rx="20" fill="#D32F2F"/>
      <text x="400" y="147" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" font-weight="bold">${type.toUpperCase()}</text>

      <!-- Main Content (English) -->
      <text x="400" y="220" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" font-weight="bold">${topic.substring(0, 40)}${topic.length > 40 ? '...' : ''}</text>

      <!-- Hindi Translation Placeholder -->
      <text x="400" y="280" font-family="Noto Sans Devanagari, Arial, sans-serif" font-size="20" fill="white" text-anchor="middle" opacity="0.9">हिंदी में जानकारी</text>

      <!-- Content Area -->
      <rect x="100" y="320" width="600" height="180" rx="10" fill="white" opacity="0.1"/>
      <text x="400" y="380" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">Content Area / सामग्री क्षेत्र</text>
      <text x="400" y="420" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" opacity="0.8">Customize this template with your content</text>
      <text x="400" y="450" font-family="Noto Sans Devanagari, Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" opacity="0.8">इस टेम्पलेट को अपनी सामग्री के साथ अनुकूलित करें</text>

      <!-- Footer -->
      <text x="400" y="540" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" opacity="0.7">NABH Accredited | NABH मान्यता प्राप्त</text>
      <text x="400" y="570" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle" opacity="0.5">Quality Healthcare for All | सभी के लिए गुणवत्तापूर्ण स्वास्थ्य सेवा</text>
    </svg>
  `;

  // Convert SVG to base64 data URL
  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
}

export default function AIEvidenceGenerator() {
  const { chapters } = useNABHStore();
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedObjective, setSelectedObjective] = useState('');
  const [description, setDescription] = useState('');
  const [listPrompt, setListPrompt] = useState(defaultListPrompt);
  const [hospitalConfig, setHospitalConfig] = useState<HospitalConfig>(() => {
    const saved = localStorage.getItem('hospital_config');
    return saved ? JSON.parse(saved) : defaultHospitalConfig;
  });
  // API key from environment variable
  const apiKey = getClaudeApiKey();
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
  const [generatedContents, setGeneratedContents] = useState<GeneratedContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [error, setError] = useState('');
  const [contentProgress, setContentProgress] = useState({ current: 0, total: 0 });
  const [showHospitalConfig, setShowHospitalConfig] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Visual evidence state
  const [visualType, setVisualType] = useState('signage');
  const [visualTopic, setVisualTopic] = useState('');
  const [visualLanguage, setVisualLanguage] = useState('English');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const selectedChapterData = chapters.find(c => c.id === selectedChapter);
  const objectives = selectedChapterData?.objectives || [];

  const steps = ['Generate Evidence List', 'Select Evidences', 'Generate Evidence Content'];

  const handleChapterChange = (chapterId: string) => {
    setSelectedChapter(chapterId);
    setSelectedObjective('');
    setDescription('');
  };

  const handleObjectiveChange = (objectiveId: string) => {
    setSelectedObjective(objectiveId);
    const objective = objectives.find(o => o.id === objectiveId);
    if (objective) {
      setDescription(objective.description);
    }
  };

  const handleHospitalConfigChange = (field: keyof HospitalConfig, value: string) => {
    const newConfig = { ...hospitalConfig, [field]: value };
    setHospitalConfig(newConfig);
    localStorage.setItem('hospital_config', JSON.stringify(newConfig));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      handleHospitalConfigChange('logo', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const parseEvidenceList = (text: string): EvidenceItem[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const items: EvidenceItem[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.match(/^(\d+[.):]|-|\*|•)/)) {
        items.push({
          id: `evidence-${index}`,
          text: trimmed,
          selected: false,
        });
      }
    });

    return items;
  };

  const handleGenerateList = async () => {
    if (!description.trim()) {
      setError('Please enter the objective element description');
      return;
    }

    setIsLoading(true);
    setError('');
    setEvidenceItems([]);
    setGeneratedContents([]);

    try {
      const generatedText = await callClaudeText(
        apiKey,
        listPrompt,
        `Objective Element Description:\n\n${description}`
      );

      const items = parseEvidenceList(generatedText);
      setEvidenceItems(items);

      if (items.length > 0) {
        setActiveStep(1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating evidence list');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleEvidence = (id: string) => {
    setEvidenceItems(items =>
      items.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleSelectAll = () => {
    const allSelected = evidenceItems.every(item => item.selected);
    setEvidenceItems(items =>
      items.map(item => ({ ...item, selected: !allSelected }))
    );
  };

  const selectedCount = evidenceItems.filter(item => item.selected).length;

  const handleGenerateContent = async () => {
    const selectedItems = evidenceItems.filter(item => item.selected);

    if (selectedItems.length === 0) {
      setError('Please select at least one evidence item');
      return;
    }

    setIsGeneratingContent(true);
    setError('');
    setGeneratedContents([]);
    setContentProgress({ current: 0, total: selectedItems.length });
    setActiveStep(2);

    const contentPrompt = getContentPrompt(hospitalConfig);
    const contents: GeneratedContent[] = [];

    for (let i = 0; i < selectedItems.length; i++) {
      const item = selectedItems[i];
      setContentProgress({ current: i + 1, total: selectedItems.length });

      try {
        const content = await callClaudeText(
          apiKey,
          contentPrompt,
          `Objective Element: ${description}\n\nEvidence Item to Generate:\n${item.text}\n\nGenerate complete, ready-to-use content/template for this evidence in ENGLISH ONLY (internal document) with the hospital header, footer, signature and stamp sections as specified.`
        );

        contents.push({
          evidenceItem: item.text,
          content,
        });

        setGeneratedContents([...contents]);
      } catch (err) {
        contents.push({
          evidenceItem: item.text,
          content: `Error generating content: ${err instanceof Error ? err.message : 'Unknown error'}`,
        });
        setGeneratedContents([...contents]);
      }
    }

    setIsGeneratingContent(false);
  };

  const handleGenerateVisualEvidence = async () => {
    if (!visualTopic.trim()) {
      setError('Please enter the topic for visual evidence');
      return;
    }

    setIsGeneratingImage(true);
    setError('');

    const typeLabel = visualEvidenceTypes.find(t => t.value === visualType)?.label || visualType;

    try {
      // Generate a placeholder visual with bilingual text
      const imageUrl = await generateVisualPlaceholder(
        visualTopic,
        typeLabel,
        hospitalConfig.name,
        hospitalConfig.address
      );

      setGeneratedImages(prev => [
        {
          prompt: visualTopic,
          imageUrl,
          type: typeLabel,
        },
        ...prev,
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate visual. Please try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleCopyAllContents = () => {
    const allContent = generatedContents
      .map(gc => `=== ${gc.evidenceItem} ===\n\n${gc.content}`)
      .join('\n\n---\n\n');
    navigator.clipboard.writeText(allContent);
  };

  const handleReset = () => {
    setActiveStep(0);
    setEvidenceItems([]);
    setGeneratedContents([]);
    setError('');
  };

  const handleBackToSelection = () => {
    setActiveStep(1);
    setGeneratedContents([]);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Icon color="primary" sx={{ fontSize: 32 }}>description</Icon>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" fontWeight={600}>
              Evidence Document Creator
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create professional NABH evidence documents for {hospitalConfig.name}
            </Typography>
          </Box>
          <Chip
            icon={<Icon>verified</Icon>}
            label="NABH Compliant"
            color="success"
            variant="outlined"
          />
          {apiKey ? (
            <Chip
              icon={<Icon>check_circle</Icon>}
              label="API Ready"
              color="primary"
              variant="outlined"
              size="small"
            />
          ) : (
            <Chip
              icon={<Icon>warning</Icon>}
              label="API Key Missing"
              color="error"
              variant="outlined"
              size="small"
            />
          )}
          <Button
            variant="outlined"
            startIcon={<Icon>settings</Icon>}
            onClick={() => setShowHospitalConfig(!showHospitalConfig)}
          >
            Hospital Settings
          </Button>
        </Box>

        {/* API Key Warning */}
        {!apiKey && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Claude API Key not configured.</strong> Add <code>VITE_CLAUDE_API_KEY</code> to your <code>.env</code> file and restart the development server.
            </Typography>
          </Alert>
        )}

        {/* Tabs for Document vs Visual Evidence */}
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<Icon>description</Icon>}
            iconPosition="start"
            label="Document Evidence"
          />
          <Tab
            icon={<Icon>image</Icon>}
            iconPosition="start"
            label="Visual Evidence (Signage, Posters, Flyers)"
          />
        </Tabs>

        {/* Hospital Configuration */}
        {showHospitalConfig && (
          <Card variant="outlined" sx={{ mb: 3, bgcolor: 'primary.50' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Icon color="primary">business</Icon>
                <Typography variant="subtitle1" fontWeight={600}>
                  Hospital Branding Configuration
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Hospital Name"
                    value={hospitalConfig.name}
                    onChange={(e) => handleHospitalConfigChange('name', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Quality Coordinator Name"
                    value={hospitalConfig.qualityCoordinator}
                    onChange={(e) => handleHospitalConfigChange('qualityCoordinator', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Quality Coordinator Designation"
                    value={hospitalConfig.qualityCoordinatorDesignation}
                    onChange={(e) => handleHospitalConfigChange('qualityCoordinatorDesignation', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Phone"
                    value={hospitalConfig.phone}
                    onChange={(e) => handleHospitalConfigChange('phone', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Hospital Address"
                    value={hospitalConfig.address}
                    onChange={(e) => handleHospitalConfigChange('address', e.target.value)}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Email"
                    value={hospitalConfig.email}
                    onChange={(e) => handleHospitalConfigChange('email', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Website"
                    value={hospitalConfig.website}
                    onChange={(e) => handleHospitalConfigChange('website', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Icon>upload</Icon>}
                      onClick={() => logoInputRef.current?.click()}
                    >
                      Upload Hospital Logo
                    </Button>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      style={{ display: 'none' }}
                    />
                    {hospitalConfig.logo && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <img
                          src={hospitalConfig.logo}
                          alt="Hospital Logo"
                          style={{ height: 40, objectFit: 'contain' }}
                        />
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleHospitalConfigChange('logo', '')}
                        >
                          <Icon fontSize="small">delete</Icon>
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Tab 0: Document Evidence */}
        {activeTab === 0 && (
          <>
            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Divider sx={{ mb: 3 }} />

            {/* Step 1: Generate Evidence List */}
            {activeStep === 0 && (
              <>
                {/* Objective Selection */}
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Icon color="primary">list_alt</Icon>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Select Objective Element (Optional)
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Chapter</InputLabel>
                        <Select
                          value={selectedChapter}
                          label="Chapter"
                          onChange={(e) => handleChapterChange(e.target.value)}
                        >
                          <MenuItem value="">Select Chapter</MenuItem>
                          {chapters.map((chapter) => (
                            <MenuItem key={chapter.id} value={chapter.id}>
                              {chapter.code} - {chapter.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size="small" sx={{ minWidth: 300, flexGrow: 1 }}>
                        <InputLabel>Objective Element</InputLabel>
                        <Select
                          value={selectedObjective}
                          label="Objective Element"
                          onChange={(e) => handleObjectiveChange(e.target.value)}
                          disabled={!selectedChapter}
                        >
                          <MenuItem value="">Select Objective</MenuItem>
                          {objectives.map((obj) => (
                            <MenuItem key={obj.id} value={obj.id}>
                              {obj.code} - {obj.title}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </CardContent>
                </Card>

                {/* Description Input */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Icon color="primary">description</Icon>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Objective Element Description
                    </Typography>
                    {selectedObjective && (
                      <Chip label="Auto-filled" size="small" color="success" variant="outlined" />
                    )}
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter or paste the NABH objective element description here..."
                    sx={expandableTextFieldSx}
                  />
                </Box>

                {/* List Prompt Input */}
                <Accordion sx={{ mb: 3 }}>
                  <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon color="secondary">psychology</Icon>
                      <Typography variant="subtitle1" fontWeight={600}>
                        AI Prompt (Advanced)
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      fullWidth
                      multiline
                      minRows={4}
                      value={listPrompt}
                      onChange={(e) => setListPrompt(e.target.value)}
                      sx={expandableTextFieldSx}
                    />
                    <Button
                      size="small"
                      startIcon={<Icon>refresh</Icon>}
                      onClick={() => setListPrompt(defaultListPrompt)}
                      sx={{ mt: 1 }}
                    >
                      Reset to Default
                    </Button>
                  </AccordionDetails>
                </Accordion>

                {/* Generate Button */}
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Icon>list_alt</Icon>}
                    onClick={handleGenerateList}
                    disabled={isLoading || !description.trim()}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    {isLoading ? 'Creating Evidence List...' : 'Step 1: Create Evidence List'}
                  </Button>
                </Box>
              </>
            )}

            {/* Step 2: Select Evidences */}
            {activeStep === 1 && (
              <>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Icon color="primary">checklist</Icon>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Select Evidences to Generate Content For
                        </Typography>
                        <Chip
                          label={`${selectedCount} of ${evidenceItems.length} selected`}
                          size="small"
                          color={selectedCount > 0 ? 'primary' : 'default'}
                        />
                      </Box>
                      <Button
                        size="small"
                        startIcon={<Icon>select_all</Icon>}
                        onClick={handleSelectAll}
                      >
                        {evidenceItems.every(item => item.selected) ? 'Deselect All' : 'Select All'}
                      </Button>
                    </Box>

                    <Paper variant="outlined" sx={{ p: 2, maxHeight: 400, overflow: 'auto', bgcolor: 'grey.50' }}>
                      <FormGroup>
                        {evidenceItems.map((item) => (
                          <FormControlLabel
                            key={item.id}
                            control={
                              <Checkbox
                                checked={item.selected}
                                onChange={() => handleToggleEvidence(item.id)}
                                color="primary"
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
                              bgcolor: item.selected ? 'primary.50' : 'transparent',
                              '&:hover': { bgcolor: item.selected ? 'primary.100' : 'grey.100' },
                            }}
                          />
                        ))}
                      </FormGroup>
                    </Paper>
                  </CardContent>
                </Card>

                {/* Branding Preview */}
                <Card variant="outlined" sx={{ mb: 3, bgcolor: 'success.50' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Icon color="success">verified</Icon>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Document Branding Preview
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Each generated document will include:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      <Chip icon={<Icon>image</Icon>} label={`${hospitalConfig.name} Logo`} size="small" />
                      <Chip icon={<Icon>location_on</Icon>} label="Hospital Address in Footer" size="small" />
                      <Chip icon={<Icon>draw</Icon>} label={`Digital Signature: ${hospitalConfig.qualityCoordinator}`} size="small" />
                      <Chip icon={<Icon>verified</Icon>} label="Hospital Attestation Stamp" size="small" />
                    </Box>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Icon>arrow_back</Icon>}
                    onClick={handleReset}
                  >
                    Back to Start
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Icon>auto_awesome</Icon>}
                    onClick={handleGenerateContent}
                    disabled={selectedCount === 0}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Step 2: Generate Branded Documents ({selectedCount})
                  </Button>
                </Box>
              </>
            )}

            {/* Step 3: Generated Content */}
            {activeStep === 2 && (
              <>
                {isGeneratingContent && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress size={48} sx={{ mb: 2 }} />
                    <Typography variant="h6">
                      Creating Documents...
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {contentProgress.current} of {contentProgress.total} completed
                    </Typography>
                  </Box>
                )}

                {generatedContents.length > 0 && (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" fontWeight={600}>
                        <Icon sx={{ verticalAlign: 'middle', mr: 1 }}>description</Icon>
                        Evidence Documents ({generatedContents.length})
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<Icon>content_copy</Icon>}
                          onClick={handleCopyAllContents}
                        >
                          Copy All
                        </Button>
                      </Box>
                    </Box>

                    <Alert severity="success" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        All documents created with {hospitalConfig.name} branding. Review and customize as needed.
                      </Typography>
                    </Alert>

                    {generatedContents.map((gc, index) => (
                      <Accordion key={index} defaultExpanded={index === 0} sx={{ mb: 2 }}>
                        <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', pr: 2 }}>
                            <Chip label={index + 1} size="small" color="primary" />
                            <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                              {gc.evidenceItem.substring(0, 100)}...
                            </Typography>
                            <Tooltip title="Copy">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyContent(gc.content);
                                }}
                              >
                                <Icon fontSize="small">content_copy</Icon>
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ mb: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1, textAlign: 'center' }}>
                            {hospitalConfig.logo ? (
                              <img
                                src={hospitalConfig.logo}
                                alt="Hospital Logo"
                                style={{ height: 60, objectFit: 'contain', marginBottom: 8 }}
                              />
                            ) : (
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                                <Icon color="primary">local_hospital</Icon>
                                <Typography variant="body2" color="text.secondary">[Hospital Logo]</Typography>
                              </Box>
                            )}
                            <Typography variant="h6" fontWeight={600}>{hospitalConfig.name}</Typography>
                          </Box>
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 2,
                              bgcolor: 'grey.50',
                              maxHeight: 500,
                              overflow: 'auto',
                              whiteSpace: 'pre-wrap',
                              fontFamily: 'monospace',
                              fontSize: '0.875rem',
                              lineHeight: 1.6,
                            }}
                          >
                            {gc.content}
                          </Paper>
                          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              {hospitalConfig.address}
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                              <Chip
                                size="small"
                                icon={<Icon fontSize="small">draw</Icon>}
                                label={`Signed: ${hospitalConfig.qualityCoordinator}`}
                                variant="outlined"
                              />
                              <Chip
                                size="small"
                                icon={<Icon fontSize="small">verified</Icon>}
                                label="Official Hospital Stamp"
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    ))}

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                      <Button
                        variant="outlined"
                        startIcon={<Icon>arrow_back</Icon>}
                        onClick={handleBackToSelection}
                      >
                        Back to Selection
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Icon>refresh</Icon>}
                        onClick={handleReset}
                      >
                        Start Over
                      </Button>
                    </Box>
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* Tab 1: Visual Evidence */}
        {activeTab === 1 && (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Create professional signages, posters, flyers, and other visual evidences for {hospitalConfig.name}.
              </Typography>
            </Alert>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      <Icon sx={{ verticalAlign: 'middle', mr: 1 }}>add_photo_alternate</Icon>
                      Generate Visual Evidence
                    </Typography>

                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                      <InputLabel>Visual Type</InputLabel>
                      <Select
                        value={visualType}
                        label="Visual Type"
                        onChange={(e) => setVisualType(e.target.value)}
                      >
                        {visualEvidenceTypes.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Icon fontSize="small">{type.icon}</Icon>
                              {type.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      size="small"
                      label="Topic / Content"
                      value={visualTopic}
                      onChange={(e) => setVisualTopic(e.target.value)}
                      placeholder="e.g., Hand Hygiene Steps, Fire Safety Instructions, Patient Rights..."
                      multiline
                      rows={3}
                      sx={{ mb: 2 }}
                    />

                    <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={visualLanguage}
                        label="Language"
                        onChange={(e) => setVisualLanguage(e.target.value)}
                      >
                        <MenuItem value="English">English</MenuItem>
                        <MenuItem value="Hindi">Hindi</MenuItem>
                        <MenuItem value="Marathi">Marathi</MenuItem>
                        <MenuItem value="English and Hindi">English and Hindi (Bilingual)</MenuItem>
                      </Select>
                    </FormControl>

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={isGeneratingImage ? <CircularProgress size={20} color="inherit" /> : <Icon>auto_awesome</Icon>}
                      onClick={handleGenerateVisualEvidence}
                      disabled={isGeneratingImage || !visualTopic.trim()}
                    >
                      {isGeneratingImage ? 'Generating Image...' : 'Generate Visual Evidence'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Templates */}
                <Card variant="outlined" sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Quick Templates
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {[
                        'Hand Hygiene - 5 Moments',
                        'Fire Safety Instructions',
                        'Patient Rights',
                        'Biomedical Waste Segregation',
                        'Code Blue Protocol',
                        'Visitor Guidelines',
                        'No Smoking Zone',
                        'Emergency Exit',
                        'Infection Control',
                        'Fall Prevention',
                      ].map((template) => (
                        <Chip
                          key={template}
                          label={template}
                          size="small"
                          onClick={() => setVisualTopic(template)}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined" sx={{ height: '100%', minHeight: 400 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      <Icon sx={{ verticalAlign: 'middle', mr: 1 }}>collections</Icon>
                      Generated Images ({generatedImages.length})
                    </Typography>

                    {generatedImages.length === 0 ? (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: 300,
                          bgcolor: 'grey.50',
                          borderRadius: 2,
                        }}
                      >
                        <Icon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }}>image</Icon>
                        <Typography color="text.secondary">
                          Generated images will appear here
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
                        {generatedImages.map((img, index) => (
                          <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                            <CardMedia
                              component="img"
                              image={img.imageUrl}
                              alt={img.prompt}
                              sx={{ maxHeight: 300, objectFit: 'contain', bgcolor: 'grey.100' }}
                            />
                            <CardContent sx={{ py: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                  <Chip label={img.type} size="small" color="primary" sx={{ mr: 1 }} />
                                  <Typography variant="caption" color="text.secondary">
                                    {img.prompt}
                                  </Typography>
                                </Box>
                                <Tooltip title="Download">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDownloadImage(img.imageUrl, `${img.type}-${img.prompt.substring(0, 20)}`)}
                                  >
                                    <Icon fontSize="small">download</Icon>
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mt: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
      </Paper>

      {/* Instructions Card */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          <Icon sx={{ verticalAlign: 'middle', mr: 1 }}>help_outline</Icon>
          How to Use
        </Typography>
        <Box component="ol" sx={{ pl: 2, '& li': { mb: 1 } }}>
          <li>Click "Hospital Settings" to configure branding (name, logo, address, quality coordinator)</li>
          <li><strong>Document Evidence:</strong> Create SOPs, policies, registers with hospital branding</li>
          <li><strong>Visual Evidence:</strong> Create signages, posters, flyers for display</li>
          <li>Review and customize the generated content before printing or filing</li>
        </Box>
        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="body2">
            All documents are professionally formatted with {hospitalConfig.name} branding and NABH compliance standards.
          </Typography>
        </Alert>
      </Paper>
    </Box>
  );
}
