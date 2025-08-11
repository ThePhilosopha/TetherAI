import { useMemo, useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Button,
} from '@mui/material';
import ScanForm from './components/ScanForm';
import ResultsView from './components/ResultsView';

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [scanId, setScanId] = useState<string | null>(null);

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ py: 4 }}>
        <Button
          variant="outlined"
          onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
        >
          Toggle {mode === 'light' ? 'Dark' : 'Light'} Mode
        </Button>
        <ScanForm onScan={setScanId} />
        {scanId && <ResultsView id={scanId} />}
      </Container>
    </ThemeProvider>
  );
}
