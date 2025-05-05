import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Checkbox,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit as EditIcon,
  Dashboard,
  Chat,
  VideocamOutlined,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Course } from '../types';
import CourseService from '../services/CourseService';

const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'delete' | 'unlink'>('delete');
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [bulkMenuAnchor, setBulkMenuAnchor] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await CourseService.getAllCourses();
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (courseId: string) => {
    if (!courseId) {
      console.error('Attempted to delete course with invalid ID:', courseId);
      return;
    }
    setCourseToDelete(courseId);
    setDialogType('delete');
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete) {
      console.error('Attempted to confirm delete with no course selected');
      return;
    }
    
    try {
      const success = await CourseService.deleteCourse(courseToDelete);
      if (success) {
        setCourses(courses.filter(course => course.id !== courseToDelete));
        setSelectedCourses(selectedCourses.filter(id => id !== courseToDelete));
      } else {
        console.error('Delete operation returned false for course:', courseToDelete);
        setError('Failed to delete course');
      }
    } catch (err) {
      console.error('Error deleting course:', {
        courseId: courseToDelete,
        error: err
      });
      setError('Failed to delete course');
    } finally {
      setDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  const handleConfirmUnlink = async () => {
    if (!selectedCourses.length) {
      console.error('Attempted to unlink resources with no courses selected');
      return;
    }

    try {
      for (const courseId of selectedCourses) {
        const course = courses.find(c => c.id === courseId);
        if (!course) {
          console.error('Course not found in state:', courseId);
          continue;
        }
        
        if (!course.zoomResources) {
          console.warn('Course has no Zoom resources to unlink:', courseId);
          continue;
        }

        try {
          await CourseService.unlinkZoomResources(courseId);
        } catch (err) {
          console.error('Error unlinking resources for course:', {
            courseId,
            error: err
          });
          throw err; // Re-throw to trigger the outer catch block
        }
      }
      
      // Refresh courses to show updated state
      const updatedCourses = await CourseService.getAllCourses();
      setCourses(updatedCourses);
      setSelectedCourses([]);
    } catch (err) {
      console.error('Error in bulk unlink operation:', err);
      setError('Failed to unlink resources');
    } finally {
      setDialogOpen(false);
    }
  };

  const handleBulkMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (!selectedCourses.length) {
      console.warn('Attempted to open bulk menu with no courses selected');
      return;
    }
    setBulkMenuAnchor(event.currentTarget);
  };

  const handleBulkMenuClose = () => {
    setBulkMenuAnchor(null);
  };

  const handleBulkAction = async (action: 'create' | 'unlink') => {
    handleBulkMenuClose();
    if (!selectedCourses.length) {
      console.error('Attempted bulk action with no courses selected');
      return;
    }

    if (action === 'create') {
      navigate('/courses/bulk-zoom-setup', { state: { courseIds: selectedCourses } });
    } else {
      setDialogType('unlink');
      setDialogOpen(true);
    }
  };

  const handleResourceClick = (courseId: string, resourceType: 'whiteboard' | 'chat' | 'meeting') => {
    if (!courseId) {
      console.error('Attempted to handle resource click with invalid course ID:', courseId);
      return;
    }
    
    try {
      navigate(`/courses/${courseId}/zoom-resources/${resourceType}`);
    } catch (err) {
      console.error('Error navigating to resource page:', {
        courseId,
        resourceType,
        error: err
      });
    }
  };

  const getResourceIcon = (resourceType: 'whiteboard' | 'chat' | 'meeting') => {
    switch (resourceType) {
      case 'whiteboard':
        return <Dashboard fontSize="small" />;
      case 'chat':
        return <Chat fontSize="small" />;
      case 'meeting':
        return <VideocamOutlined fontSize="small" />;
    }
  };

  const getResourceTooltip = (course: Course, resourceType: 'whiteboard' | 'chat' | 'meeting') => {
    const resource = course.zoomResources?.[resourceType];
    if (!resource) return 'Not initialized';
    
    const status = resource.status || 'Not initialized';
    const id = resource.resourceId ? `\nResource ID: ${resource.resourceId}` : '';
    return `${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}: ${status}${id}`;
  };

  const getIconColor = (course: Course, resourceType: 'whiteboard' | 'chat' | 'meeting') => {
    const resource = course.zoomResources?.[resourceType];
    if (!resource) return 'text.disabled';
    
    switch (resource.status) {
      case 'created':
        return 'success.main';
      case 'pending':
        return 'warning.main';
      case 'error':
        return 'error.main';
      default:
        return 'text.disabled';
    }
  };

  // Add debug logging for initial render
  useEffect(() => {
    if (courses.length > 0) {
      console.debug('Courses loaded:', courses.length);
      courses.forEach(course => {
        if (course.zoomResources) {
          console.debug('Course zoom resources:', {
            courseId: course.id,
            resources: course.zoomResources
          });
        }
      });
    }
  }, [courses]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedCourses(courses.map(c => c.id));
    } else {
      setSelectedCourses([]);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Courses</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => navigate('/courses/new')}
        >
          Add New Course
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedCourses.length > 0 && selectedCourses.length < courses.length}
                  checked={selectedCourses.length === courses.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Participants</TableCell>
              <TableCell align="center">Zoom Resources</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCourses.includes(course.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCourses([...selectedCourses, course.id]);
                      } else {
                        setSelectedCourses(selectedCourses.filter(id => id !== course.id));
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell align="center">{course.users.length}</TableCell>
                <TableCell align="center">
                  {course.zoomResources ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                      {(['whiteboard', 'chat', 'meeting'] as const).map(resourceType => (
                        <Tooltip key={resourceType} title={getResourceTooltip(course, resourceType)}>
                          <span>
                            <IconButton 
                              size="small" 
                              onClick={() => handleResourceClick(course.id, resourceType)}
                              disabled={!course.zoomResources?.[resourceType]?.resourceId || 
                                       course.zoomResources[resourceType].status !== 'created'}
                              sx={{
                                '& .MuiSvgIcon-root': {
                                  color: getIconColor(course, resourceType)
                                }
                              }}
                            >
                              {getResourceIcon(resourceType)}
                            </IconButton>
                          </span>
                        </Tooltip>
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                      <Tooltip title="Create New Resources">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/courses/${course.id}/zoom-setup`)}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Link Existing Resources">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/courses/${course.id}/zoom-resources/link`)}
                        >
                          <LinkIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Tooltip title="Edit Course">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/courses/${course.id}/edit`)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Course">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(course.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedCourses.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleBulkMenuOpen}
          >
            Bulk Actions
          </Button>
          <Menu
            anchorEl={bulkMenuAnchor}
            open={Boolean(bulkMenuAnchor)}
            onClose={handleBulkMenuClose}
          >
            <MenuItem onClick={() => handleBulkAction('create')}>
              Create Zoom Resources
            </MenuItem>
            <MenuItem onClick={() => handleBulkAction('unlink')}>
              Unlink Zoom Resources
            </MenuItem>
          </Menu>
        </Box>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>
          {dialogType === 'delete' ? 'Delete Course' : 'Unlink Zoom Resources'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogType === 'delete'
              ? 'Are you sure you want to delete this course? This action cannot be undone.'
              : 'Are you sure you want to unlink Zoom resources from the selected courses? This action cannot be undone.'}
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