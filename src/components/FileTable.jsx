import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import FileRow from './FileRow';

export default function FileTable({ files, emphasizeTitle = false }) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              <strong>Version</strong>
            </TableCell>
            <TableCell>
              <strong>Category</strong>
            </TableCell>
            <TableCell>
              <strong>Release Date</strong>
            </TableCell>
            <TableCell>
              <strong>File Size</strong>
            </TableCell>
            <TableCell>
              <strong>Download</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.length > 0 ? (
            files.map((file, index) => (
              <FileRow
                key={file.Id || index}
                file={file}
                categoryName={file.categoryName}
                emphasizeTitle={emphasizeTitle}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No files found matching the current filters
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
