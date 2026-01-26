import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
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
        <Icon sx={{ mr: 2 }}>local_hospital</Icon>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          NABH Evidence Creator
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            SHCO 3rd Edition
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
