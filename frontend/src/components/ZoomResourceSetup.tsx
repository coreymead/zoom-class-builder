import React from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Button,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Paper,
} from '@mui/material';

export type ResourceType = 'whiteboard' | 'chat' | 'meeting';

interface ResourceStatus {
  isLoading: boolean;
  isError: boolean;
  isComplete: boolean;
}

interface Props {
  selectedResources: Set<ResourceType>;
  onToggleResource: (resource: ResourceType) => void;
  resourceStatuses: Record<ResourceType, ResourceStatus>;
  onInitialize: () => void;
  isInitializing: boolean;
  onLinkExisting: (resourceType: ResourceType, resourceId: string) => void;
}

const ZoomResourceSetup: React.FC<Props> = ({
  selectedResources,
  onToggleResource,
  resourceStatuses,
  onInitialize,
  isInitializing,
  onLinkExisting,
}) => {
  const resources: { type: ResourceType; label: string; description: string }[] = [
    {
      type: 'whiteboard',
      label: 'Whiteboard',
      description: 'A collaborative whiteboard for real-time drawing and annotations'
    },
    {
      type: 'chat',
      label: 'Chat',
      description: 'A dedicated chat channel for course communications'
    },
    {
      type: 'meeting',
      label: 'Meeting',
      description: 'A recurring meeting room for scheduled sessions'
    },
  ];

  const [linkIds, setLinkIds] = React.useState<Record<ResourceType, string>>({
    whiteboard: '',
    chat: '',
    meeting: '',
  });

  const handleLinkIdChange = (type: ResourceType, value: string) => {
    setLinkIds(prev => ({ ...prev, [type]: value }));
  };

  const handleLinkSubmit = (type: ResourceType) => {
    const id = linkIds[type].trim();
    if (id) {
      onLinkExisting(type, id);
      setLinkIds(prev => ({ ...prev, [type]: '' }));
    }
  };

  return (
    <Box>
      <Stepper orientation="vertical" sx={{ mb: 4 }}>
        <Step active completed={false}>
          <StepLabel>
            <Typography variant="h6">Select Resources</Typography>
          </StepLabel>
        </Step>
        <Step active completed={false}>
          <StepLabel>
            <Typography variant="h6">Initialize or Link</Typography>
          </StepLabel>
        </Step>
        <Step active completed={false}>
          <StepLabel>
            <Typography variant="h6">Configure Settings</Typography>
          </StepLabel>
        </Step>
      </Stepper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Zoom Resources
        </Typography>
        <FormGroup>
          {resources.map(({ type, label, description }) => (
            <Box key={type} sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedResources.has(type)}
                    onChange={() => onToggleResource(type)}
                    disabled={resourceStatuses[type].isLoading || resourceStatuses[type].isComplete}
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle1">{label}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {description}
                    </Typography>
                  </Box>
                }
              />
              <Box sx={{ ml: 4, mt: 1 }}>
                {resourceStatuses[type].isLoading && <CircularProgress size={20} />}
                {resourceStatuses[type].isComplete && '✓ Resource initialized'}
                {resourceStatuses[type].isError && '❌ Initialization failed'}
                
                {!resourceStatuses[type].isComplete && (
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder={`Existing ${label} ID`}
                      value={linkIds[type]}
                      onChange={(e) => handleLinkIdChange(type, e.target.value)}
                      sx={{ minWidth: 200 }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleLinkSubmit(type)}
                      disabled={!linkIds[type].trim()}
                    >
                      Link Existing
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </FormGroup>
      </Paper>

      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={onInitialize}
          disabled={selectedResources.size === 0 || isInitializing}
        >
          {isInitializing ? 'Initializing...' : 'Initialize Selected Resources'}
        </Button>
      </Box>
    </Box>
  );
};

export default ZoomResourceSetup; 