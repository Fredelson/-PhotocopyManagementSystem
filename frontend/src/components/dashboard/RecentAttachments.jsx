// ============================================
// ARAB UNITY SCHOOL
// Photocopy Management System
// Teacher Dashboard
// Recent Attachments Component
// ============================================

import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
} from "@mui/material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import DownloadIcon from "@mui/icons-material/Download";

import { recentAttachmentsData } from "../../data/dashboardData";

// ============================================
// File Icon Helper
// Returns icon based on file type
// ============================================

const getFileIcon = (type) => {
  switch (type) {
    case "PDF":
      return <PictureAsPdfIcon color="error" />;
    case "DOCX":
      return <DescriptionIcon color="primary" />;
    case "PNG":
    case "JPG":
    case "JPEG":
      return <ImageIcon color="success" />;
    case "PPTX":
      return <SlideshowIcon color="warning" />;
    default:
      return <DescriptionIcon />;
  }
};

export default function RecentAttachments() {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        height: "100%",
      }}
    >
      <CardContent>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Recent Attachments
          </Typography>

          <Button size="small" variant="outlined">
            View All
          </Button>
        </Box>

        {/* Attachment List */}
        {recentAttachmentsData.map((file, index) => (
          <Box key={file.id}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: 2,
                py: 1.5,
              }}
            >
              {/* File Info */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  minWidth: 0,
                }}
              >
                {getFileIcon(file.type)}

                <Box sx={{ minWidth: 0 }}>
                  <Typography fontWeight={700} noWrap>
                    {file.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {file.size} • {file.uploadedDate}
                  </Typography>
                </Box>
              </Box>

              {/* File Actions */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip label={file.type} size="small" variant="outlined" />

                <Button size="small" startIcon={<DownloadIcon />}>
                  Download
                </Button>
              </Box>
            </Box>

            {index !== recentAttachmentsData.length - 1 && <Divider />}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}