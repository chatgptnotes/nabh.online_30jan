import { useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import { useNABHStore } from '../store/nabhStore';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSelectedChapter } = useNABHStore();
  const isAIPage = location.pathname === '/ai-generator';

  const handleHomeClick = () => {
    setSelectedChapter(null);
    navigate('/');
  };

  const handleAIClick = () => {
    navigate('/ai-generator');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <Icon>menu</Icon>
        </IconButton>
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={handleHomeClick}
        >
          <Icon sx={{ mr: 2 }}>local_hospital</Icon>
          <Typography variant="h6" noWrap component="div">
            NABH Evidence Creator
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Dashboard">
            <Button
              color="inherit"
              startIcon={<Icon>dashboard</Icon>}
              onClick={handleHomeClick}
              sx={{
                bgcolor: !isAIPage ? 'rgba(255,255,255,0.15)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
              }}
            >
              Dashboard
            </Button>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)', mx: 1 }} />
          <Tooltip title="AI Evidence Generator">
            <Button
              color="inherit"
              startIcon={<Icon>auto_awesome</Icon>}
              onClick={handleAIClick}
              sx={{
                bgcolor: isAIPage ? 'rgba(255,255,255,0.15)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
              }}
            >
              AI Generator
            </Button>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)', mx: 1 }} />
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            SHCO 3rd Edition
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
