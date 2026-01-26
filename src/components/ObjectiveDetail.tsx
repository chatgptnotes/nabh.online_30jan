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
import CircularProgress from '@mui/material/CircularProgress';
import { useNABHStore } from '../store/nabhStore';
import type { Status, Priority, ElementCategory, EvidenceFile, YouTubeVideo, TrainingMaterial, SOPDocument } from '../types/nabh';
import { ASSIGNEE_OPTIONS, HOSPITAL_INFO } from '../config/hospitalConfig';
import { getClaudeApiKey } from '../lib/supabase';

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

  // State for training document generators
  const [trainingDate, setTrainingDate] = useState('');
  const [trainingTime, setTrainingTime] = useState('');
  const [trainingVenue, setTrainingVenue] = useState('');
  const [trainerName, setTrainerName] = useState('');
  const [trainerDesignation, setTrainerDesignation] = useState('');
  const [isGeneratingNotice, setIsGeneratingNotice] = useState(false);
  const [generatedNotice, setGeneratedNotice] = useState('');
  const [isGeneratingAttendance, setIsGeneratingAttendance] = useState(false);
  const [generatedAttendance, setGeneratedAttendance] = useState('');
  const [isGeneratingMCQ, setIsGeneratingMCQ] = useState(false);
  const [generatedMCQ, setGeneratedMCQ] = useState('');
  const [mcqQuestionCount, setMcqQuestionCount] = useState(10);

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

  // SOP handlers
  const handleSOPFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const maxSize = 25 * 1024 * 1024; // 25MB

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`File "${file.name}" is not supported. Only PDF and Word documents (DOC, DOCX) are allowed.`);
        return;
      }

      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Maximum size is 25MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const fileType = file.type === 'application/pdf' ? 'pdf' :
                        file.type === 'application/msword' ? 'doc' : 'docx';

        const newSOP: SOPDocument = {
          id: generateId('sop'),
          title: newSOPTitle.trim() || file.name.replace(/\.[^/.]+$/, ''),
          fileName: file.name,
          fileType: fileType as 'pdf' | 'doc' | 'docx',
          fileSize: file.size,
          dataUrl,
          version: newSOPVersion || '1.0',
          effectiveDate: newSOPEffectiveDate || new Date().toISOString().split('T')[0],
          uploadedBy: 'Staff',
          uploadedAt: new Date().toISOString(),
          description: newSOPDescription.trim() || undefined,
        };

        const currentSOPs = objective.sopDocuments || [];
        updateObjective(chapterId, objective.id, {
          sopDocuments: [...currentSOPs, newSOP],
        });
      };
      reader.readAsDataURL(file);
    });

    // Reset
    setNewSOPTitle('');
    setNewSOPVersion('1.0');
    setNewSOPEffectiveDate('');
    setNewSOPDescription('');
    setShowAddSOP(false);
    if (sopFileInputRef.current) {
      sopFileInputRef.current.value = '';
    }
  };

  const handleDeleteSOP = (sopId: string) => {
    const currentSOPs = objective.sopDocuments || [];
    updateObjective(chapterId, objective.id, {
      sopDocuments: currentSOPs.filter((s) => s.id !== sopId),
    });
  };

  const handleViewSOP = (sop: SOPDocument) => {
    const newWindow = window.open();
    if (newWindow) {
      if (sop.fileType === 'pdf') {
        newWindow.document.write(`
          <html>
            <head><title>${sop.title} - ${sop.fileName}</title></head>
            <body style="margin:0;padding:0;">
              <embed src="${sop.dataUrl}" type="application/pdf" width="100%" height="100%" />
            </body>
          </html>
        `);
      } else {
        // For Word documents, provide download link
        const link = document.createElement('a');
        link.href = sop.dataUrl;
        link.download = sop.fileName;
        link.click();
      }
    }
  };

  const handleGenerateSOP = async () => {
    const apiKey = getClaudeApiKey();
    if (!apiKey) {
      alert('Claude API key not configured. Please add VITE_CLAUDE_API_KEY to your .env file.');
      return;
    }

    setIsGeneratingSOP(true);
    setGeneratedSOPContent('');

    try {
      const prompt = `You are an expert in NABH (National Accreditation Board for Hospitals and Healthcare Providers) documentation for ${HOSPITAL_INFO.name}.

Generate a complete, professional, BILINGUAL (English AND Hindi) Standard Operating Procedure (SOP) document for the following NABH objective element.

CRITICAL: The SOP must be in BOTH English AND Hindi throughout.

Hospital: ${HOSPITAL_INFO.name}
Address: ${HOSPITAL_INFO.address}

NABH Objective Element Code: ${objective.code}
Title: ${objective.title}
Description: ${objective.description}

Generate a comprehensive SOP with the following structure:

================================================================================
                              ${HOSPITAL_INFO.name.toUpperCase()}
                    STANDARD OPERATING PROCEDURE / मानक संचालन प्रक्रिया
================================================================================

SOP Title / शीर्षक: [Based on objective element]
Document No / दस्तावेज़ संख्या: SOP-${objective.code.replace(/\./g, '-')}-001
Version / संस्करण: 1.0
Effective Date / प्रभावी तिथि: [Today's date]
Review Date / समीक्षा तिथि: [One year from today]
Department / विभाग: [Relevant department]
Page / पृष्ठ: 1 of X

--------------------------------------------------------------------------------

1. PURPOSE / उद्देश्य
[Explain the purpose in both English and Hindi]

2. SCOPE / दायरा
[Define the scope in both English and Hindi]

3. DEFINITIONS / परिभाषाएं
[List key terms with definitions in both languages]

4. RESPONSIBILITIES / जिम्मेदारियां
[Define roles and responsibilities in both languages]

5. PROCEDURE / प्रक्रिया
[Step-by-step procedure in both languages]

6. DOCUMENTATION / दस्तावेज़ीकरण
[Required documentation and records in both languages]

7. REFERENCES / संदर्भ
- NABH Standards
- Hospital Policies
- Relevant Guidelines

8. ATTACHMENTS / संलग्नक
[List any forms, checklists, or annexures]

================================================================================
PREPARED BY / तैयारकर्ता:         REVIEWED BY / समीक्षाकर्ता:      APPROVED BY / अनुमोदनकर्ता:
_____________________          _____________________          _____________________
Name / नाम:                    Name / नाम:                    Name / नाम:
Designation / पदनाम:           Designation / पदनाम:           Designation / पदनाम:
Date / तिथि:                   Date / तिथि:                   Date / तिथि:
Signature / हस्ताक्षर:          Signature / हस्ताक्षर:          Signature / हस्ताक्षर:
================================================================================`;

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
          max_tokens: 8192,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate SOP');
      }

      const data = await response.json();
      const content = data.content?.[0]?.text || '';
      setGeneratedSOPContent(content);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to generate SOP. Please try again.');
    } finally {
      setIsGeneratingSOP(false);
    }
  };

  const handleCopyGeneratedSOP = () => {
    navigator.clipboard.writeText(generatedSOPContent);
    alert('SOP content copied to clipboard!');
  };

  // Training Document Generators
  const handleGenerateTrainingNotice = async () => {
    const apiKey = getClaudeApiKey();
    if (!apiKey) {
      alert('Claude API key not configured. Please add VITE_CLAUDE_API_KEY to your .env file.');
      return;
    }

    if (!trainingDate || !trainerName) {
      alert('Please enter training date and trainer name.');
      return;
    }

    setIsGeneratingNotice(true);
    setGeneratedNotice('');

    try {
      const prompt = `Generate a professional BILINGUAL (English AND Hindi) training notice/announcement for ${HOSPITAL_INFO.name}.

Hospital: ${HOSPITAL_INFO.name}
Address: ${HOSPITAL_INFO.address}

Training Details:
- Topic: ${objective.title} (${objective.code})
- Date: ${trainingDate}
- Time: ${trainingTime || 'To be announced'}
- Venue: ${trainingVenue || 'Hospital Conference Room'}
- Trainer: ${trainerName}
- Trainer Designation: ${trainerDesignation || 'Trainer'}

Generate a formal notice on hospital letterhead format with the following structure:

================================================================================
                              ${HOSPITAL_INFO.name.toUpperCase()}
                         ${HOSPITAL_INFO.address}
================================================================================

                    TRAINING NOTICE / प्रशिक्षण सूचना
                    --------------------------------

Reference No: TRN/${objective.code.replace(/\./g, '/')}/${new Date().getFullYear()}
Date: [Current Date]

To: All Concerned Staff / सभी संबंधित कर्मचारी

Subject: Training on [Topic] / विषय: [Topic in Hindi] पर प्रशिक्षण

[Body of notice in both English and Hindi explaining the training, its importance, who should attend, what to bring, etc.]

TRAINING DETAILS / प्रशिक्षण विवरण:
- Date / तिथि: ${trainingDate}
- Time / समय: ${trainingTime || 'To be announced'}
- Venue / स्थान: ${trainingVenue || 'Hospital Conference Room'}
- Trainer / प्रशिक्षक: ${trainerName}, ${trainerDesignation || 'Trainer'}

[Attendance is mandatory / उपस्थिति अनिवार्य है]

================================================================================
Issued by / जारीकर्ता:
[Quality Coordinator Name]
Quality Coordinator
${HOSPITAL_INFO.name}
================================================================================`;

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
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate notice');
      }

      const data = await response.json();
      setGeneratedNotice(data.content?.[0]?.text || '');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to generate notice.');
    } finally {
      setIsGeneratingNotice(false);
    }
  };

  const handleGenerateAttendanceSheet = async () => {
    const apiKey = getClaudeApiKey();
    if (!apiKey) {
      alert('Claude API key not configured.');
      return;
    }

    setIsGeneratingAttendance(true);
    setGeneratedAttendance('');

    try {
      const prompt = `Generate a BILINGUAL (English AND Hindi) training attendance sheet for ${HOSPITAL_INFO.name}.

Hospital: ${HOSPITAL_INFO.name}
Training Topic: ${objective.title} (${objective.code})
Training Date: ${trainingDate || '[Date]'}
Trainer: ${trainerName || '[Trainer Name]'}

Create a professional attendance sheet with:

================================================================================
                              ${HOSPITAL_INFO.name.toUpperCase()}
                    TRAINING ATTENDANCE SHEET / प्रशिक्षण उपस्थिति पत्रक
================================================================================

Training Topic / प्रशिक्षण विषय: ${objective.title}
NABH Code / NABH कोड: ${objective.code}
Date / तिथि: ${trainingDate || '_____________'}
Time / समय: ${trainingTime || '_____________'}
Venue / स्थान: ${trainingVenue || '_____________'}
Trainer Name / प्रशिक्षक का नाम: ${trainerName || '_____________'}
Trainer Designation / पदनाम: ${trainerDesignation || '_____________'}

--------------------------------------------------------------------------------
S.No | Name / नाम | Designation / पदनाम | Department / विभाग | Signature / हस्ताक्षर
--------------------------------------------------------------------------------
1    |            |                     |                    |
2    |            |                     |                    |
3    |            |                     |                    |
[Continue for 20 rows]

--------------------------------------------------------------------------------
Total Attendees / कुल उपस्थित: ___________

TRAINER'S CERTIFICATION / प्रशिक्षक प्रमाणन:
I certify that the above training was conducted as per schedule.
मैं प्रमाणित करता/करती हूं कि उपरोक्त प्रशिक्षण निर्धारित समय पर आयोजित किया गया।

Trainer Signature / प्रशिक्षक हस्ताक्षर: _____________________
Date / तिथि: _____________________

================================================================================`;

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
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate attendance sheet');
      }

      const data = await response.json();
      setGeneratedAttendance(data.content?.[0]?.text || '');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to generate attendance sheet.');
    } finally {
      setIsGeneratingAttendance(false);
    }
  };

  const handleGenerateMCQTest = async () => {
    const apiKey = getClaudeApiKey();
    if (!apiKey) {
      alert('Claude API key not configured.');
      return;
    }

    setIsGeneratingMCQ(true);
    setGeneratedMCQ('');

    try {
      const prompt = `Generate a BILINGUAL (English AND Hindi) Multiple Choice Question (MCQ) test for training evaluation at ${HOSPITAL_INFO.name}.

Hospital: ${HOSPITAL_INFO.name}
Training Topic: ${objective.title}
NABH Code: ${objective.code}
Topic Description: ${objective.description}

Generate ${mcqQuestionCount} MCQ questions to evaluate staff understanding of this topic.

Format:

================================================================================
                              ${HOSPITAL_INFO.name.toUpperCase()}
              TRAINING EVALUATION TEST / प्रशिक्षण मूल्यांकन परीक्षा
================================================================================

Topic / विषय: ${objective.title}
NABH Code / NABH कोड: ${objective.code}
Total Questions / कुल प्रश्न: ${mcqQuestionCount}
Time / समय: 15 minutes / 15 मिनट
Total Marks / कुल अंक: ${mcqQuestionCount}

Name / नाम: _____________________
Designation / पदनाम: _____________________
Department / विभाग: _____________________
Date / तिथि: _____________________

INSTRUCTIONS / निर्देश:
- Circle the correct answer / सही उत्तर पर गोला लगाएं
- Each question carries 1 mark / प्रत्येक प्रश्न 1 अंक का है
- All questions are compulsory / सभी प्रश्न अनिवार्य हैं

--------------------------------------------------------------------------------

[Generate ${mcqQuestionCount} MCQ questions with 4 options each, in both English and Hindi]

Q1. [Question in English]
    [Question in Hindi]
    a) Option A / विकल्प A
    b) Option B / विकल्प B
    c) Option C / विकल्प C
    d) Option D / विकल्प D

[Continue for all questions]

--------------------------------------------------------------------------------
FOR OFFICIAL USE ONLY / केवल आधिकारिक उपयोग के लिए

Total Score / कुल अंक: _____ / ${mcqQuestionCount}
Percentage / प्रतिशत: _____%
Result / परिणाम: PASS / FAIL (Passing: 70%)

Evaluator Signature / मूल्यांकनकर्ता हस्ताक्षर: _____________________

================================================================================

ANSWER KEY / उत्तर कुंजी (Keep Separately):
[List all correct answers]
================================================================================`;

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
          max_tokens: 8192,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate MCQ test');
      }

      const data = await response.json();
      setGeneratedMCQ(data.content?.[0]?.text || '');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to generate MCQ test.');
    } finally {
      setIsGeneratingMCQ(false);
    }
  };

  const handleCopyContent = (content: string, label: string) => {
    navigator.clipboard.writeText(content);
    alert(`${label} copied to clipboard!`);
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

          {/* Training Document Generator Section */}
          <Accordion sx={{ bgcolor: 'secondary.50', border: '1px solid', borderColor: 'secondary.200' }}>
            <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon color="secondary">auto_awesome</Icon>
                <Typography fontWeight={600}>Training Document Generator</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Generate training documents: Notice, Attendance Sheet, and MCQ Test for staff evaluation.
                </Typography>
              </Alert>

              {/* Training Details Form */}
              <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Training Details (for document generation)
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Training Date"
                      type="date"
                      value={trainingDate}
                      onChange={(e) => setTrainingDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Training Time"
                      placeholder="e.g., 10:00 AM - 12:00 PM"
                      value={trainingTime}
                      onChange={(e) => setTrainingTime(e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Venue"
                      placeholder="e.g., Conference Room"
                      value={trainingVenue}
                      onChange={(e) => setTrainingVenue(e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Trainer Name"
                      placeholder="e.g., Dr. Sharma"
                      value={trainerName}
                      onChange={(e) => setTrainerName(e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Trainer Designation"
                      placeholder="e.g., Infection Control Nurse"
                      value={trainerDesignation}
                      onChange={(e) => setTrainerDesignation(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* Generate Buttons */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={isGeneratingNotice ? <CircularProgress size={16} color="inherit" /> : <Icon>campaign</Icon>}
                  onClick={handleGenerateTrainingNotice}
                  disabled={isGeneratingNotice}
                >
                  {isGeneratingNotice ? 'Generating...' : 'Generate Training Notice'}
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={isGeneratingAttendance ? <CircularProgress size={16} color="inherit" /> : <Icon>people</Icon>}
                  onClick={handleGenerateAttendanceSheet}
                  disabled={isGeneratingAttendance}
                >
                  {isGeneratingAttendance ? 'Generating...' : 'Generate Attendance Sheet'}
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    size="small"
                    type="number"
                    label="Questions"
                    value={mcqQuestionCount}
                    onChange={(e) => setMcqQuestionCount(parseInt(e.target.value) || 10)}
                    sx={{ width: 100 }}
                    inputProps={{ min: 5, max: 20 }}
                  />
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={isGeneratingMCQ ? <CircularProgress size={16} color="inherit" /> : <Icon>quiz</Icon>}
                    onClick={handleGenerateMCQTest}
                    disabled={isGeneratingMCQ}
                  >
                    {isGeneratingMCQ ? 'Generating...' : 'Generate MCQ Test'}
                  </Button>
                </Box>
              </Box>

              {/* Generated Training Notice */}
              {generatedNotice && (
                <Card variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'primary.50' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      <Icon sx={{ verticalAlign: 'middle', mr: 1 }}>campaign</Icon>
                      Training Notice (Bilingual)
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Icon>content_copy</Icon>} onClick={() => handleCopyContent(generatedNotice, 'Training Notice')}>
                        Copy
                      </Button>
                      <Button size="small" color="error" startIcon={<Icon>close</Icon>} onClick={() => setGeneratedNotice('')}>
                        Close
                      </Button>
                    </Box>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider', maxHeight: 300, overflow: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {generatedNotice}
                  </Box>
                </Card>
              )}

              {/* Generated Attendance Sheet */}
              {generatedAttendance && (
                <Card variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'success.50' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      <Icon sx={{ verticalAlign: 'middle', mr: 1 }}>people</Icon>
                      Attendance Sheet (Bilingual)
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Icon>content_copy</Icon>} onClick={() => handleCopyContent(generatedAttendance, 'Attendance Sheet')}>
                        Copy
                      </Button>
                      <Button size="small" color="error" startIcon={<Icon>close</Icon>} onClick={() => setGeneratedAttendance('')}>
                        Close
                      </Button>
                    </Box>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider', maxHeight: 300, overflow: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {generatedAttendance}
                  </Box>
                </Card>
              )}

              {/* Generated MCQ Test */}
              {generatedMCQ && (
                <Card variant="outlined" sx={{ p: 2, bgcolor: 'warning.50' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      <Icon sx={{ verticalAlign: 'middle', mr: 1 }}>quiz</Icon>
                      MCQ Evaluation Test (Bilingual)
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Icon>content_copy</Icon>} onClick={() => handleCopyContent(generatedMCQ, 'MCQ Test')}>
                        Copy
                      </Button>
                      <Button size="small" color="error" startIcon={<Icon>close</Icon>} onClick={() => setGeneratedMCQ('')}>
                        Close
                      </Button>
                    </Box>
                  </Box>
                  <Alert severity="info" sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      The answer key is included at the end. Keep it separate from the test paper.
                    </Typography>
                  </Alert>
                  <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider', maxHeight: 400, overflow: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {generatedMCQ}
                  </Box>
                </Card>
              )}
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

          {/* SOP Documents Section */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon color="primary">description</Icon>
                <Typography fontWeight={600}>
                  Standard Operating Procedures (SOPs) ({(objective.sopDocuments || []).length})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Upload hospital SOPs (PDF or Word documents) or generate a new SOP using AI if needed.
                </Typography>
              </Alert>

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
                              bgcolor: sop.fileType === 'pdf' ? 'error.light' : 'primary.light',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleViewSOP(sop)}
                          >
                            <Icon sx={{ fontSize: 48, color: 'white' }}>
                              {sop.fileType === 'pdf' ? 'picture_as_pdf' : 'description'}
                            </Icon>
                          </Box>
                          <CardContent sx={{ pb: 1 }}>
                            <Tooltip title={sop.title}>
                              <Typography variant="subtitle2" noWrap fontWeight={600}>
                                {sop.title}
                              </Typography>
                            </Tooltip>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                              <Chip
                                label={sop.fileType.toUpperCase()}
                                size="small"
                                color={sop.fileType === 'pdf' ? 'error' : 'primary'}
                                sx={{ height: 20, fontSize: 10 }}
                              />
                              <Chip
                                label={`v${sop.version}`}
                                size="small"
                                variant="outlined"
                                sx={{ height: 20, fontSize: 10 }}
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              Effective: {sop.effectiveDate}
                            </Typography>
                            {sop.description && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                {sop.description}
                              </Typography>
                            )}
                          </CardContent>
                          <CardActions sx={{ pt: 0, justifyContent: 'space-between' }}>
                            <Button
                              size="small"
                              startIcon={<Icon>visibility</Icon>}
                              onClick={() => handleViewSOP(sop)}
                            >
                              View
                            </Button>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteSOP(sop.id)}
                            >
                              <Icon fontSize="small">delete</Icon>
                            </IconButton>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* Add SOP Form */}
                {showAddSOP ? (
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Upload SOP Document
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="SOP Title"
                        placeholder="e.g., Hand Hygiene Protocol"
                        value={newSOPTitle}
                        onChange={(e) => setNewSOPTitle(e.target.value)}
                      />
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Version"
                            placeholder="1.0"
                            value={newSOPVersion}
                            onChange={(e) => setNewSOPVersion(e.target.value)}
                          />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Effective Date"
                            type="date"
                            value={newSOPEffectiveDate}
                            onChange={(e) => setNewSOPEffectiveDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                      </Grid>
                      <TextField
                        fullWidth
                        size="small"
                        label="Description (optional)"
                        placeholder="Brief description of the SOP"
                        value={newSOPDescription}
                        onChange={(e) => setNewSOPDescription(e.target.value)}
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Icon>upload</Icon>}
                          onClick={() => sopFileInputRef.current?.click()}
                        >
                          Upload SOP File
                        </Button>
                        <Button
                          size="small"
                          onClick={() => setShowAddSOP(false)}
                        >
                          Cancel
                        </Button>
                      </Box>
                      <input
                        ref={sopFileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleSOPFileUpload}
                        style={{ display: 'none' }}
                      />
                    </Box>
                  </Card>
                ) : (
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      startIcon={<Icon>upload_file</Icon>}
                      onClick={() => setShowAddSOP(true)}
                    >
                      Upload SOP
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={isGeneratingSOP ? <CircularProgress size={16} color="inherit" /> : <Icon>auto_awesome</Icon>}
                      onClick={handleGenerateSOP}
                      disabled={isGeneratingSOP}
                    >
                      {isGeneratingSOP ? 'Generating...' : 'Generate SOP with AI'}
                    </Button>
                  </Box>
                )}

                {/* Generated SOP Content */}
                {generatedSOPContent && (
                  <Card variant="outlined" sx={{ p: 2, bgcolor: 'success.50' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        <Icon sx={{ verticalAlign: 'middle', mr: 1 }}>auto_awesome</Icon>
                        Generated SOP (Bilingual)
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<Icon>content_copy</Icon>}
                          onClick={handleCopyGeneratedSOP}
                        >
                          Copy
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Icon>close</Icon>}
                          onClick={() => setGeneratedSOPContent('')}
                        >
                          Close
                        </Button>
                      </Box>
                    </Box>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        Review and customize the generated SOP. Copy the content and paste it into a Word document for final formatting.
                      </Typography>
                    </Alert>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        maxHeight: 400,
                        overflow: 'auto',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        lineHeight: 1.6,
                      }}
                    >
                      {generatedSOPContent}
                    </Box>
                  </Card>
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
