import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseService from '../services/CourseService';
import { Course, User, UserRole } from '../types';
import { 
  Typography, Box, Button, Paper, TextField, Select, MenuItem,
  FormControl, InputLabel, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, CircularProgress, Alert, Divider,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Grid
} from '@mui/material';
import { ArrowBack, Delete, Edit } from '@mui/icons-material';

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ name: '', role: 'student' as UserRole });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      
      try {
        const data = await CourseService.getCourseById(id);
        if (data) {
          setCourse(data);
        } else {
          setError('Course not found');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load course details');
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleDeleteCourse = async () => {
    if (!course) return;
    
    try {
      const success = await CourseService.deleteCourse(course.id);
      if (success) {
        navigate('/');
      }
    } catch (err) {
      setError('Failed to delete course');
    }
  };

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!course || !newUser.name) return;
    
    try {
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        role: newUser.role
      };
      
      const updatedCourse = await CourseService.addUserToCourse(course.id, user);
      if (updatedCourse) {
        setCourse(updatedCourse);
        setNewUser({ name: '', role: 'student' as UserRole });
      }
    } catch (err) {
      setError('Failed to add user');
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!course) return;
    
    try {
      const updatedCourse = await CourseService.removeUserFromCourse(course.id, userId);
      if (updatedCourse) {
        setCourse(updatedCourse);
      }
    } catch (err) {
      setError('Failed to remove user');
    }
  };

  const handleUpdateUserRole = async (userId: string, role: UserRole) => {
    if (!course) return;
    
    try {
      const updatedCourse = await CourseService.updateUserRole(course.id, userId, role);
      if (updatedCourse) {
        setCourse(updatedCourse);
      }
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  const handleDeleteClick = () => {
    setDialogOpen(true);
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
      <Paper elevation={0} sx={{ 
        border: '1px solid',
        borderColor: 'divider',
        p: 3,
        mb: 3
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography 
            variant="h4"
            sx={{ 
              fontSize: '2rem',
              fontWeight: 600
            }}
          >
            {course.name}
          </Typography>
          <Box>
            <Button 
              variant="outlined" 
              startIcon={<Edit />} 
              sx={{ mr: 1 }}
              onClick={() => navigate(`/courses/${course.id}/edit`)}
            >
              Edit
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<Delete />}
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" color="text.secondary">
          {course.description || 'No description provided.'}
        </Typography>
      </Paper>

      <Paper elevation={0} sx={{ 
        border: '1px solid',
        borderColor: 'divider',
        p: 3
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
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
        >
          Back to Courses
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