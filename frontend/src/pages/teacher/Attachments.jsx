// ============================================
// ARAB UNITY SCHOOL
// Teacher Attachments Page
// ============================================

import { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Typography,
  Button,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";

import DashboardLayout from "../../layouts/DashboardLayout";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/common/Topbar";
import PageHeader from "../../components/common/PageHeader";
import DashboardCard from "../../components/common/DashboardCard";

import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:5000/api";

export default function Attachments() {
  const { token, user } = useAuth();

  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    fetchAttachments();
  }, []);

  const fetchAttachments = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/requests/attachments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAttachments(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout
      sidebar={<Sidebar />}
      topbar={
        <Topbar
          userName={user?.fullName}
          role={user?.role}
        />
      }
    >
      <PageHeader
        title="Attachments"
        subtitle="View all uploaded files."
      />

      <DashboardCard title="My Attachments">
        {attachments.length === 0 ? (
          <Typography>
            No attachments found.
          </Typography>
        ) : (
          attachments.map((file) => (
            <Box
              key={file.AttachmentId}
              sx={{
                p: 2,
                mb: 2,
                border: "1px solid #E5E7EB",
                borderRadius: 2,
              }}
            >
              <Typography fontWeight={700}>
                {file.OriginalFileName}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Request: {file.RequestNumber}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Purpose: {file.PurposeName}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Pages: {file.PageCount || 0}
              </Typography>

              <Button
                sx={{ mt: 1 }}
                variant="outlined"
                startIcon={<DownloadIcon />}
                component="a"
                href={`http://localhost:5000${file.FilePath}`}
                target="_blank"
              >
                Open
              </Button>
            </Box>
          ))
        )}
      </DashboardCard>
    </DashboardLayout>
  );
}