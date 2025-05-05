import React, { useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { ResourceType, default as ZoomResourceSetup } from './ZoomResourceSetup';
import { initializeZoomResources, linkZoomResource } from '../services/api';

interface Props {
  courseId: string;
  onComplete?: () => void;
}

const ZoomResourceManager: React.FC<Props> = ({ courseId, onComplete }) => {
  const [selectedResources, setSelectedResources] = useState<Set<ResourceType>>(new Set());
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resourceStatuses, setResourceStatuses] = useState<Record<ResourceType, {
    isLoading: boolean;
    isError: boolean;
    isComplete: boolean;
  }>>({
    whiteboard: { isLoading: false, isError: false, isComplete: false },
    chat: { isLoading: false, isError: false, isComplete: false },
    meeting: { isLoading: false, isError: false, isComplete: false },
  });

  const handleToggleResource = (resource: ResourceType) => {
    const newSelected = new Set(selectedResources);
    if (newSelected.has(resource)) {
      newSelected.delete(resource);
    } else {
      newSelected.add(resource);
    }
    setSelectedResources(newSelected);
  };

  const handleLinkExisting = async (resourceType: ResourceType, resourceId: string) => {
    setResourceStatuses(prev => ({
      ...prev,
      [resourceType]: { ...prev[resourceType], isLoading: true }
    }));

    try {
      await linkZoomResource(courseId, resourceType, resourceId);
      setResourceStatuses(prev => ({
        ...prev,
        [resourceType]: { isLoading: false, isError: false, isComplete: true }
      }));

      // Check if all selected resources are complete
      const allComplete = Array.from(selectedResources).every(
        resource => resourceStatuses[resource].isComplete
      );

      if (allComplete && onComplete) {
        onComplete();
      }
    } catch (err) {
      setResourceStatuses(prev => ({
        ...prev,
        [resourceType]: { isLoading: false, isError: true, isComplete: false }
      }));
      setError(err instanceof Error ? err.message : 'Failed to link resource');
    }
  };

  const handleInitialize = async () => {
    setIsInitializing(true);
    setError(null);

    try {
      for (const resource of selectedResources) {
        // Update status to loading
        setResourceStatuses(prev => ({
          ...prev,
          [resource]: { ...prev[resource], isLoading: true }
        }));

        try {
          await initializeZoomResources(courseId, resource);
          // Update status to complete
          setResourceStatuses(prev => ({
            ...prev,
            [resource]: { isLoading: false, isError: false, isComplete: true }
          }));
        } catch (err) {
          // Update status to error
          setResourceStatuses(prev => ({
            ...prev,
            [resource]: { isLoading: false, isError: true, isComplete: false }
          }));
          throw err;
        }
      }

      // Check if all selected resources are complete
      const allComplete = Array.from(selectedResources).every(
        resource => resourceStatuses[resource].isComplete
      );

      if (allComplete && onComplete) {
        onComplete();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize Zoom resources');
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <ZoomResourceSetup
        selectedResources={selectedResources}
        onToggleResource={handleToggleResource}
        resourceStatuses={resourceStatuses}
        onInitialize={handleInitialize}
        isInitializing={isInitializing}
        onLinkExisting={handleLinkExisting}
      />
    </Box>
  );
};

export default ZoomResourceManager; 