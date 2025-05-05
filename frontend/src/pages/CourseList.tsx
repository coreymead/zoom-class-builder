import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CourseService from '../services/CourseService';
import { Course } from '../types';
// Material UI imports
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Typography, Box, IconButton, Tooltip, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Menu, MenuItem, ListItemIcon, ListItemText, Checkbox
} from '@mui/material';
import { 
  Add, Edit, Delete, Visibility, VideoCall,
  Chat, VideocamOutlined, Dashboard,
  CheckCircle, ErrorOutline, HourglassEmpty,
  Settings, Link as LinkIcon
} from '@mui/icons-material';

const CourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'delete' | 'unlink'>('delete');
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [bulkMenuAnchor, setBulkMenuAnchor] = useState<null | HTMLElement>(null);

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
    setDialogType('delete');
    setCourseToDelete(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;
    
    try {
      const success = await CourseService.deleteCourse(courseToDelete);
      if (success) {
        setCourses(courses.filter(course => course.id !== courseToDelete));
        setSelectedCourses(selectedCourses.filter(id => id !== courseToDelete));
      }
    } catch (err) {
      setError('Failed to delete course');
    } finally {
      setDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  const handleConfirmUnlink = async () => {
    try {
      for (const courseId of selectedCourses) {
        const course = courses.find(c => c.id === courseId);
        if (course && course.zoomResources) {
          await CourseService.unlinkZoomResources(courseId);
        }
      }
      // Refresh courses to show updated state
      const updatedCourses = await CourseService.getAllCourses();
      setCourses(updatedCourses);
      setSelectedCourses([]);
    } catch (err) {
      setError('Failed to unlink resources');
    } finally {
      setDialogOpen(false);
    }
  };

  const handleBulkMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setBulkMenuAnchor(event.currentTarget);
  };

  const handleBulkMenuClose = () => {
    setBulkMenuAnchor(null);
  };

  const handleBulkAction = async (action: 'create' | 'unlink') => {
    handleBulkMenuClose();
    if (action === 'create') {
      navigate('/courses/bulk-zoom-setup', { state: { courseIds: selectedCourses } });
    } else {
      setDialogType('unlink');
      setDialogOpen(true);
    }
  };

  const handleResourceClick = (courseId: string, resourceType: 'whiteboard' | 'chat' | 'meeting') => {
    navigate(`/courses/${courseId}/zoom-resources/${resourceType}`);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedCourses(courses.map(c => c.id));
    } else {
      setSelectedCourses([]);
    }
  };

  const handleSelectCourse = (courseId: string, checked: boolean) => {
    if (checked) {
      setSelectedCourses([...selectedCourses, courseId]);
    } else {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    }
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
        <Box sx={{ display: 'flex', gap: 2 }}>
          {selectedCourses.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<Settings />}
              onClick={handleBulkMenuOpen}
            >
              Bulk Actions ({selectedCourses.length})
            </Button>
          )}
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
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedCourses.length === courses.length}
                  indeterminate={selectedCourses.length > 0 && selectedCourses.length < courses.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Participants</TableCell>
              <TableCell align="center">Zoom Resources</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCourses.includes(course.id)}
                    onChange={(e) => handleSelectCourse(course.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell>
                  <Typography
                    component={Link}
                    to={`/courses/${course.id}`}
                    sx={{
                      color: 'inherit',
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.main'
                      }
                    }}
                  >
                    {course.name}
                  </Typography>
                </TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell align="center">{course.users.length}</TableCell>
                <TableCell align="center">
                  {course.zoomResources ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                      <Tooltip title={`Whiteboard: ${course.zoomResources.whiteboard || 'not created'}`}>
                        <Box>
                          <IconButton 
                            size="small" 
                            onClick={() => handleResourceClick(course.id, 'whiteboard')}
                            disabled={!course.zoomResources.whiteboard || course.zoomResources.whiteboard !== 'created'}
                          >
                            <Dashboard sx={{ 
                              color: course.zoomResources.whiteboard === 'created' ? 'success.main' : 
                                     course.zoomResources.whiteboard === 'pending' ? 'warning.main' : 'error.main'
                            }} />
                          </IconButton>
                        </Box>
                      </Tooltip>
                      <Tooltip title={`Chat: ${course.zoomResources.chat || 'not created'}`}>
                        <Box>
                          <IconButton 
                            size="small"
                            onClick={() => handleResourceClick(course.id, 'chat')}
                            disabled={!course.zoomResources.chat || course.zoomResources.chat !== 'created'}
                          >
                            <Chat sx={{ 
                              color: course.zoomResources.chat === 'created' ? 'success.main' : 
                                     course.zoomResources.chat === 'pending' ? 'warning.main' : 'error.main'
                            }} />
                          </IconButton>
                        </Box>
                      </Tooltip>
                      <Tooltip title={`Meeting: ${course.zoomResources.meeting || 'not created'}`}>
                        <Box>
                          <IconButton 
                            size="small"
                            onClick={() => handleResourceClick(course.id, 'meeting')}
                            disabled={!course.zoomResources.meeting || course.zoomResources.meeting !== 'created'}
                          >
                            <VideocamOutlined sx={{ 
                              color: course.zoomResources.meeting === 'created' ? 'success.main' : 
                                     course.zoomResources.meeting === 'pending' ? 'warning.main' : 'error.main'
                            }} />
                          </IconButton>
                        </Box>
                      </Tooltip>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                      <Tooltip title="Create New Resources">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/courses/${course.id}/zoom-setup`)}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Link Existing Resources">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/courses/${course.id}/zoom-resources/link`)}
                        >
                          <LinkIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(course.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={bulkMenuAnchor}
        open={Boolean(bulkMenuAnchor)}
        onClose={handleBulkMenuClose}
      >
        <MenuItem onClick={() => handleBulkAction('create')}>
          <ListItemIcon>
            <Add fontSize="small" />
          </ListItemIcon>
          <ListItemText>Create Zoom Resources</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('unlink')}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Unlink Zoom Resources</ListItemText>
        </MenuItem>
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {dialogType === 'delete' ? 'Confirm Deletion' : 'Confirm Unlink Resources'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogType === 'delete' 
              ? 'Are you sure you want to delete this course? This action cannot be undone.'
              : `Are you sure you want to unlink Zoom resources from ${selectedCourses.length} selected courses? This action cannot be undone.`
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={dialogType === 'delete' ? handleConfirmDelete : handleConfirmUnlink} 
            color="error" 
            autoFocus
          >
            {dialogType === 'delete' ? 'Delete' : 'Unlink'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseList; 