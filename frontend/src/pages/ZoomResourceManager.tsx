import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, Button, CircularProgress, Alert,
  TextField, Autocomplete, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Divider
} from '@mui/material';
import { ArrowBack, Delete, Link as LinkIcon } from '@mui/icons-material';
import CourseService from '../services/CourseService';
import { Course } from '../types';

type ResourceType = 'whiteboard' | 'chat' | 'meeting';

interface ResourceTypeInfo {
  title: string;
  description: string;
  linkPlaceholder: string;
}

const RESOURCE_INFO: Record<ResourceType, ResourceTypeInfo> = {
  whiteboard: {
    title: 'Zoom Whiteboard',
    description: 'A collaborative whiteboard for real-time drawing and brainstorming.',
    linkPlaceholder: 'Enter Zoom Whiteboard URL or ID'
  },
  chat: {
    title: 'Team Chat',
    description: 'A dedicated chat channel for course communications.',
    linkPlaceholder: 'Enter Zoom Team Chat Channel URL or ID'
  },
  meeting: {
    title: 'Recurring Meeting',
    description: 'A scheduled recurring Zoom meeting for regular class sessions.',
    linkPlaceholder: 'Enter Zoom Meeting URL or ID'
  }
};

const ZoomResourceManager = () => {
  const { id, resourceType } = useParams<{ id: string; resourceType: ResourceType }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [existingResourceId, setExistingResourceId] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; name: string }[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      try {
        const data = await CourseService.getCourseById(id);
        setCourse(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load course');
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleSearch = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      // This would be replaced with actual API call to search Zoom resources
      const results = await CourseService.searchZoomResources(resourceType!, query);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search resources');
    } finally {
      setSearching(false);
    }
  };

  const handleUnlink = async () => {
    if (!course || !resourceType) return;
    
    try {
      setLoading(true);
      const updatedCourse = await CourseService.unlinkZoomResource(course.id, resourceType);
      setCourse(updatedCourse);
      setDialogOpen(false);
    } catch (err) {
      setError('Failed to unlink resource');
    } finally {
      setLoading(false);
    }
  };

  const handleLink = async () => {
    if (!course || !resourceType || !existingResourceId) return;
    
    try {
      setLoading(true);
      const updatedCourse = await CourseService.linkZoomResource(course.id, resourceType, existingResourceId);
      setCourse(updatedCourse);
    } catch (err) {
      setError('Failed to link resource');
    } finally {
      setLoading(false);
    }
  };

  if (!resourceType || !RESOURCE_INFO[resourceType]) {
    return <Alert severity="error">Invalid resource type</Alert>;
  }

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

  const resourceInfo = RESOURCE_INFO[resourceType];
  const resource = course.zoomResources?.[resourceType];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          {resourceInfo.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Course: {course.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {resourceInfo.description}
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
        {resource === 'created' ? (
          <>
            <Typography variant="h6" gutterBottom>
              Current Resource
            </Typography>
            <Box sx={{ mb: 3 }}>
              {/* This would show actual resource details from Zoom API */}
              <Typography variant="body1">
                Resource ID: zoom_resource_123
              </Typography>
              <Typography variant="body1">
                Status: Active
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => setDialogOpen(true)}
            >
              Unlink Resource
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Link Existing Resource
            </Typography>
            <Box sx={{ maxWidth: 600 }}>
              <Autocomplete
                freeSolo
                options={searchResults}
                getOptionLabel={(option) => 
                  typeof option === 'string' ? option : option.name
                }
                loading={searching}
                onInputChange={(_, value) => handleSearch(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={resourceInfo.linkPlaceholder}
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                )}
              />
              <Button
                variant="contained"
                startIcon={<LinkIcon />}
                onClick={handleLink}
                disabled={!existingResourceId}
              >
                Link Resource
              </Button>
            </Box>
          </>
        )}
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>
          Confirm Unlink
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to unlink this {resourceInfo.title.toLowerCase()}? 
            The resource will remain in Zoom but will no longer be associated with this course.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUnlink} color="error" autoFocus>
            Unlink
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ZoomResourceManager; 