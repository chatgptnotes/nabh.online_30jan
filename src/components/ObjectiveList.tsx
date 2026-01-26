import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';
import { useNABHStore } from '../store/nabhStore';
import type { Status } from '../types/nabh';
import ObjectiveDetail from './ObjectiveDetail';

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  Completed: 'success',
  'In progress': 'warning',
  Blocked: 'error',
  'Not started': 'default',
  '': 'default',
};

const priorityColors: Record<string, 'default' | 'error' | 'warning' | 'info'> = {
  CORE: 'error',
  'Prev NC': 'warning',
  P0: 'info',
  P1: 'info',
  P2: 'default',
  P3: 'default',
  '': 'default',
};

export default function ObjectiveList() {
  const {
    chapters,
    selectedChapter,
    searchQuery,
    filterStatus,
    filterPriority,
    setSearchQuery,
    setFilterStatus,
    setFilterPriority,
    getFilteredObjectives,
    setSelectedObjective,
  } = useNABHStore();

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedObj, setSelectedObj] = useState<string | null>(null);

  const chapter = chapters.find((c) => c.id === selectedChapter);
  if (!chapter) return null;

  const objectives = getFilteredObjectives(chapter.id);

  const handleViewDetail = (objectiveId: string) => {
    setSelectedObj(objectiveId);
    setSelectedObjective(objectiveId);
    setDetailOpen(true);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
        {chapter.code} - {chapter.fullName}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {chapter.objectives.length} objective elements
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search objectives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>search</Icon>
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value as Status | 'all')}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="In progress">In Progress</MenuItem>
              <MenuItem value="Blocked">Blocked</MenuItem>
              <MenuItem value="Not started">Not Started</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={filterPriority}
              label="Priority"
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <MenuItem value="all">All Priority</MenuItem>
              <MenuItem value="CORE">CORE</MenuItem>
              <MenuItem value="Prev NC">Previous NC</MenuItem>
              <MenuItem value="P0">P0</MenuItem>
              <MenuItem value="P1">P1</MenuItem>
              <MenuItem value="P2">P2</MenuItem>
              <MenuItem value="P3">P3</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Title / Evidence</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Assignee</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {objectives.map((obj) => (
              <TableRow
                key={obj.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => handleViewDetail(obj.id)}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {obj.code}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                    {obj.title || obj.evidencesList || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {obj.priority && (
                    <Chip
                      label={obj.priority}
                      size="small"
                      color={priorityColors[obj.priority]}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{obj.assignee || '-'}</Typography>
                </TableCell>
                <TableCell>
                  {obj.status && (
                    <Chip
                      label={obj.status}
                      size="small"
                      color={statusColors[obj.status]}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetail(obj.id);
                      }}
                    >
                      <Icon>visibility</Icon>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Upload Evidence">
                    <IconButton size="small">
                      <Icon>upload_file</Icon>
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {objectives.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Icon sx={{ fontSize: 64, color: 'text.disabled' }}>search_off</Icon>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            No objectives found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Box>
      )}

      <ObjectiveDetail
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        chapterId={chapter.id}
        objectiveId={selectedObj}
      />
    </Box>
  );
}
