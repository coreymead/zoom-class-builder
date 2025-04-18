import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CourseService from '../services/CourseService';
import { Course } from '../types';
// Material UI imports
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Typography, Box, IconButton, Tooltip, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';

const CourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await CourseService.getAllCourses();
        setCourses(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDeleteClick = (id: string) => {
    setCourseToDelete(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;
    
    try {
      const success = await CourseService.deleteCourse(courseToDelete);
      if (success) {
        setCourses(courses.filter(course => course.id !== courseToDelete));
      }
    } catch (err) {
      setError('Failed to delete course');
    } finally {
      setDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDialogOpen(false);
    setCourseToDelete(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            fontSize: '2rem',
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          Courses
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          component={Link} 
          to="/courses/new"
          sx={{
            textTransform: 'uppercase',
            fontWeight: 500,
            px: 2
          }}
        >
          Add New Course
        </Button>
      </Box>

      {courses.length === 0 ? (
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            backgroundColor: 'background.default',
            border: '1px dashed',
            borderColor: 'divider'
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No courses found. Create your first course to get started.
          </Typography>
        </Paper>
      ) : (
        <TableContainer 
          component={Paper} 
          elevation={0}
          sx={{ 
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Table sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell 
                  width="35%"
                  sx={{ 
                    py: 1.5,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'text.secondary',
                    borderBottom: '2px solid',
                    borderBottomColor: 'divider'
                  }}
                >
                  Name
                </TableCell>
                <TableCell 
                  width="45%"
                  sx={{ 
                    py: 1.5,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'text.secondary',
                    borderBottom: '2px solid',
                    borderBottomColor: 'divider'
                  }}
                >
                  Description
                </TableCell>
                <TableCell 
                  width="10%"
                  align="center"
                  sx={{ 
                    py: 1.5,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'text.secondary',
                    borderBottom: '2px solid',
                    borderBottomColor: 'divider'
                  }}
                >
                  Participants
                </TableCell>
                <TableCell 
                  width="10%"
                  align="right"
                  sx={{ 
                    py: 1.5,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'text.secondary',
                    borderBottom: '2px solid',
                    borderBottomColor: 'divider',
                    pr: 3
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow 
                  key={course.id} 
                  hover
                  sx={{
                    '&:last-child td': { border: 0 }
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Typography
                      component={Link}
                      to={`/courses/${course.id}`}
                      sx={{
                        color: 'inherit',
                        textDecoration: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          color: 'primary.main'
                        }
                      }}
                    >
                      {course.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2, color: 'text.secondary' }}>
                    {course.description || 'No description'}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2 }}>
                    {course.users.length}
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1.5, pr: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      <Tooltip title="View details">
                        <IconButton 
                          size="small"
                          color="primary" 
                          onClick={() => navigate(`/courses/${course.id}`)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete course">
                        <IconButton 
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(course.id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this course? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseList; 