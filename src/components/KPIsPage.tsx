import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Icon from '@mui/material/Icon';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import { HOSPITAL_INFO } from '../config/hospitalConfig';
import { extractFromDocument, extractKPIData, generateImprovedDocument } from '../services/documentExtractor';

interface KPIEntry {
  month: string;
  value: number;
  target: number;
  remarks?: string;
}

interface KPI {
  id: string;
  name: string;
  category: string;
  unit: string;
  frequency: string;
  target: number;
  formula: string;
  responsible: string;
  entries: KPIEntry[];
  createdAt: string;
}

const KPI_CATEGORIES = [
  { id: 'clinical', label: 'Clinical Indicators', icon: 'medical_services' },
  { id: 'patient_safety', label: 'Patient Safety', icon: 'health_and_safety' },
  { id: 'infection', label: 'Infection Control', icon: 'sanitizer' },
  { id: 'nursing', label: 'Nursing Indicators', icon: 'local_hospital' },
  { id: 'laboratory', label: 'Laboratory', icon: 'science' },
  { id: 'radiology', label: 'Radiology', icon: 'radio_button_checked' },
  { id: 'operational', label: 'Operational', icon: 'settings' },
  { id: 'patient_experience', label: 'Patient Experience', icon: 'sentiment_satisfied' },
];

const UPLOAD_WORKFLOW_STEPS = ['Upload Document', 'Extract KPIs', 'Review & Edit', 'Generate Report'];

const NABH_STANDARD_KPIS = [
  // Clinical Indicators
  { name: 'Return to ICU within 48 hours', category: 'clinical', unit: '%', target: 5, formula: '(Returns to ICU / Total ICU Discharges) x 100', frequency: 'Monthly' },
  { name: 'Unplanned Return to OT', category: 'clinical', unit: '%', target: 2, formula: '(Unplanned Returns / Total Surgeries) x 100', frequency: 'Monthly' },
  { name: 'Re-exploration Rate', category: 'clinical', unit: '%', target: 2, formula: '(Re-explorations / Total Surgeries) x 100', frequency: 'Monthly' },
  { name: 'Mortality Rate', category: 'clinical', unit: '%', target: 2, formula: '(Deaths / Total Admissions) x 100', frequency: 'Monthly' },
  // Patient Safety
  { name: 'Patient Fall Rate', category: 'patient_safety', unit: 'per 1000 patient days', target: 1, formula: '(Falls / Patient Days) x 1000', frequency: 'Monthly' },
  { name: 'Pressure Ulcer Rate', category: 'patient_safety', unit: '%', target: 1, formula: '(New Pressure Ulcers / Total Patients) x 100', frequency: 'Monthly' },
  { name: 'Medication Error Rate', category: 'patient_safety', unit: 'per 1000 doses', target: 0.5, formula: '(Errors / Total Doses) x 1000', frequency: 'Monthly' },
  { name: 'Wrong Site Surgery', category: 'patient_safety', unit: 'count', target: 0, formula: 'Total count', frequency: 'Monthly' },
  // Infection Control
  { name: 'SSI Rate', category: 'infection', unit: '%', target: 2, formula: '(SSIs / Total Surgeries) x 100', frequency: 'Monthly' },
  { name: 'CLABSI Rate', category: 'infection', unit: 'per 1000 line days', target: 2, formula: '(CLABSIs / Central Line Days) x 1000', frequency: 'Monthly' },
  { name: 'CAUTI Rate', category: 'infection', unit: 'per 1000 catheter days', target: 3, formula: '(CAUTIs / Catheter Days) x 1000', frequency: 'Monthly' },
  { name: 'VAP Rate', category: 'infection', unit: 'per 1000 ventilator days', target: 5, formula: '(VAPs / Ventilator Days) x 1000', frequency: 'Monthly' },
  { name: 'Hand Hygiene Compliance', category: 'infection', unit: '%', target: 85, formula: '(Compliant Observations / Total) x 100', frequency: 'Monthly' },
  // Nursing
  { name: 'Nursing Hours per Patient Day', category: 'nursing', unit: 'hours', target: 6, formula: 'Total Nursing Hours / Patient Days', frequency: 'Monthly' },
  { name: 'Nursing Documentation Compliance', category: 'nursing', unit: '%', target: 95, formula: '(Compliant Records / Total) x 100', frequency: 'Monthly' },
  // Laboratory
  { name: 'Lab TAT - Routine', category: 'laboratory', unit: 'hours', target: 4, formula: 'Average turnaround time', frequency: 'Monthly' },
  { name: 'Lab TAT - Stat', category: 'laboratory', unit: 'minutes', target: 60, formula: 'Average turnaround time', frequency: 'Monthly' },
  { name: 'Critical Value Reporting Time', category: 'laboratory', unit: 'minutes', target: 30, formula: 'Average notification time', frequency: 'Monthly' },
  // Patient Experience
  { name: 'Patient Satisfaction Score', category: 'patient_experience', unit: '%', target: 85, formula: 'Average satisfaction score', frequency: 'Monthly' },
  { name: 'Complaint Resolution Time', category: 'patient_experience', unit: 'hours', target: 48, formula: 'Average resolution time', frequency: 'Monthly' },
  { name: 'AMA Rate', category: 'patient_experience', unit: '%', target: 2, formula: '(AMA Discharges / Total) x 100', frequency: 'Monthly' },
];

export default function KPIsPage() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  const [newKPI, setNewKPI] = useState({
    name: '',
    category: 'clinical',
    unit: '%',
    target: 0,
    formula: '',
    frequency: 'Monthly',
    responsible: '',
  });
  const [newEntry, setNewEntry] = useState({
    month: new Date().toISOString().slice(0, 7),
    value: 0,
    target: 0,
    remarks: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Upload workflow states
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadWorkflowStep, setUploadWorkflowStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [extractedKPIs, setExtractedKPIs] = useState<{ name: string; category: string; target: number; unit: string; formula: string }[]>([]);
  const [userSuggestions, setUserSuggestions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState('');
  const [activeUploadTab, setActiveUploadTab] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load KPIs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nabh_kpis');
    if (saved) {
      setKpis(JSON.parse(saved));
    } else {
      // Initialize with standard NABH KPIs
      const initialKPIs: KPI[] = NABH_STANDARD_KPIS.map((k, i) => ({
        id: `kpi_${i}`,
        name: k.name,
        category: k.category,
        unit: k.unit,
        frequency: k.frequency,
        target: k.target,
        formula: k.formula,
        responsible: '',
        entries: [],
        createdAt: new Date().toISOString(),
      }));
      setKpis(initialKPIs);
    }
  }, []);

  // Save KPIs to localStorage
  useEffect(() => {
    if (kpis.length > 0) {
      localStorage.setItem('nabh_kpis', JSON.stringify(kpis));
    }
  }, [kpis]);

  const handleAddKPI = () => {
    if (!newKPI.name.trim()) {
      setSnackbar({ open: true, message: 'Please enter KPI name', severity: 'error' });
      return;
    }

    const kpi: KPI = {
      id: `kpi_${Date.now()}`,
      ...newKPI,
      entries: [],
      createdAt: new Date().toISOString(),
    };

    setKpis([...kpis, kpi]);
    setIsAddDialogOpen(false);
    setNewKPI({ name: '', category: 'clinical', unit: '%', target: 0, formula: '', frequency: 'Monthly', responsible: '' });
    setSnackbar({ open: true, message: 'KPI added successfully', severity: 'success' });
  };

  const handleAddEntry = () => {
    if (!selectedKPI) return;

    const entry: KPIEntry = {
      month: newEntry.month,
      value: newEntry.value,
      target: newEntry.target || selectedKPI.target,
      remarks: newEntry.remarks,
    };

    setKpis(prev => prev.map(k =>
      k.id === selectedKPI.id
        ? { ...k, entries: [...k.entries.filter(e => e.month !== entry.month), entry].sort((a, b) => a.month.localeCompare(b.month)) }
        : k
    ));

    setIsEntryDialogOpen(false);
    setNewEntry({ month: new Date().toISOString().slice(0, 7), value: 0, target: 0, remarks: '' });
    setSnackbar({ open: true, message: 'Entry added successfully', severity: 'success' });
  };

  const handleDeleteKPI = (id: string) => {
    setKpis(prev => prev.filter(k => k.id !== id));
    setSnackbar({ open: true, message: 'KPI deleted', severity: 'success' });
  };

  const filteredKPIs = selectedCategory === 'all'
    ? kpis
    : kpis.filter(k => k.category === selectedCategory);

  const getPerformanceColor = (value: number, target: number, unit: string) => {
    // For rates and percentages where lower is better
    const lowerIsBetter = ['%', 'per 1000', 'count', 'hours', 'minutes'].some(u => unit.includes(u)) &&
      !['Compliance', 'Satisfaction', 'Hours per'].some(n => unit.includes(n));

    if (lowerIsBetter) {
      if (value <= target) return 'success';
      if (value <= target * 1.5) return 'warning';
      return 'error';
    } else {
      if (value >= target) return 'success';
      if (value >= target * 0.8) return 'warning';
      return 'error';
    }
  };

  const getLatestValue = (kpi: KPI) => {
    if (kpi.entries.length === 0) return null;
    return kpi.entries[kpi.entries.length - 1];
  };

  // Upload workflow handlers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setUploadWorkflowStep(1);
      handleExtractFromFile(file);
    }
  };

  const handleExtractFromFile = async (file: File) => {
    setIsExtracting(true);
    try {
      const result = await extractFromDocument(file, 'kpi');
      if (result.success && result.text) {
        setExtractedText(result.text);

        const kpiData = await extractKPIData(result.text);
        setExtractedKPIs(kpiData.kpis || []);
        setUploadWorkflowStep(2);
        setSnackbar({ open: true, message: `Extracted ${kpiData.kpis?.length || 0} KPIs`, severity: 'success' });
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to extract text', severity: 'error' });
      }
    } catch (error) {
      console.error('Error extracting from file:', error);
      setSnackbar({ open: true, message: 'Error processing document', severity: 'error' });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGenerateKPIReport = async () => {
    if (!extractedText) {
      setSnackbar({ open: true, message: 'No extracted text to generate from', severity: 'error' });
      return;
    }

    setIsGenerating(true);
    try {
      const report = await generateImprovedDocument(
        extractedText,
        'kpi',
        userSuggestions,
        HOSPITAL_INFO.name
      );
      setGeneratedReport(report);
      setUploadWorkflowStep(3);
      setSnackbar({ open: true, message: 'KPI Report generated successfully', severity: 'success' });
    } catch (error) {
      console.error('Error generating report:', error);
      setSnackbar({ open: true, message: 'Error generating report', severity: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImportExtractedKPIs = () => {
    if (extractedKPIs.length === 0) {
      setSnackbar({ open: true, message: 'No KPIs to import', severity: 'error' });
      return;
    }

    const newKPIs: KPI[] = extractedKPIs.map((k, i) => ({
      id: `kpi_imported_${Date.now()}_${i}`,
      name: k.name,
      category: k.category || 'clinical',
      unit: k.unit || '%',
      frequency: 'Monthly',
      target: k.target || 0,
      formula: k.formula || '',
      responsible: '',
      entries: [],
      createdAt: new Date().toISOString(),
    }));

    setKpis([...kpis, ...newKPIs]);
    resetUploadWorkflow();
    setSnackbar({ open: true, message: `${newKPIs.length} KPIs imported successfully`, severity: 'success' });
  };

  const resetUploadWorkflow = () => {
    setIsUploadDialogOpen(false);
    setUploadWorkflowStep(0);
    setUploadedFile(null);
    setExtractedText('');
    setExtractedKPIs([]);
    setUserSuggestions('');
    setGeneratedReport('');
    setActiveUploadTab(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadReport = () => {
    if (!generatedReport) return;

    const blob = new Blob([generatedReport], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'KPI_Report.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintReport = () => {
    if (!generatedReport) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generatedReport);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Calculate summary stats
  const totalKPIs = kpis.length;
  const kpisWithData = kpis.filter(k => k.entries.length > 0).length;
  const kpisMeetingTarget = kpis.filter(k => {
    const latest = getLatestValue(k);
    if (!latest) return false;
    return latest.value <= k.target; // Simplified - assuming lower is better
  }).length;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="primary">
            Key Performance Indicators
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track and monitor NABH quality indicators
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Icon>upload_file</Icon>}
            onClick={() => setIsUploadDialogOpen(true)}
          >
            Upload KPI Doc
          </Button>
          <Button
            variant="contained"
            startIcon={<Icon>add</Icon>}
            onClick={() => setIsAddDialogOpen(true)}
          >
            Add KPI
          </Button>
        </Box>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xlsx,.xls"
          onChange={handleFileUpload}
        />
      </Box>

      {/* Category Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedCategory}
          onChange={(_, value) => setSelectedCategory(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab value="all" label="All KPIs" icon={<Icon>dashboard</Icon>} iconPosition="start" />
          {KPI_CATEGORIES.map(cat => (
            <Tab key={cat.id} value={cat.id} label={cat.label} icon={<Icon>{cat.icon}</Icon>} iconPosition="start" />
          ))}
        </Tabs>
      </Paper>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.50' }}>
            <Typography variant="h4" color="primary" fontWeight={700}>{totalKPIs}</Typography>
            <Typography variant="body2" color="text.secondary">Total KPIs</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.50' }}>
            <Typography variant="h4" color="info.main" fontWeight={700}>{kpisWithData}</Typography>
            <Typography variant="body2" color="text.secondary">With Data</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.50' }}>
            <Typography variant="h4" color="success.main" fontWeight={700}>{kpisMeetingTarget}</Typography>
            <Typography variant="body2" color="text.secondary">Meeting Target</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.50' }}>
            <Typography variant="h4" color="warning.main" fontWeight={700}>{totalKPIs - kpisWithData}</Typography>
            <Typography variant="body2" color="text.secondary">Need Data Entry</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* KPIs Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>KPI Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="center">Target</TableCell>
                <TableCell align="center">Current Value</TableCell>
                <TableCell align="center">Trend</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredKPIs.map(kpi => {
                const latest = getLatestValue(kpi);
                const performanceColor = latest ? getPerformanceColor(latest.value, kpi.target, kpi.unit) : 'default';

                return (
                  <TableRow key={kpi.id} hover>
                    <TableCell>
                      <Typography fontWeight={500}>{kpi.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{kpi.formula}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={KPI_CATEGORIES.find(c => c.id === kpi.category)?.label || kpi.category}
                        size="small"
                        icon={<Icon sx={{ fontSize: 16 }}>{KPI_CATEGORIES.find(c => c.id === kpi.category)?.icon}</Icon>}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontWeight={600}>{kpi.target} {kpi.unit}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      {latest ? (
                        <Typography fontWeight={600} color={`${performanceColor}.main`}>
                          {latest.value} {kpi.unit}
                        </Typography>
                      ) : (
                        <Typography color="text.secondary">No data</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {kpi.entries.length > 1 ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          {kpi.entries.slice(-3).map((e, i) => (
                            <Tooltip key={i} title={`${e.month}: ${e.value}`}>
                              <Box
                                sx={{
                                  width: 8,
                                  height: 20,
                                  bgcolor: getPerformanceColor(e.value, kpi.target, kpi.unit) + '.main',
                                  borderRadius: 1,
                                }}
                              />
                            </Tooltip>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={latest ? (performanceColor === 'success' ? 'On Target' : performanceColor === 'warning' ? 'Near Target' : 'Off Target') : 'No Data'}
                        size="small"
                        color={performanceColor as any}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Add Entry">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => { setSelectedKPI(kpi); setNewEntry({ ...newEntry, target: kpi.target }); setIsEntryDialogOpen(true); }}
                        >
                          <Icon>add_circle</Icon>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View History">
                        <IconButton size="small">
                          <Icon>history</Icon>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDeleteKPI(kpi.id)}>
                          <Icon>delete</Icon>
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add KPI Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon color="primary">add_chart</Icon>
            Add New KPI
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="KPI Name"
            value={newKPI.name}
            onChange={(e) => setNewKPI({ ...newKPI, name: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          />
          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                fullWidth
                select
                label="Category"
                value={newKPI.category}
                onChange={(e) => setNewKPI({ ...newKPI, category: e.target.value })}
                slotProps={{ select: { native: true } }}
              >
                {KPI_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </TextField>
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Unit"
                value={newKPI.unit}
                onChange={(e) => setNewKPI({ ...newKPI, unit: e.target.value })}
                placeholder="%, count, per 1000"
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                type="number"
                label="Target Value"
                value={newKPI.target}
                onChange={(e) => setNewKPI({ ...newKPI, target: Number(e.target.value) })}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                select
                label="Frequency"
                value={newKPI.frequency}
                onChange={(e) => setNewKPI({ ...newKPI, frequency: e.target.value })}
                slotProps={{ select: { native: true } }}
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
              </TextField>
            </Grid>
          </Grid>
          <TextField
            fullWidth
            label="Formula"
            value={newKPI.formula}
            onChange={(e) => setNewKPI({ ...newKPI, formula: e.target.value })}
            sx={{ mt: 2 }}
            placeholder="e.g., (Numerator / Denominator) x 100"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddKPI}>Add KPI</Button>
        </DialogActions>
      </Dialog>

      {/* Add Entry Dialog */}
      <Dialog open={isEntryDialogOpen} onClose={() => setIsEntryDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon color="primary">edit</Icon>
            Add Data Entry
          </Box>
          <Typography variant="body2" color="text.secondary">{selectedKPI?.name}</Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="month"
            label="Month"
            value={newEntry.month}
            onChange={(e) => setNewEntry({ ...newEntry, month: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            fullWidth
            type="number"
            label={`Value (${selectedKPI?.unit})`}
            value={newEntry.value}
            onChange={(e) => setNewEntry({ ...newEntry, value: Number(e.target.value) })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            label="Target (optional)"
            value={newEntry.target}
            onChange={(e) => setNewEntry({ ...newEntry, target: Number(e.target.value) })}
            helperText={`Default: ${selectedKPI?.target}`}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Remarks (optional)"
            value={newEntry.remarks}
            onChange={(e) => setNewEntry({ ...newEntry, remarks: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEntryDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddEntry}>Save Entry</Button>
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

      {/* Upload KPI Document Dialog */}
      <Dialog
        open={isUploadDialogOpen}
        onClose={resetUploadWorkflow}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { minHeight: '70vh' } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon color="primary">upload_file</Icon>
            Upload & Extract KPI Data
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Stepper */}
          <Stepper activeStep={uploadWorkflowStep} sx={{ mb: 3, pt: 2 }}>
            {UPLOAD_WORKFLOW_STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step 0: Upload Document */}
          {uploadWorkflowStep === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 6,
                  border: '2px dashed',
                  borderColor: 'primary.main',
                  bgcolor: 'primary.50',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'primary.100' }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Icon sx={{ fontSize: 64, color: 'primary.main' }}>cloud_upload</Icon>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Click to Upload KPI Document
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supports PDF, Word, Excel, and Images
                </Typography>
              </Paper>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Upload your existing KPI reports, quality indicator sheets, or any document containing performance data.
              </Typography>
            </Box>
          )}

          {/* Step 1: Extracting */}
          {uploadWorkflowStep === 1 && isExtracting && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Extracting KPIs from {uploadedFile?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Analyzing document structure...
              </Typography>
              <LinearProgress sx={{ mt: 3, maxWidth: 400, mx: 'auto' }} />
            </Box>
          )}

          {/* Step 2: Review & Edit Extracted Data */}
          {uploadWorkflowStep === 2 && (
            <Box>
              <Tabs value={activeUploadTab} onChange={(_, v) => setActiveUploadTab(v)} sx={{ mb: 2 }}>
                <Tab label={`Extracted KPIs (${extractedKPIs.length})`} icon={<Icon>analytics</Icon>} iconPosition="start" />
                <Tab label="Raw Text" icon={<Icon>text_snippet</Icon>} iconPosition="start" />
              </Tabs>

              {activeUploadTab === 0 && (
                <Box>
                  {extractedKPIs.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 350 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>KPI Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell align="right">Target</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Formula</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {extractedKPIs.map((kpi, i) => (
                            <TableRow key={i}>
                              <TableCell>
                                <TextField
                                  size="small"
                                  variant="standard"
                                  value={kpi.name}
                                  onChange={(e) => {
                                    const updated = [...extractedKPIs];
                                    updated[i].name = e.target.value;
                                    setExtractedKPIs(updated);
                                  }}
                                  fullWidth
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  variant="standard"
                                  select
                                  slotProps={{ select: { native: true } }}
                                  value={kpi.category}
                                  onChange={(e) => {
                                    const updated = [...extractedKPIs];
                                    updated[i].category = e.target.value;
                                    setExtractedKPIs(updated);
                                  }}
                                >
                                  {KPI_CATEGORIES.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                  ))}
                                </TextField>
                              </TableCell>
                              <TableCell align="right">
                                <TextField
                                  size="small"
                                  variant="standard"
                                  type="number"
                                  value={kpi.target}
                                  onChange={(e) => {
                                    const updated = [...extractedKPIs];
                                    updated[i].target = Number(e.target.value);
                                    setExtractedKPIs(updated);
                                  }}
                                  sx={{ width: 70 }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  variant="standard"
                                  value={kpi.unit}
                                  onChange={(e) => {
                                    const updated = [...extractedKPIs];
                                    updated[i].unit = e.target.value;
                                    setExtractedKPIs(updated);
                                  }}
                                  sx={{ width: 80 }}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="caption">{kpi.formula || '-'}</Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
                      <Icon sx={{ fontSize: 48, color: 'text.secondary' }}>search_off</Icon>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        No KPIs could be extracted. You can still generate an improved report.
                      </Typography>
                    </Paper>
                  )}

                  <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: 'warning.50' }}>
                    <Typography variant="subtitle2" color="warning.dark" gutterBottom>
                      <Icon sx={{ verticalAlign: 'middle', mr: 1 }}>lightbulb</Icon>
                      Improvement Suggestions (Optional)
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Add any specific improvements (e.g., 'Add infection control KPIs', 'Include trend analysis')"
                      value={userSuggestions}
                      onChange={(e) => setUserSuggestions(e.target.value)}
                    />
                  </Paper>
                </Box>
              )}

              {activeUploadTab === 1 && (
                <Paper variant="outlined" sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
                  <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                    {extractedText}
                  </Typography>
                </Paper>
              )}
            </Box>
          )}

          {/* Step 3: Generated Report */}
          {uploadWorkflowStep === 3 && generatedReport && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
                <Button size="small" startIcon={<Icon>print</Icon>} onClick={handlePrintReport}>
                  Print
                </Button>
                <Button size="small" startIcon={<Icon>download</Icon>} onClick={handleDownloadReport}>
                  Download HTML
                </Button>
              </Box>
              <Paper
                variant="outlined"
                sx={{ maxHeight: 500, overflow: 'auto', bgcolor: 'white' }}
              >
                <div dangerouslySetInnerHTML={{ __html: generatedReport }} />
              </Paper>
            </Box>
          )}

          {/* Generating indicator */}
          {isGenerating && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Generating KPI Report
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Creating comprehensive KPI tracking document...
              </Typography>
              <LinearProgress sx={{ mt: 3, maxWidth: 400, mx: 'auto' }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={resetUploadWorkflow}>Cancel</Button>
          {uploadWorkflowStep === 2 && (
            <>
              <Button
                variant="outlined"
                startIcon={<Icon>add_chart</Icon>}
                onClick={handleImportExtractedKPIs}
                disabled={extractedKPIs.length === 0}
              >
                Import KPIs ({extractedKPIs.length})
              </Button>
              <Button
                variant="contained"
                startIcon={<Icon>auto_awesome</Icon>}
                onClick={handleGenerateKPIReport}
                disabled={isGenerating}
              >
                Generate KPI Report
              </Button>
            </>
          )}
          {uploadWorkflowStep === 3 && (
            <Button
              variant="contained"
              startIcon={<Icon>add_chart</Icon>}
              onClick={handleImportExtractedKPIs}
              disabled={extractedKPIs.length === 0}
            >
              Import KPIs & Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
