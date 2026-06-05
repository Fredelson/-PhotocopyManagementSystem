// ============================================
// ARAB UNITY SCHOOL
// Photocopy Management System
// Teacher Dashboard
// Attachment Summary Component
// ============================================

import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from "@mui/material";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import DownloadIcon from "@mui/icons-material/Download";
import StorageIcon from "@mui/icons-material/Storage";

import { attachmentSummaryData } from "../../data/dashboardData";

// ============================================
// Icon Helper
// Matches summary item title with an icon
// ============================================

const getSummaryIcon = (title) => {
  if (title.includes("Documents")) return <InsertDriveFileIcon />;
  if (title.includes("Images")) return <ImageIcon />;
  if (title.includes("Downloads")) return <DownloadIcon />;
  if (title.includes("Storage")) return <StorageIcon />;
  return <InsertDriveFileIcon />;
};

// ============================================
// Attachment Summary Component
// ============================================

export default function AttachmentSummary() {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        height: "100%",
      }}
    >
      <CardContent>
        {/* Section Title */}
        <Typography variant="h6" fontWeight={700} mb={3}>
          Attachment Summary
        </Typography>

        {/* Summary Items */}
        {attachmentSummaryData.map((item) => (
          <Box
            key={item.title}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2.5,
            }}
          >
            {/* Left Side: Icon + Title */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "12px",
                  backgroundColor: `${item.color}15`,
                  color: item.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {getSummaryIcon(item.title)}
              </Box>

              <Typography fontSize={14} fontWeight={600}>
                {item.title}
              </Typography>
            </Box>

            {/* Right Side: Value */}
            <Typography fontSize={14} fontWeight={800}>
              {item.value}
            </Typography>
          </Box>
        ))}

        {/* Storage Progress Bar */}
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Storage Usage
            </Typography>

            <Typography variant="body2" fontWeight={700}>
              24%
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={24}
            sx={{
              height: 8,
              borderRadius: 5,
              backgroundColor: "#E5E7EB",

              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                backgroundColor: "#2563EB",
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}