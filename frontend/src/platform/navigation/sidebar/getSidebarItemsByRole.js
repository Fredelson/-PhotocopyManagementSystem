// ============================================
// ARAB UNITY SCHOOL
// Get Sidebar Sections By Role
// ============================================

import { superAdminSidebarSections } from "./superAdminSidebarItems";
import { printingAdminSidebarSections } from "./printingAdminSidebarItems";

export function getSidebarItemsByRole(role) {
  switch (role) {
    case "SuperAdmin":
      return superAdminSidebarSections;

    case "PrintingAdmin":
      return printingAdminSidebarSections;

    default:
      return [];
  }
}