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
import { useNABHStore } from '../store/nabhStore';
import type { Status, Priority, ElementCategory } from '../types/nabh';

interface ObjectiveDetailProps {
  open: boolean;
  onClose: () => void;
  chapterId: string;
  objectiveId: string | null;
}

export default function ObjectiveDetail({
  open,
  onClose,
  chapterId,
  objectiveId,
}: ObjectiveDetailProps) {
  const { chapters, updateObjective } = useNABHStore();

  const chapter = chapters.find((c) => c.id === chapterId);
  const objective = chapter?.objectives.find((o) => o.id === objectiveId);

  if (!objective) return null;

  const handleFieldChange = (field: string, value: string) => {
    updateObjective(chapterId, objective.id, { [field]: value });
  };

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
            rows={3}
            size="small"
          />

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
              <TextField
                fullWidth
                size="small"
                label="Assignee"
                value={objective.assignee}
                onChange={(e) => handleFieldChange('assignee', e.target.value)}
              />
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
            rows={3}
            size="small"
            placeholder="List the required evidences for this objective element..."
          />

          {/* Evidence Links */}
          <TextField
            fullWidth
            label="Evidence Links (comma-separated)"
            value={objective.evidenceLinks}
            onChange={(e) => handleFieldChange('evidenceLinks', e.target.value)}
            multiline
            rows={2}
            size="small"
            placeholder="file1.pdf, file2.docx, folder/file3.xlsx"
            helperText="Enter file names or links separated by commas"
          />

          {/* Deliverable */}
          <TextField
            fullWidth
            label="Deliverable"
            value={objective.deliverable}
            onChange={(e) => handleFieldChange('deliverable', e.target.value)}
            multiline
            rows={2}
            size="small"
            placeholder="What is the expected deliverable for this objective..."
          />

          <Divider />

          {/* Notes */}
          <TextField
            fullWidth
            label="Notes"
            value={objective.notes}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            multiline
            rows={3}
            placeholder="Add notes, comments, or additional information..."
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
