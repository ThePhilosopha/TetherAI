import { useState } from 'react';
import { Box, Button, TextField, FormControlLabel, Switch } from '@mui/material';

interface ScanFormProps {
  onScan: (id: string) => void;
}

export default function ScanForm({ onScan }: ScanFormProps) {
  const [targets, setTargets] = useState('');
  const [includeSecrets, setIncludeSecrets] = useState(true);
  const [includeEndpoints, setIncludeEndpoints] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      targets: targets.split(/\s+/).filter(Boolean),
      options: { includeSecrets, includeEndpoints },
    };
    const res = await fetch('/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.id) {
      onScan(data.id);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
      <TextField
        label="Targets"
        multiline
        fullWidth
        margin="normal"
        value={targets}
        onChange={(e) => setTargets(e.target.value)}
      />
      <FormControlLabel
        control={
          <Switch
            checked={includeSecrets}
            onChange={(e) => setIncludeSecrets(e.target.checked)}
          />
        }
        label="Include Secrets"
      />
      <FormControlLabel
        control={
          <Switch
            checked={includeEndpoints}
            onChange={(e) => setIncludeEndpoints(e.target.checked)}
          />
        }
        label="Include Endpoints"
      />
      <Box sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" disabled={!targets.trim()}>
          Start Scan
        </Button>
      </Box>
    </Box>
  );
}
