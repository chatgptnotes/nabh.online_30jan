import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Icon from '@mui/material/Icon';
import { useNABHStore } from '../store/nabhStore';
import { getChapterStats } from '../data/nabhData';

const drawerWidth = 280;

const chapterIcons: Record<string, string> = {
  AAC: 'accessible',
  COP: 'medical_services',
  MOM: 'medication',
  PRE: 'person',
  HIC: 'sanitizer',
  CQI: 'verified',
  PSQ: 'verified',
  ROM: 'business',
  FMS: 'apartment',
  HRM: 'groups',
  IMS: 'storage',
};

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { chapters, selectedChapter, setSelectedChapter } = useNABHStore();

  const handleChapterClick = (chapterId: string) => {
    setSelectedChapter(chapterId);
    onClose();
  };

  const drawerContent = (
    <Box>
      <Toolbar />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          CHAPTERS
        </Typography>
      </Box>
      <List>
        {chapters.map((chapter) => {
          const stats = getChapterStats(chapter);
          const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

          return (
            <ListItem key={chapter.id} disablePadding>
              <ListItemButton
                selected={selectedChapter === chapter.id}
                onClick={() => handleChapterClick(chapter.id)}
                sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1.5 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon color={selectedChapter === chapter.id ? 'primary' : 'inherit'}>
                      {chapterIcons[chapter.code] || 'folder'}
                    </Icon>
                  </ListItemIcon>
                  <ListItemText
                    primary={chapter.code}
                    secondary={chapter.fullName}
                    primaryTypographyProps={{ fontWeight: 600 }}
                    secondaryTypographyProps={{ variant: 'caption', noWrap: true }}
                  />
                </Box>
                <Box sx={{ width: '100%', px: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {stats.completed}/{stats.total} completed
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Math.round(progress)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ height: 4, borderRadius: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                    {stats.core > 0 && (
                      <Chip label={`${stats.core} Core`} size="small" color="error" sx={{ height: 18, fontSize: 10 }} />
                    )}
                    {stats.prevNC > 0 && (
                      <Chip label={`${stats.prevNC} Prev NC`} size="small" color="warning" sx={{ height: 18, fontSize: 10 }} />
                    )}
                  </Box>
                </Box>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
