import { Box, Typography } from '@mui/material';

function RowField({ label, value }) {
  return (
    <Box sx={{ display: 'flex', py: 0.5, alignItems: 'center' }}>
      <Typography variant="body2" sx={{ mr: 0.8 , fontWeight:'bold'}} >
        {label}
      </Typography>
      <Box>
        {value ?? '—'}  {/* value can now be JSX */}
      </Box>
    </Box>
  );
}

export default RowField;
