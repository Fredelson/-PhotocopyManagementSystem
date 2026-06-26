// ============================================
// ARAB UNITY SCHOOL
// Quick Actions Component
// Connected to Teacher page navigation
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
import HistoryIcon from "@mui/icons-material/History";

import { useNavigate } from "react-router-dom";

// ============================================
// Quick Action Data
// ============================================

const quickActionsData = [
  {
    title: "Create Request",
    description: "Submit a new photocopy request",
    color: "#2563EB",
    path: "/teacher/create-request",
    icon: <AddIcon />,
  },
  {
    title: "My Requests",
    description: "View and track your submitted requests",
    color: "#10B981",
    path: "/teacher/requests",
    icon: <HistoryIcon />,
  },
  {
    title: "Reports",
    description: "View your request reports and analytics",
    color: "#F59E0B",
    path: "/teacher/reports",
    icon: <AssessmentIcon />,
  },
  {
    title: "Attachments",
    description: "View uploaded request attachments",
    color: "#8B5CF6",
    path: "/teacher/attachments",
    icon: <UploadIcon />,
  },
];

// ============================================
// Quick Actions Component
// ============================================

export default function QuickActions() {
  const navigate = useNavigate();

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
                {action.icon}
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

              <Button
                size="small"
                variant="outlined"
                fullWidth
                onClick={() => navigate(action.path)}
              >
                Open
              </Button>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}