import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button } from '@mui/material';
import CourseService from '../services/CourseService';
import { Course } from '../types';
import { ResourceType } from '../components/ZoomResourceSetup';
import ZoomResourceManager from '../components/ZoomResourceManager';

const RESOURCES: { type: ResourceType; label: string; description: string }[] = [
  {
    type: 'whiteboard',
    label: 'Create Zoom Whiteboard',
    description: 'A collaborative whiteboard will be created for this course.'
  },
  {
    type: 'chat',
    label: 'Set Up Team Chat',
    description: 'A dedicated Zoom Team Chat channel will be created for course discussions.'
  },
  {
    type: 'meeting',
    label: 'Configure Recurring Meeting',
    description: 'A recurring Zoom meeting will be scheduled for regular class sessions.'
  }
];

const ZoomSetup = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      try {
        const data = await CourseService.getCourseById(id);
        setCourse(data as Course);
        setLoading(false);
      } catch (err) {
        setError('Failed to load course');
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

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
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(`/courses/${id}`)}
          sx={{ mb: 2 }}
        >
          Back to Course
        </Button>
      </Box>

      <ZoomResourceManager
        courseId={id || ''}
        onComplete={() => {
          navigate(`/courses/${id}`);
        }}
      />
    </Box>
  );
};

export default ZoomSetup; 