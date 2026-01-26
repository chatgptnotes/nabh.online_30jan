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
import Paper from '@mui/material/Paper';
import { useNABHStore } from '../store/nabhStore';
import type { Status, Priority } from '../types/nabh';

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

  const handleStatusChange = (status: Status) => {
    updateObjective(chapterId, objective.id, { status });
  };

  const handlePriorityChange = (priority: Priority) => {
    updateObjective(chapterId, objective.id, { priority });
  };

  const handleAssigneeChange = (assignee: string) => {
    updateObjective(chapterId, objective.id, { assignee });
  };

  const handleNotesChange = (notes: string) => {
    updateObjective(chapterId, objective.id, { notes });
  };

  const evidenceFiles = objective.evidenceLinks
    .split(',')
    .map((f) => f.trim())
    .filter((f) => f.length > 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon color="primary">description</Icon>
            <Typography variant="h6" fontWeight={600}>
              {objective.code}
            </Typography>
            {objective.priority && (
              <Chip
                label={objective.priority}
                size="small"
                color={objective.priority === 'CORE' ? 'error' : objective.priority === 'Prev NC' ? 'warning' : 'default'}
              />
            )}
          </Box>
          <IconButton onClick={onClose}>
            <Icon>close</Icon>
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {objective.title && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Objective Element Title
              </Typography>
              <Typography variant="body1">{objective.title}</Typography>
            </Box>
          )}

          <Divider />

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={objective.status || ''}
                label="Status"
                onChange={(e) => handleStatusChange(e.target.value as Status)}
              >
                <MenuItem value="">Not Set</MenuItem>
                <MenuItem value="Not started">Not Started</MenuItem>
                <MenuItem value="In progress">In Progress</MenuItem>
                <MenuItem value="Blocked">Blocked</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={objective.priority || ''}
                label="Priority"
                onChange={(e) => handlePriorityChange(e.target.value as Priority)}
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

            <TextField
              size="small"
              label="Assignee"
              value={objective.assignee}
              onChange={(e) => handleAssigneeChange(e.target.value)}
              sx={{ minWidth: 150 }}
            />
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Evidence List
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body2">
                {objective.evidencesList || 'No evidence list specified'}
              </Typography>
            </Paper>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Evidence Files ({evidenceFiles.length})
            </Typography>
            {evidenceFiles.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {evidenceFiles.map((file, index) => (
                  <Chip
                    key={index}
                    icon={<Icon>attach_file</Icon>}
                    label={file}
                    variant="outlined"
                    onClick={() => {}}
                    sx={{ maxWidth: 250 }}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No evidence files uploaded
              </Typography>
            )}
          </Box>

          <Box>
            <Button
              variant="outlined"
              startIcon={<Icon>cloud_upload</Icon>}
              sx={{ mb: 2 }}
            >
              Upload Evidence Files
            </Button>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Notes
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Add notes about this objective element..."
              value={objective.notes}
              onChange={(e) => handleNotesChange(e.target.value)}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" startIcon={<Icon>save</Icon>}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
