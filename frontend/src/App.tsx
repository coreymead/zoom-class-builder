import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline, Box, Container } from '@mui/material'
import Navbar from './components/Navbar'
import CourseList from './pages/CourseList'
import CourseDetails from './pages/CourseDetails'
import CourseForm from './pages/CourseForm'

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          width: '100%',
          maxWidth: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        width: '100vw',
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}>
        <Navbar />
        <Container maxWidth={false} sx={{ 
          flexGrow: 1,
          py: 3,
          px: { xs: 2, sm: 3 },
          overflowX: 'hidden'
        }}>
          <Routes>
            <Route path="/" element={<CourseList />} />
            <Route path="/courses/new" element={<CourseForm />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/courses/:id/edit" element={<CourseForm />} />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App 