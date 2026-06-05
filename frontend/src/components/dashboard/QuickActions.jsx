// ============================================
// ARAB UNITY SCHOOL
// Quick Actions Component
// Fixed responsive layout - no horizontal overflow
// ============================================

import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DownloadIcon from "@mui/icons-material/Download";

import { quickActionsData } from "../../data/dashboardData";

const getActionIcon = (title) => {
  if (title.includes("Create")) return <AddIcon />;
  if (title.includes("Upload")) return <UploadIcon />;
  if (title.includes("Reports")) return <AssessmentIcon />;
  if (title.includes("Download")) return <DownloadIcon />;
  return <AddIcon />;
};

export default function QuickActions() {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Quick Actions
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
            },
            gap: 2,
            width: "100%",
          }}
        >
          {quickActionsData.map((action) => (
            <Box
              key={action.title}
              sx={{
                minWidth: 0,
                p: 2,
                borderRadius: 3,
                border: "1px solid #E5E7EB",
                backgroundColor: "#F8FAFC",
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "14px",
                  backgroundColor: action.color,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1.5,
                }}
              >
                {getActionIcon(action.title)}
              </Box>

              <Typography
                fontWeight={700}
                sx={{
                  wordBreak: "break-word",
                }}
              >
                {action.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                mt={0.5}
                mb={2}
                sx={{
                  wordBreak: "break-word",
                }}
              >
                {action.description}
              </Typography>

              <Button size="small" variant="outlined" fullWidth>
                Open
              </Button>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}