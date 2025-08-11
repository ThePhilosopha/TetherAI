import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

type Row = Record<string, any>;

interface ResultData {
  secrets: Row[];
  endpoints: Row[];
  fileTypes: Row[];
  errors: Row[];
  info: Row[];
}

interface ResultsViewProps {
  id: string;
}

function SortableTable({ title, rows }: { title: string; rows: Row[] }) {
  const [orderBy, setOrderBy] = useState<string>('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  const handleSort = (col: string) => {
    const isAsc = orderBy === col && order === 'asc';
    setOrderBy(col);
    setOrder(isAsc ? 'desc' : 'asc');
  };

  const sorted = orderBy
    ? [...rows].sort((a, b) => {
        const aVal = a[orderBy] ?? '';
        const bVal = b[orderBy] ?? '';
        if (aVal > bVal) return order === 'asc' ? 1 : -1;
        if (aVal < bVal) return order === 'asc' ? -1 : 1;
        return 0;
      })
    : rows;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col}
                onClick={() => handleSort(col)}
                sx={{ cursor: 'pointer' }}
              >
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((row, idx) => (
            <TableRow key={idx}>
              {columns.map((col) => (
                <TableCell key={col}>{String(row[col])}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default function ResultsView({ id }: ResultsViewProps) {
  const [data, setData] = useState<ResultData>({
    secrets: [],
    endpoints: [],
    fileTypes: [],
    errors: [],
    info: [],
  });

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      const res = await fetch(`/scan/${id}`);
      const json = await res.json();
      if (!active) return;
      if (json.results) {
        setData(json.results);
      }
      if (json.status !== 'completed') {
        setTimeout(fetchData, 2000);
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <Box sx={{ mt: 4 }}>
      <SortableTable title="Secrets" rows={data.secrets} />
      <SortableTable title="Endpoints" rows={data.endpoints} />
      <SortableTable title="File Types" rows={data.fileTypes} />
      <SortableTable title="Errors" rows={data.errors} />
      <SortableTable title="Info" rows={data.info} />
    </Box>
  );
}
