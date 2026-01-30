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
import { getClaudeApiKey, getGeminiApiKey } from '../lib/supabase';
import {
  generateInfographic,
  svgToDataUrl,
  availableColorSchemes,
  type InfographicTemplate,
  type ColorScheme,
} from '../services/infographicGenerator';

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

Generate a complete HTML document for the selected evidence item in ENGLISH ONLY (internal document).

IMPORTANT: Generate the output as a complete, valid HTML document with embedded CSS styling. The document must be modern, professional, and print-ready.

Use this HTML template structure:

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>[Document Title] - ${config.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; line-height: 1.6; color: #333; padding: 20px; max-width: 800px; margin: 0 auto; }
    .header { text-align: center; border-bottom: 3px solid #1565C0; padding-bottom: 15px; margin-bottom: 20px; }
    .logo-area { width: 120px; height: 120px; margin: 0 auto 10px; border: 2px solid #1565C0; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1565C0, #0D47A1); color: white; font-size: 14px; font-weight: bold; }
    .hospital-name { font-size: 24px; font-weight: bold; color: #1565C0; margin: 10px 0 5px; }
    .hospital-address { font-size: 11px; color: #666; }
    .doc-title { background: #1565C0; color: white; padding: 12px; font-size: 16px; font-weight: bold; text-align: center; margin: 20px 0; border-radius: 5px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .info-table th, .info-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    .info-table th { background: #f5f5f5; font-weight: 600; width: 25%; }
    .auth-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .auth-table th { background: #1565C0; color: white; padding: 10px; text-align: center; }
    .auth-table td { border: 1px solid #ddd; padding: 10px; text-align: center; vertical-align: top; min-height: 80px; }
    .section { margin: 20px 0; }
    .section-title { background: #e3f2fd; padding: 8px 12px; font-weight: bold; color: #1565C0; border-left: 4px solid #1565C0; margin-bottom: 10px; }
    .section-content { padding: 10px 15px; }
    .procedure-step { margin: 10px 0; padding: 10px; background: #fafafa; border-radius: 5px; }
    .step-number { display: inline-block; width: 25px; height: 25px; background: #1565C0; color: white; border-radius: 50%; text-align: center; line-height: 25px; margin-right: 10px; font-weight: bold; }
    .data-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    .data-table th { background: #1565C0; color: white; padding: 10px; text-align: left; }
    .data-table td { border: 1px solid #ddd; padding: 8px; }
    .data-table tr:nth-child(even) { background: #f9f9f9; }
    .footer { margin-top: 30px; padding-top: 15px; border-top: 2px solid #1565C0; text-align: center; font-size: 10px; color: #666; }
    .revision-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 11px; }
    .revision-table th { background: #455a64; color: white; padding: 8px; }
    .revision-table td { border: 1px solid #ddd; padding: 8px; }
    .stamp-area { border: 2px dashed #ccc; padding: 20px; text-align: center; margin: 20px 0; color: #999; }
    @media print { body { padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-area">HOSPITAL<br>LOGO</div>
    <div class="hospital-name">${config.name}</div>
    <div class="hospital-address">${config.address}</div>
  </div>

  <div class="doc-title">[DOCUMENT TITLE]</div>

  <table class="info-table">
    <tr><th>Document No</th><td>[DOC-XXX-001]</td><th>Version</th><td>1.0</td></tr>
    <tr><th>Department</th><td>[Department]</td><th>Category</th><td>[Policy/SOP/Record]</td></tr>
    <tr><th>Effective Date</th><td>[DD/MM/YYYY]</td><th>Review Date</th><td>[DD/MM/YYYY]</td></tr>
  </table>

  <table class="auth-table">
    <tr><th>PREPARED BY</th><th>REVIEWED BY</th><th>APPROVED BY</th></tr>
    <tr>
      <td>Name:<br>Designation:<br>Date:<br><br>Signature:</td>
      <td>Name:<br>Designation:<br>Date:<br><br>Signature:</td>
      <td>Name: ${config.qualityCoordinator}<br>Designation: ${config.qualityCoordinatorDesignation}<br>Date:<br><br>Signature:</td>
    </tr>
  </table>

  [MAIN CONTENT - Use sections with .section, .section-title, .section-content classes]
  [Use .data-table for any tables]
  [Use .procedure-step and .step-number for procedures]

  <table class="revision-table">
    <tr><th>Version</th><th>Date</th><th>Description</th><th>Changed By</th></tr>
    <tr><td>1.0</td><td>[Date]</td><td>Initial Release</td><td>[Name]</td></tr>
  </table>

  <div class="stamp-area">[HOSPITAL STAMP AREA]</div>

  <div class="footer">
    <strong>${config.name}</strong> | ${config.address}<br>
    Phone: ${config.phone} | Email: ${config.email} | Website: ${config.website}<br>
    This is a controlled document. Unauthorized copying or distribution is prohibited.
  </div>
</body>
</html>

Generate the complete HTML with all sections filled in based on the evidence item provided.`;

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
  editableText: string;
}

interface GeneratedImage {
  prompt: string;
  imageUrl: string;
  type: string;
}

// Helper function to extract editable text from HTML content
function extractTextFromHTML(html: string): string {
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Remove script and style elements
  const scripts = tempDiv.querySelectorAll('script, style');
  scripts.forEach(el => el.remove());

  // Get text content with structure preserved
  const sections: string[] = [];

  // Extract title
  const title = tempDiv.querySelector('.doc-title, h1, title');
  if (title) {
    sections.push(`TITLE: ${title.textContent?.trim() || ''}`);
    sections.push('');
  }

  // Extract document info table
  const infoTable = tempDiv.querySelector('.info-table');
  if (infoTable) {
    sections.push('DOCUMENT INFORMATION:');
    const rows = infoTable.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('th, td');
      const rowText: string[] = [];
      cells.forEach((cell, i) => {
        if (i % 2 === 0) {
          rowText.push(`${cell.textContent?.trim()}: `);
        } else {
          rowText[rowText.length - 1] += cell.textContent?.trim();
        }
      });
      sections.push(rowText.join(' | '));
    });
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

  // Extract tables
  const tables = tempDiv.querySelectorAll('.data-table');
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    const headerRow = Array.from(headers).map(h => h.textContent?.trim()).join(' | ');
    if (headerRow) {
      sections.push(headerRow);
      sections.push('-'.repeat(headerRow.length));
    }

    const rows = table.querySelectorAll('tbody tr, tr:not(:first-child)');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length > 0) {
        sections.push(Array.from(cells).map(c => c.textContent?.trim()).join(' | '));
      }
    });
    sections.push('');
  });

  // If no structured content found, get all text
  if (sections.length < 3) {
    return tempDiv.textContent?.trim() || html;
  }

  return sections.join('\n');
}

// Helper function to update HTML content with edited text
function updateHTMLWithText(_originalHTML: string, editedText: string, hospitalConfig: { name: string; address: string; qualityCoordinator: string; qualityCoordinatorDesignation: string; phone: string; email: string; website: string }): string {
  // Parse the edited text to extract sections
  const lines = editedText.split('\n');

  let title = '';
  const sections: { title: string; content: string }[] = [];
  let currentSection = { title: '', content: '' };
  let inSection = false;

  lines.forEach(line => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('TITLE:')) {
      title = trimmedLine.replace('TITLE:', '').trim();
    } else if (trimmedLine.startsWith('## ')) {
      if (inSection && currentSection.title) {
        sections.push({ ...currentSection });
      }
      currentSection = { title: trimmedLine.replace('## ', ''), content: '' };
      inSection = true;
    } else if (inSection && trimmedLine) {
      currentSection.content += (currentSection.content ? '\n' : '') + trimmedLine;
    }
  });

  if (inSection && currentSection.title) {
    sections.push(currentSection);
  }

  // Generate updated HTML
  const sectionHTML = sections.map(s => `
    <div class="section">
      <div class="section-title">${s.title}</div>
      <div class="section-content">${s.content.split('\n').map(p => `<p>${p}</p>`).join('')}</div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title || 'Evidence Document'} - ${hospitalConfig.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; line-height: 1.6; color: #333; padding: 20px; max-width: 800px; margin: 0 auto; }
    .header { text-align: center; border-bottom: 3px solid #1565C0; padding-bottom: 15px; margin-bottom: 20px; }
    .logo-area { width: 120px; height: 120px; margin: 0 auto 10px; border: 2px solid #1565C0; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1565C0, #0D47A1); color: white; font-size: 14px; font-weight: bold; }
    .hospital-name { font-size: 24px; font-weight: bold; color: #1565C0; margin: 10px 0 5px; }
    .hospital-address { font-size: 11px; color: #666; }
    .doc-title { background: #1565C0; color: white; padding: 12px; font-size: 16px; font-weight: bold; text-align: center; margin: 20px 0; border-radius: 5px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .info-table th, .info-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    .info-table th { background: #f5f5f5; font-weight: 600; width: 25%; }
    .section { margin: 20px 0; }
    .section-title { background: #e3f2fd; padding: 8px 12px; font-weight: bold; color: #1565C0; border-left: 4px solid #1565C0; margin-bottom: 10px; }
    .section-content { padding: 10px 15px; }
    .section-content p { margin-bottom: 8px; }
    .footer { margin-top: 30px; padding-top: 15px; border-top: 2px solid #1565C0; text-align: center; font-size: 10px; color: #666; }
    .auth-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .auth-table th { background: #1565C0; color: white; padding: 10px; text-align: center; }
    .auth-table td { border: 1px solid #ddd; padding: 10px; text-align: center; vertical-align: top; min-height: 80px; }
    @media print { body { padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-area">HOSPITAL<br>LOGO</div>
    <div class="hospital-name">${hospitalConfig.name}</div>
    <div class="hospital-address">${hospitalConfig.address}</div>
  </div>

  <div class="doc-title">${title || 'Evidence Document'}</div>

  <table class="info-table">
    <tr><th>Document No</th><td>DOC-001</td><th>Version</th><td>1.0</td></tr>
    <tr><th>Effective Date</th><td>${new Date().toLocaleDateString()}</td><th>Review Date</th><td>${new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString()}</td></tr>
  </table>

  ${sectionHTML}

  <table class="auth-table">
    <tr><th>PREPARED BY</th><th>REVIEWED BY</th><th>APPROVED BY</th></tr>
    <tr>
      <td>Name:<br>Designation:<br>Date:<br><br>Signature:</td>
      <td>Name:<br>Designation:<br>Date:<br><br>Signature:</td>
      <td>Name: ${hospitalConfig.qualityCoordinator}<br>Designation: ${hospitalConfig.qualityCoordinatorDesignation}<br>Date:<br><br>Signature:</td>
    </tr>
  </table>

  <div class="footer">
    <strong>${hospitalConfig.name}</strong> | ${hospitalConfig.address}<br>
    Phone: ${hospitalConfig.phone} | Email: ${hospitalConfig.email} | Website: ${hospitalConfig.website}<br>
    This is a controlled document. Unauthorized copying or distribution is prohibited.
  </div>
</body>
</html>`;
}

// Gemini API call for text generation
async function callGeminiText(apiKey: string, prompt: string, userMessage: string): Promise<string> {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Gemini API key is not configured.');
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${prompt}\n\n${userMessage}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Gemini API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to Gemini API.');
    }
    throw err;
  }
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
  // API keys from environment variables
  const claudeApiKey = getClaudeApiKey();
  const geminiApiKey = getGeminiApiKey();
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
  const [selectedVisualColorScheme, setSelectedVisualColorScheme] = useState<ColorScheme>('healthcare-blue');

  // Document view mode state (for each document: 0 = HTML preview, 1 = Edit text)
  const [documentViewModes, setDocumentViewModes] = useState<Record<number, number>>({});

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
      let generatedText: string;

      // Try Gemini first, fallback to Claude
      if (geminiApiKey) {
        try {
          generatedText = await callGeminiText(
            geminiApiKey,
            listPrompt,
            `Objective Element Description:\n\n${description}`
          );
        } catch (geminiErr) {
          console.warn('Gemini failed, trying Claude:', geminiErr);
          if (claudeApiKey) {
            generatedText = await callClaudeText(
              claudeApiKey,
              listPrompt,
              `Objective Element Description:\n\n${description}`
            );
          } else {
            throw geminiErr;
          }
        }
      } else if (claudeApiKey) {
        generatedText = await callClaudeText(
          claudeApiKey,
          listPrompt,
          `Objective Element Description:\n\n${description}`
        );
      } else {
        throw new Error('No API key configured. Please configure either Gemini or Claude API key.');
      }

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

      const userMessage = `Objective Element: ${description}\n\nEvidence Item to Generate:\n${item.text}\n\nGenerate complete, ready-to-use content/template for this evidence in ENGLISH ONLY (internal document) with the hospital header, footer, signature and stamp sections as specified.`;

      try {
        let content: string;

        // Try Gemini first, fallback to Claude
        if (geminiApiKey) {
          try {
            content = await callGeminiText(geminiApiKey, contentPrompt, userMessage);
          } catch (geminiErr) {
            console.warn('Gemini failed for content generation, trying Claude:', geminiErr);
            if (claudeApiKey) {
              content = await callClaudeText(claudeApiKey, contentPrompt, userMessage);
            } else {
              throw geminiErr;
            }
          }
        } else if (claudeApiKey) {
          content = await callClaudeText(claudeApiKey, contentPrompt, userMessage);
        } else {
          throw new Error('No API key configured.');
        }

        // Extract editable text from the generated HTML content
        const editableText = extractTextFromHTML(content);

        contents.push({
          evidenceItem: item.text,
          content,
          editableText,
        });

        setGeneratedContents([...contents]);
      } catch (err) {
        const errorContent = `Error generating content: ${err instanceof Error ? err.message : 'Unknown error'}`;
        contents.push({
          evidenceItem: item.text,
          content: errorContent,
          editableText: errorContent,
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
      // Map visual type to infographic template
      const templateMap: Record<string, InfographicTemplate> = {
        'signage': 'minimal-signage',
        'poster': 'modern-poster',
        'flyer': 'gradient-card',
        'banner': 'modern-poster',
        'infographic': 'healthcare-steps',
        'checklist': 'compliance-checklist',
      };
      
      const template = templateMap[visualType] || 'modern-poster';
      
      // Generate professional SVG infographic
      const svgContent = generateInfographic({
        title: visualTopic,
        titleHindi: visualLanguage.includes('Hindi') ? `${visualTopic} (हिंदी)` : undefined,
        subtitle: typeLabel,
        description: `${typeLabel} for ${hospitalConfig.name}. This visual aid is designed for hospital display areas to support NABH accreditation compliance.`,
        descriptionHindi: visualLanguage.includes('Hindi') ? 'यह विज़ुअल एड NABH मान्यता अनुपालन का समर्थन करने के लिए अस्पताल प्रदर्शन क्षेत्रों के लिए डिज़ाइन किया गया है।' : undefined,
        keyPoints: [
          'Follow standard protocols',
          'Maintain documentation',
          'Ensure patient safety',
          'Report any deviations',
          'Continuous improvement',
        ],
        keyPointsHindi: visualLanguage.includes('Hindi') ? [
          'मानक प्रोटोकॉल का पालन करें',
          'दस्तावेज़ीकरण बनाए रखें',
          'रोगी सुरक्षा सुनिश्चित करें',
          'किसी भी विचलन की रिपोर्ट करें',
          'निरंतर सुधार',
        ] : undefined,
        hospitalName: hospitalConfig.name,
        hospitalAddress: hospitalConfig.address,
        template: template,
        colorScheme: selectedVisualColorScheme,
        showIcons: true,
      });

      // Convert to data URL
      const imageUrl = svgToDataUrl(svgContent);

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

  // Handle text editing and update HTML
  const handleTextEdit = (index: number, newText: string) => {
    setGeneratedContents(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        editableText: newText,
        content: updateHTMLWithText(updated[index].content, newText, hospitalConfig),
      };
      return updated;
    });
  };

  // Toggle document view mode (reserved for future use)
  const _toggleDocumentViewMode = (index: number) => {
    setDocumentViewModes(prev => ({
      ...prev,
      [index]: prev[index] === 1 ? 0 : 1,
    }));
  };
  void _toggleDocumentViewMode; // Suppress unused variable warning

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleCopyAllContents = () => {
    const allContent = generatedContents
      .map(gc => `=== ${gc.evidenceItem} ===\n\n${gc.content}`)
      .join('\n\n---\n\n');
    navigator.clipboard.writeText(allContent);
  };

  // Check if content is HTML - more robust detection
  const isHTMLContent = (content: string): boolean => {
    const trimmed = content.trim();
    return trimmed.includes('<!DOCTYPE html>') ||
           trimmed.includes('<html') ||
           (trimmed.includes('<head>') && trimmed.includes('<body>')) ||
           (trimmed.includes('<style>') && trimmed.includes('</style>'));
  };

  // Extract HTML content from mixed response
  const extractHTMLContent = (content: string): string => {
    const trimmed = content.trim();

    // If starts with DOCTYPE or html tag, return as is
    if (trimmed.startsWith('<!DOCTYPE html>') || trimmed.startsWith('<html')) {
      return trimmed;
    }

    // Try to find the HTML document in the response
    const doctypeIndex = trimmed.indexOf('<!DOCTYPE html>');
    if (doctypeIndex !== -1) {
      return trimmed.substring(doctypeIndex);
    }

    const htmlIndex = trimmed.indexOf('<html');
    if (htmlIndex !== -1) {
      return trimmed.substring(htmlIndex);
    }

    // If no full document, wrap content in basic HTML structure
    if (trimmed.includes('<style>') || trimmed.includes('<div') || trimmed.includes('<table')) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; line-height: 1.6; color: #333; padding: 20px; max-width: 800px; margin: 0 auto; }
  </style>
</head>
<body>
${trimmed}
</body>
</html>`;
    }

    return trimmed;
  };

  // Print content handler
  const handlePrintContent = (content: string, title: string) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      if (isHTMLContent(content)) {
        printWindow.document.write(extractHTMLContent(content));
      } else {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${title} - ${hospitalConfig.name}</title>
              <style>
                body { font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.5; padding: 20px; white-space: pre-wrap; }
                @media print { body { margin: 0; padding: 15px; } }
              </style>
            </head>
            <body>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</body>
          </html>
        `);
      }
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Download as PDF handler
  const handleDownloadPDF = (content: string, filename: string) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      if (isHTMLContent(content)) {
        printWindow.document.write(extractHTMLContent(content));
      } else {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${filename}</title>
              <style>
                body { font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.5; padding: 20px; white-space: pre-wrap; }
                @page { margin: 1cm; }
              </style>
            </head>
            <body>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</body>
          </html>
        `);
      }
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  // Preview HTML content in new window
  const handlePreviewContent = (content: string, title: string) => {
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      if (isHTMLContent(content)) {
        previewWindow.document.write(extractHTMLContent(content));
      } else {
        previewWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${title} - ${hospitalConfig.name}</title>
              <style>
                body { font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.5; padding: 20px; white-space: pre-wrap; background: #f5f5f5; }
              </style>
            </head>
            <body>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</body>
          </html>
        `);
      }
      previewWindow.document.close();
    }
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
          {geminiApiKey && (
            <Chip
              icon={<Icon>check_circle</Icon>}
              label="Gemini"
              color="success"
              variant="outlined"
              size="small"
            />
          )}
          {claudeApiKey && (
            <Chip
              icon={<Icon>check_circle</Icon>}
              label="Claude"
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
          {!geminiApiKey && !claudeApiKey && (
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
        {!geminiApiKey && !claudeApiKey && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>No API keys configured.</strong> Add <code>VITE_GEMINI_API_KEY</code> or <code>VITE_CLAUDE_API_KEY</code> to your <code>.env</code> file.
            </Typography>
          </Alert>
        )}
        {geminiApiKey && !claudeApiKey && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Using <strong>Gemini</strong> for content generation. Claude available as backup if configured.
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
                        Advanced Prompt (Advanced)
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
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Tooltip title="Preview">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePreviewContent(gc.content, gc.evidenceItem.substring(0, 50));
                                  }}
                                >
                                  <Icon fontSize="small">visibility</Icon>
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Print">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrintContent(gc.content, gc.evidenceItem.substring(0, 50));
                                  }}
                                >
                                  <Icon fontSize="small">print</Icon>
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download PDF">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadPDF(gc.content, `Evidence-${index + 1}-${hospitalConfig.name}`);
                                  }}
                                >
                                  <Icon fontSize="small">picture_as_pdf</Icon>
                                </IconButton>
                              </Tooltip>
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
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          {/* View mode tabs and action buttons */}
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Tabs
                              value={documentViewModes[index] || 0}
                              onChange={(_, newValue) => setDocumentViewModes(prev => ({ ...prev, [index]: newValue }))}
                              sx={{ minHeight: 36 }}
                            >
                              <Tab
                                icon={<Icon sx={{ fontSize: 18 }}>article</Icon>}
                                iconPosition="start"
                                label="HTML Preview"
                                sx={{ minHeight: 36, py: 0.5 }}
                              />
                              <Tab
                                icon={<Icon sx={{ fontSize: 18 }}>edit_note</Icon>}
                                iconPosition="start"
                                label="Edit Text"
                                sx={{ minHeight: 36, py: 0.5 }}
                              />
                            </Tabs>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Icon>visibility</Icon>}
                                onClick={() => handlePreviewContent(gc.content, gc.evidenceItem.substring(0, 50))}
                              >
                                Preview
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Icon>print</Icon>}
                                onClick={() => handlePrintContent(gc.content, gc.evidenceItem.substring(0, 50))}
                              >
                                Print
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={<Icon>picture_as_pdf</Icon>}
                                onClick={() => handleDownloadPDF(gc.content, `Evidence-${index + 1}-${hospitalConfig.name}`)}
                              >
                                Download PDF
                              </Button>
                            </Box>
                          </Box>

                          {/* Tab 0: HTML Preview */}
                          {(documentViewModes[index] || 0) === 0 && (
                            <>
                              {isHTMLContent(gc.content) ? (
                                <Paper
                                  variant="outlined"
                                  sx={{
                                    p: 0,
                                    bgcolor: 'white',
                                    maxHeight: 600,
                                    overflow: 'auto',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      '& iframe': {
                                        width: '100%',
                                        height: '500px',
                                        border: 'none',
                                        backgroundColor: 'white',
                                      },
                                    }}
                                  >
                                    <iframe
                                      srcDoc={extractHTMLContent(gc.content)}
                                      title={`Evidence ${index + 1}`}
                                      sandbox="allow-same-origin allow-popups"
                                      style={{ display: 'block' }}
                                    />
                                  </Box>
                                </Paper>
                              ) : (
                                <>
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
                                </>
                              )}
                            </>
                          )}

                          {/* Tab 1: Edit Text */}
                          {(documentViewModes[index] || 0) === 1 && (
                            <Box>
                              <Alert severity="info" sx={{ mb: 2 }}>
                                <Typography variant="body2">
                                  Edit the text below. Changes will automatically update the HTML document.
                                  Use <strong>## Section Title</strong> format to create sections.
                                </Typography>
                              </Alert>
                              <TextField
                                fullWidth
                                multiline
                                minRows={15}
                                maxRows={25}
                                value={gc.editableText}
                                onChange={(e) => handleTextEdit(index, e.target.value)}
                                sx={{
                                  '& .MuiInputBase-root': {
                                    fontFamily: 'monospace',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.6,
                                  },
                                }}
                                placeholder="Edit document text here..."
                              />
                              <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<Icon>content_copy</Icon>}
                                  onClick={() => handleCopyContent(gc.editableText)}
                                >
                                  Copy Text
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                  startIcon={<Icon>article</Icon>}
                                  onClick={() => setDocumentViewModes(prev => ({ ...prev, [index]: 0 }))}
                                >
                                  View Updated HTML
                                </Button>
                              </Box>
                            </Box>
                          )}
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

                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
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
                    
                    {/* Color Scheme Selector */}
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                      Color Scheme
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                      {availableColorSchemes.map((scheme) => (
                        <Tooltip key={scheme.value} title={scheme.label}>
                          <Box
                            onClick={() => setSelectedVisualColorScheme(scheme.value)}
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: 1,
                              bgcolor: scheme.preview,
                              cursor: 'pointer',
                              border: '3px solid',
                              borderColor: selectedVisualColorScheme === scheme.value ? 'common.white' : 'transparent',
                              boxShadow: selectedVisualColorScheme === scheme.value 
                                ? `0 0 0 2px ${scheme.preview}, 0 4px 8px rgba(0,0,0,0.2)` 
                                : '0 2px 4px rgba(0,0,0,0.1)',
                              transition: 'all 0.2s',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                boxShadow: `0 4px 12px rgba(0,0,0,0.2)`,
                              },
                            }}
                          />
                        </Tooltip>
                      ))}
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={isGeneratingImage ? <CircularProgress size={20} color="inherit" /> : <Icon>auto_awesome</Icon>}
                      onClick={handleGenerateVisualEvidence}
                      disabled={isGeneratingImage || !visualTopic.trim()}
                      sx={{
                        background: `linear-gradient(135deg, ${availableColorSchemes.find(s => s.value === selectedVisualColorScheme)?.preview || '#1565C0'} 0%, ${availableColorSchemes.find(s => s.value === selectedVisualColorScheme)?.preview || '#1565C0'}dd 100%)`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${availableColorSchemes.find(s => s.value === selectedVisualColorScheme)?.preview || '#1565C0'}dd 0%, ${availableColorSchemes.find(s => s.value === selectedVisualColorScheme)?.preview || '#1565C0'} 100%)`,
                        },
                      }}
                    >
                      {isGeneratingImage ? 'Generating...' : 'Generate Visual Evidence'}
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
