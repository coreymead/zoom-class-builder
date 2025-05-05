import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseService from '../services/CourseService';
import { Course, User, UserRole } from '../types';
import { ResourceType } from '../components/ZoomResourceSetup';
import { 
  Typography, Box, Button, Paper, TextField, Select, MenuItem,
  FormControl, InputLabel, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, CircularProgress, Alert, Divider,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Grid, Tooltip
} from '@mui/material';
import { ArrowBack, Delete, Edit, Visibility, Chat, VideoCall, Dashboard } from '@mui/icons-material';
import { format } from 'date-fns';
import ZoomResourceManager from '../components/ZoomResourceManager';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ name: '', role: 'student' as UserRole });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) {
        setError('Course ID is required');
        setLoading(false);
        return;
      }

      try {
        const data = await CourseService.getCourseById(id);
        console.debug('Fetched course details:', data);
        setCourse(data);
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleDeleteCourse = async () => {
    if (!course) {
      console.error('Attempted to delete course but no course is loaded');
      return;
    }
    
    try {
      const success = await CourseService.deleteCourse(course.id);
      if (success) {
        navigate('/');
      } else {
        console.error('Delete course returned false');
        setError('Failed to delete course');
      }
    } catch (err) {
      console.error('Error deleting course:', err);
      setError('Failed to delete course');
    }
  };

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!course || !newUser.name) {
      console.error('Invalid state for adding user:', { course, newUser });
      return;
    }
    
    try {
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        role: newUser.role
      };
      
      const updatedCourse = await CourseService.addUserToCourse(course.id, user);
      if (updatedCourse) {
        console.debug('Successfully added user to course:', { user, courseId: course.id });
        setCourse(updatedCourse);
        setNewUser({ name: '', role: 'student' as UserRole });
      }
    } catch (err) {
      console.error('Error adding user to course:', err);
      setError('Failed to add user');
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!course) {
      console.error('Attempted to remove user but no course is loaded');
      return;
    }
    
    try {
      const updatedCourse = await CourseService.removeUserFromCourse(course.id, userId);
      if (updatedCourse) {
        console.debug('Successfully removed user from course:', { userId, courseId: course.id });
        setCourse(updatedCourse);
      }
    } catch (err) {
      console.error('Error removing user from course:', err);
      setError('Failed to remove user');
    }
  };

  const handleUpdateUserRole = async (userId: string, role: UserRole) => {
    if (!course) {
      console.error('Attempted to update user role but no course is loaded');
      return;
    }
    
    try {
      const updatedCourse = await CourseService.updateUserRole(course.id, userId, role);
      if (updatedCourse) {
        console.debug('Successfully updated user role:', { userId, role, courseId: course.id });
        setCourse(updatedCourse);
      }
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role');
    }
  };

  const handleDeleteClick = () => {
    setDialogOpen(true);
  };

  const handleResourceClick = (resourceType: ResourceType) => {
    if (!course?.zoomResources?.[resourceType]?.resourceId) {
      console.debug('Resource not initialized:', resourceType);
      return;
    }
    console.debug('Opening resource:', resourceType, course.zoomResources[resourceType].resourceId);
    // TODO: Implement actual resource opening logic
  };

  const handleViewResource = (resourceType: ResourceType) => {
    if (!course?.zoomResources?.[resourceType]?.resourceId) {
      console.debug('No resource to view:', resourceType);
      return;
    }
    console.debug('Viewing resource:', resourceType, course.zoomResources[resourceType].resourceId);
    // TODO: Implement actual resource viewing logic
  };

  const handleDeleteResource = (resourceType: ResourceType) => {
    if (!course?.zoomResources?.[resourceType]?.resourceId) {
      console.debug('No resource to delete:', resourceType);
      return;
    }
    console.debug('Deleting resource:', resourceType, course.zoomResources[resourceType].resourceId);
    // TODO: Implement actual resource deletion logic
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

  if (!course) {
    return <Alert severity="error">Course not found</Alert>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          {course.name}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            onClick={() => navigate('/courses')}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate(`/courses/${id}/edit`)}
          >
            Edit Course
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Course Details
            </Typography>
            <Typography variant="body1" paragraph>
              {course.description}
            </Typography>
            <Box display="flex" gap={4}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Start Date
                </Typography>
                <Typography>
                  {format(new Date(course.startDate), 'PPP')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  End Date
                </Typography>
                <Typography>
                  {format(new Date(course.endDate), 'PPP')}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Zoom Resources
            </Typography>
            {course.zoomResources ? (
              <Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Resource Status:
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {Object.entries(course.zoomResources).map(([type, resource]) => (
                    <Box key={type} sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mb: 1,
                      p: 1,
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title={`${type.charAt(0).toUpperCase() + type.slice(1)} Resource`}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleResourceClick(type as ResourceType)}
                            disabled={!resource.resourceId || resource.status !== 'created'}
                            color={resource.status === 'created' ? 'primary' : 'default'}
                          >
                            {type === 'whiteboard' && <Dashboard />}
                            {type === 'chat' && <Chat />}
                            {type === 'meeting' && <VideoCall />}
                          </IconButton>
                        </Tooltip>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {type}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color={
                          resource.status === 'created' ? 'success.main' :
                          resource.status === 'error' ? 'error.main' :
                          resource.status === 'pending' ? 'warning.main' : 'text.secondary'
                        }>
                          {resource.status || 'Not initialized'}
                        </Typography>
                        {resource.resourceId && (
                          <>
                            <Tooltip title="View Resource">
                              <IconButton 
                                size="small"
                                onClick={() => handleViewResource(type as ResourceType)}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Resource">
                              <IconButton 
                                size="small"
                                color="error"
                                onClick={() => handleDeleteResource(type as ResourceType)}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(`/courses/${id}/zoom-setup`)}
                >
                  Manage Zoom Resources
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  No Zoom resources have been initialized for this course.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(`/courses/${id}/zoom-setup`)}
                >
                  Initialize Zoom Resources
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ 
        border: '1px solid',
        borderColor: 'divider',
        p: 3,
        mb: 3
      }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Participants ({course.users.length})
        </Typography>

        <Box component="form" onSubmit={handleAddUser} sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="User Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth size="small">
                <InputLabel>Role</InputLabel>
                <Select
                  value={newUser.role}
                  label="Role"
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="teacher">Teacher</MenuItem>
                  <MenuItem value="TA">TA</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth
              >
                Add User
              </Button>
            </Grid>
          </Grid>
        </Box>

        {course.users.length === 0 ? (
          <Alert severity="info">
            No users in this course. Add users using the form above.
          </Alert>
        ) : (
          <TableContainer>
            <Table sx={{ tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  <TableCell width="40%">Name</TableCell>
                  <TableCell width="40%">Role</TableCell>
                  <TableCell width="20%" align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {course.users.map(user => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={user.role}
                          onChange={(e) => handleUpdateUserRole(user.id, e.target.value as UserRole)}
                        >
                          <MenuItem value="student">Student</MenuItem>
                          <MenuItem value="teacher">Teacher</MenuItem>
                          <MenuItem value="TA">TA</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small"
                        color="error" 
                        onClick={() => handleRemoveUser(user.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={handleDeleteClick}
        >
          Delete Course
        </Button>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{course.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteCourse} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseDetails;