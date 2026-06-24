// ============================================
// ARAB UNITY SCHOOL
// Super Admin Sidebar Sections
// ============================================

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import MenuOpenOutlinedIcon from "@mui/icons-material/MenuOpenOutlined";
import TouchAppOutlinedIcon from "@mui/icons-material/TouchAppOutlined";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import ComputerOutlinedIcon from "@mui/icons-material/ComputerOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";

export const superAdminSidebarSections = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/super-admin/dashboard",
        icon: <DashboardOutlinedIcon />,
      },
    ],
  },

  {
    title: "Platform Control",
    items: [
      {
        label: "Module Manager",
        path: "/super-admin/modules",
        icon: <AppsOutlinedIcon />,
      },
      {
        label: "Menu Manager",
        path: "/super-admin/menus",
        icon: <MenuOpenOutlinedIcon />,
      },
      {
        label: "Button Manager",
        path: "/super-admin/buttons",
        icon: <TouchAppOutlinedIcon />,
      },
      {
        label: "Widget Manager",
        path: "/super-admin/widgets",
        icon: <WidgetsOutlinedIcon />,
      },
      {
        label: "Feature Flags",
        path: "/super-admin/feature-flags",
        icon: <FlagOutlinedIcon />,
      },
    ],
  },

  {
    title: "Security & Access",
    items: [
      {
        label: "User Management",
        path: "/super-admin/users",
        icon: <PeopleAltOutlinedIcon />,
      },
      {
        label: "Roles",
        path: "/super-admin/roles",
        icon: <ShieldOutlinedIcon />,
      },
      {
        label: "Access Levels",
        path: "/super-admin/access-levels",
        icon: <AdminPanelSettingsOutlinedIcon />,
      },
      {
        label: "Permissions",
        path: "/super-admin/permissions",
        icon: <SecurityOutlinedIcon />,
      },
    ],
  },

  {
    title: "Operations Modules",
    items: [
      {
        label: "Printing Management",
        path: "/super-admin/printing",
        icon: <LocalPrintshopOutlinedIcon />,
      },
      {
        label: "Inventory Management",
        path: "/super-admin/inventory",
        icon: <Inventory2OutlinedIcon />,
      },
      {
        label: "IT Service Desk",
        path: "/super-admin/it-tickets",
        icon: <ConfirmationNumberOutlinedIcon />,
      },
      {
        label: "IT Asset Management",
        path: "/super-admin/assets",
        icon: <ComputerOutlinedIcon />,
      },
      {
        label: "Academic Operations",
        path: "/super-admin/academic",
        icon: <SchoolOutlinedIcon />,
      },
      {
        label: "Teacher Observations",
        path: "/super-admin/observations",
        icon: <VisibilityOutlinedIcon />,
      },
      {
        label: "Communication Center",
        path: "/super-admin/communication",
        icon: <CampaignOutlinedIcon />,
      },
      {
        label: "Reports & Analytics",
        path: "/super-admin/reports",
        icon: <BarChartOutlinedIcon />,
      },
      {
        label: "HR Management",
        path: "/super-admin/hr",
        icon: <PeopleAltOutlinedIcon />,
      },
    ],
  },

  {
    title: "Monitoring",
    items: [
      {
        label: "Audit Logs",
        path: "/super-admin/audit-logs",
        icon: <HistoryOutlinedIcon />,
      },
      {
        label: "Activity Logs",
        path: "/super-admin/activity-logs",
        icon: <HistoryOutlinedIcon />,
      },
    ],
  },

  {
    title: "System Control",
    items: [
      {
        label: "System Settings",
        path: "/super-admin/settings",
        icon: <SettingsOutlinedIcon />,
      },
      {
        label: "Backup & Restore",
        path: "/super-admin/backups",
        icon: <BackupOutlinedIcon />,
      },
      {
        label: "Integrations",
        path: "/super-admin/integrations",
        icon: <HubOutlinedIcon />,
      },
      {
        label: "Database Tools",
        path: "/super-admin/database-tools",
        icon: <StorageOutlinedIcon />,
      },
    ],
  },
];