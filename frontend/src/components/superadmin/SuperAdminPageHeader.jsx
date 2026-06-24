// ============================================
// ARAB UNITY SCHOOL
// Operations Platform
// Reusable Super Admin Page Header
// ============================================

import { Box, Typography } from "@mui/material";

export default function SuperAdminPageHeader({ title, subtitle }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4" fontWeight={900}>
        {title}
      </Typography>

      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}