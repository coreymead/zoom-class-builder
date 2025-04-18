import { Link as RouterLink } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button,
  Box 
} from '@mui/material';
import { School } from '@mui/icons-material';

const Navbar = () => {
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar variant="dense" sx={{ px: 3, minHeight: 64 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <School />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 600,
              color: 'white',
              textDecoration: 'none',
            }}
          >
            Zoom Class Builder
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
          <Button 
            color="inherit"
            component={RouterLink}
            to="/"
            sx={{ fontWeight: 500 }}
          >
            COURSES
          </Button>
          <Button 
            color="inherit"
            component={RouterLink}
            to="/courses/new"
            variant="outlined"
            size="small"
            sx={{ 
              borderColor: 'rgba(255, 255, 255, 0.5)',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              }
            }}
          >
            NEW COURSE
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 