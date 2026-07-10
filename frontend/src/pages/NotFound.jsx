import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
// 1. Import your custom styles from your styles.js file
// import { notFoundStyles } from './styles'; 

const NotFound = () => {
  return (
    <Box
      // 2. Center everything perfectly on the screen using Flexbox
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', 
        textAlign: 'center',
        padding: 3,
      }}
    >
      {/* Large, centered 404 text */}
      <Typography 
        variant="h1" 
        component="h1" 
        sx={{ fontWeight: 'bold', mb: 2, color: 'text.main' }}
      >
        404
      </Typography>

      {/* Page Not Found text */}
      <Typography 
        variant="h4" 
        component="h2" 
        sx={{ mb: 2, color: 'text.secondary' }}
      >
        Page Not Found
      </Typography>

      <Typography 
        variant="body1" 
        sx={{ mb: 4, color: 'text.secondary' }}
      >
        The page you are looking for does not exist or has been moved.
      </Typography>

      <Button
        component={Link}
        to="/home"
        variant="contained"
        color="button"
        size="large"
        sx={{ textTransform: 'none' }}
      >
        Go Back Home
      </Button>
    </Box>
  );
};

export default NotFound;