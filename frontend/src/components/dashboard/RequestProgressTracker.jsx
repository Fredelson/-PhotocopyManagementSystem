// ============================================
// ARAB UNITY SCHOOL
// Photocopy Management System
// Teacher Dashboard
// Request Progress Tracker Component
// ============================================

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

import { requestProgressData } from "../../data/dashboardData";

export default function RequestProgressTracker() {
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
            mb: 3,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Request Progress Tracker
          </Typography>

          <Chip label="Latest" size="small" color="primary" />
        </Box>

        {/* Progress Steps */}
        <Box>
          {requestProgressData.map((step, index) => (
            <Box
              key={step.label}
              sx={{
                display: "flex",
                gap: 1.5,
                mb: index === requestProgressData.length - 1 ? 0 : 2,
              }}
            >
              {/* Step Icon */}
              <Box>
                {step.completed ? (
                  <CheckCircleIcon sx={{ color: "#10B981", fontSize: 22 }} />
                ) : (
                  <RadioButtonUncheckedIcon
                    sx={{ color: "#94A3B8", fontSize: 22 }}
                  />
                )}
              </Box>

              {/* Step Text */}
              <Box>
                <Typography fontWeight={700} fontSize={14}>
                  {step.label}
                </Typography>

                <Typography color="text.secondary" fontSize={12}>
                  {step.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}