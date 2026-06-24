// ============================================
// ARAB UNITY SCHOOL
// Operations Platform
// Super Admin Dashboard Data
// Temporary frontend data
// Later this will come from backend API
// ============================================

import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

export const moduleCards = [
  {
    title: "Printing Management",
    description: "Photocopy requests, approvals, printing queue, inventory, and reports.",
    icon: <PrintOutlinedIcon />,
    status: "Active",
    color: "#047857",
  },
  {
    title: "IT Tickets",
    description: "Support requests, ticket assignment, SLA tracking, and resolution history.",
    icon: <ConfirmationNumberOutlinedIcon />,
    status: "Planned",
    color: "#2563eb",
  },
  {
    title: "Asset Management",
    description: "IT assets, ownership history, assignments, transfers, and audits.",
    icon: <Inventory2OutlinedIcon />,
    status: "Planned",
    color: "#7c3aed",
  },
  {
    title: "Academic Operations",
    description: "Subjects, sections, classrooms, year leaders, and teacher operations.",
    icon: <SchoolOutlinedIcon />,
    status: "Planned",
    color: "#ea580c",
  },
  {
    title: "Communication",
    description: "Announcements, email rules, notifications, and message templates.",
    icon: <CampaignOutlinedIcon />,
    status: "Planned",
    color: "#0891b2",
  },
  {
    title: "HR Management",
    description: "Staff records, roles, departments, access levels, and user lifecycle.",
    icon: <GroupsOutlinedIcon />,
    status: "Planned",
    color: "#be123c",
  },
  {
    title: "Student IDs",
    description: "Student ID creation, printing, reissue requests, and tracking.",
    icon: <BadgeOutlinedIcon />,
    status: "Planned",
    color: "#4f46e5",
  },
  {
    title: "Observations",
    description: "Classroom observations, follow-ups, records, and reporting.",
    icon: <VisibilityOutlinedIcon />,
    status: "Planned",
    color: "#65a30d",
  },
];