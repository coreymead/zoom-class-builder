import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, List, ListItem, ListItemText, Button } from '@mui/material';
import { getCourses } from '../services/api';
import { Course } from '../types';

const BulkZoomSetup: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async (): Promise<void> => {
      try {
        const allCourses: Course[] = await getCourses();
        const coursesNeedingSetup: Course[] = allCourses.filter((course: Course) => {
          const resources = course.zoomResources;
          return !resources?.whiteboard?.resourceId || 
                 !resources?.chat?.resourceId || 
                 !resources?.meeting?.resourceId;
        });
        setCourses(coursesNeedingSetup);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to fetch courses. Please try again later.');
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (courses.length === 0) {
    return (
      <Box p={3}>
        <Typography variant="h6">No courses need Zoom setup</Typography>
        <Typography variant="body1" color="textSecondary">
          All courses have their Zoom resources initialized.
        </Typography>
      </Box>
    );
  }

  const getMissingResources = (course: Course): string => {
    const missing: string[] = [];
    if (!course.zoomResources?.whiteboard?.resourceId) missing.push('Whiteboard');
    if (!course.zoomResources?.chat?.resourceId) missing.push('Chat');
    if (!course.zoomResources?.meeting?.resourceId) missing.push('Meeting');
    return missing.join(', ');
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Courses Needing Zoom Setup
      </Typography>
      <List>
        {courses.map((course: Course) => (
          <ListItem key={course.id} divider>
            <ListItemText
              primary={course.name}
              secondary={getMissingResources(course)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                console.log('Setting up Zoom resources for course:', course.id);
              }}
            >
              Setup Resources
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default BulkZoomSetup; 