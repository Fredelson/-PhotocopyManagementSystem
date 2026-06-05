// ============================================
// ARAB UNITY SCHOOL
// Reusable Status Chip
// Used across Teacher, HOD, HOS, Admin pages
// ============================================

import { Chip } from "@mui/material";

// Status color mapping
const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
    case "Approved":
      return "success";

    case "Printing":
      return "info";

    case "Pending HOD":
    case "Pending Approval":
      return "warning";

    case "Pending HOS":
      return "secondary";

    case "Rejected":
      return "error";

    case "Draft":
      return "default";

    default:
      return "default";
  }
};

export default function StatusChip({ status, size = "small" }) {
  return (
    <Chip
      label={status}
      color={getStatusColor(status)}
      size={size}
      sx={{
        fontWeight: 600,
      }}
    />
  );
}