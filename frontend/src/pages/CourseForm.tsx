import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseService from '../services/CourseService';
import { CourseFormData } from '../types';
import {
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Stack,
  Divider
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';

const CourseForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<CourseFormData>({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState<boolean>(isEditMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      
      try {
        const data = await CourseService.getCourseById(id);
        if (data) {
          setFormData({
            name: data.name,
            description: data.description || ''
          });
        } else {
          setError('Course not found');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load course details');
        setLoading(false);
      }
    };

    if (isEditMode) {
      fetchCourse();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (isEditMode) {
        await CourseService.updateCourse(id!, formData);
        navigate(`/courses/${id}`);
      } else {
        const newCourse = await CourseService.createCourse(formData);
        navigate(`/courses/${newCourse.id}`);
      }
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} course`);
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
    <Box sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}>
      <Paper elevation={0} sx={{ 
        border: '1px solid',
        borderColor: 'divider',
      }}>
        <Box sx={{ p: 3 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontSize: '2rem',
              fontWeight: 600,
              color: 'text.primary',
              mb: 3
            }}
          >
            {isEditMode ? 'Edit Course' : 'Create New Course'}
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Course Name"
                value={formData.name}
                onChange={handleChange}
                required
                variant="outlined"
              />
              
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Course Description"
                value={formData.description}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={4}
              />
            </Stack>

            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 2
            }}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<Cancel />}
                onClick={() => navigate(isEditMode ? `/courses/${id}` : '/')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                startIcon={<Save />}
              >
                {isEditMode ? 'Update Course' : 'Create Course'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CourseForm; 