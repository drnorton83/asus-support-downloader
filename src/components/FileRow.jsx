import { useState } from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Typography,
  Button,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Download,
} from '@mui/icons-material';

export default function FileRow({ file, categoryName, emphasizeTitle = false }) {
  const [open, setOpen] = useState(false);

  const formatFileSize = (sizeStr) => {
    return sizeStr || 'N/A';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return dateStr;
  };

  const handleDownload = url => {
    if (url) {
      // Strip the 'model' query parameter if present
      let cleanUrl = url;
      try {
        const urlObj = new URL(url);
        if (urlObj.searchParams.has('model')) {
          urlObj.searchParams.delete('model');
          cleanUrl = urlObj.toString();
        }
      } catch (e) {
        // If URL parsing fails, use original URL
        console.error('Error parsing URL:', e);
      }

      // Open in new tab without setting download attribute
      // This avoids referer issues with ASUS servers
      window.open(cleanUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {emphasizeTitle ? (
              <>
                {/* Title first (emphasized) for Drivers */}
                {file.Title && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <strong>{file.Title}</strong>
                    {file.IsRelease === '0' && (
                      <Chip label="Beta" size="small" color="warning" />
                    )}
                  </Box>
                )}
                <Typography variant="body2" color="text.secondary">
                  {file.Version}
                </Typography>
              </>
            ) : (
              <>
                {/* Version first (emphasized) for BIOS */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <strong>{file.Version}</strong>
                  {file.IsRelease === '0' && (
                    <Chip label="Beta" size="small" color="warning" />
                  )}
                </Box>
                {file.Title && (
                  <Typography variant="body2" color="text.secondary">
                    {file.Title}
                  </Typography>
                )}
              </>
            )}
          </Box>
        </TableCell>
        <TableCell>{categoryName}</TableCell>
        <TableCell>{formatDate(file.ReleaseDate)}</TableCell>
        <TableCell>{formatFileSize(file.FileSize)}</TableCell>
        <TableCell>
          <Tooltip title="Download">
            <IconButton
              color="primary"
              onClick={() =>
                handleDownload(file.DownloadUrl?.Global)
              }
              disabled={!file.DownloadUrl?.Global}
            >
              <Download />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Description:</strong>
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ whiteSpace: 'pre-wrap', ml: 2 }}
              >
                {stripHtml(file.Description || 'No description available')}
              </Typography>
              {file.sha256 && (
                <Typography
                  variant="body2"
                  sx={{ mt: 1, fontFamily: 'monospace', fontSize: '0.75rem' }}
                >
                  <strong>SHA256:</strong> {file.sha256}
                </Typography>
              )}
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={() =>
                    handleDownload(file.DownloadUrl?.Global)
                  }
                  disabled={!file.DownloadUrl?.Global}
                >
                  Download {file.DownloadUrl?.Global ? '' : '(Not Available)'}
                </Button>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
