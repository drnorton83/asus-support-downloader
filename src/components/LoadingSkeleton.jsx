import { Paper, Box, Skeleton } from '@mui/material';

export default function LoadingSkeleton() {
  return (
    <>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Skeleton variant="rectangular" width="100%" height={56} />
          <Skeleton variant="rectangular" width="100%" height={56} />
          <Skeleton variant="rectangular" width="100%" height={56} />
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="20%" height={20} sx={{ mb: 3 }} />

        {/* Table skeleton */}
        <Box>
          {[...Array(5)].map((_, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                gap: 2,
                mb: 2,
                pb: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Skeleton variant="rectangular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>
              <Skeleton variant="text" width="15%" height={24} />
              <Skeleton variant="text" width="15%" height={24} />
              <Skeleton variant="text" width="10%" height={24} />
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
          ))}
        </Box>
      </Paper>
    </>
  );
}
