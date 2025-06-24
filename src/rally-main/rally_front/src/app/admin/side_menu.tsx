'use client';

import Link from "next/link";
import { useState } from "react";
import { useSelectedLayoutSegments } from "next/navigation";
import { useUser } from "@/app/context/auth_context";
import {
  Menu as MenuIcon,
  X as CloseIcon,
  Users,
  Flag,
  MessageCircle,
  CalendarCheck,
  ClipboardList,
  Key,
  FileText,
  CreditCard,
  Table,
  Ban
} from "lucide-react";

export default function SideMenu() {
  const segments = useSelectedLayoutSegments();
  const user = useUser().user;
  const currentSegment = segments[segments.length - 1] || "";
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Signalements", href: "/admin/signalements", segment: "signalements", icon: <Flag className="w-4 h-4" /> },
    { name: "Utilisateurs", href: "/admin/users", segment: "users", icon: <Users className="w-4 h-4" /> },
    { name: "Commentaires", href: "/admin/comments", segment: "comments", icon: <MessageCircle className="w-4 h-4" /> },
    { name: "Inscriptions", href: "/admin/registrations", segment: "registrations", icon: <ClipboardList className="w-4 h-4" /> },
    { name: "Evènements", href: "/admin/events", segment: "events", icon: <CalendarCheck className="w-4 h-4" /> },
  ];

  if (user?.user.role.role === "ROLE_SUPER_ADMIN") {
    navLinks.push(
      { name: "Gérer les rôles", href: "/admin/super-admin/profiles", segment: "profiles", icon: <Key className="w-4 h-4" /> },
      { name: "Logs", href: "/admin/super-admin/action-logs", segment: "action-logs", icon: <FileText className="w-4 h-4" /> },
      { name: "Paiements", href: "/admin/super-admin/payments", segment: "payments", icon: <CreditCard className="w-4 h-4" /> },
      { name: "Tables", href: "/admin/super-admin/tables", segment: "tables", icon: <Table className="w-4 h-4" /> },
      { name: "Utilisateurs Bannis", href: "/admin/super-admin/banned-users", segment: "banned-users", icon: <Ban className="w-4 h-4" /> }
    );
  }

  return (
    <>
      <button
        className="sm:hidden fixed top-20 left-4 z-30 text-gray-700 dark:text-white"
        onClick={() => setMenuOpen(true)}
        aria-label="Ouvrir le menu"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-30 sm:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 w-56 h-screen bg-gray-50 dark:bg-gray-800 pt-16 transition-transform transform ${menuOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0 sm:static`}
        aria-label="Sidebar"
      >
        {menuOpen && (
          <button
            className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 sm:hidden"
            onClick={() => setMenuOpen(false)}
            aria-label="Fermer le menu"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        )}

        <nav className="h-full px-4 py-6 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {navLinks.map((link) => {
              const isActive = currentSegment === link.segment;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors duration-200 ${isActive
                      ? "bg-blue-100 text-blue-700 font-semibold dark:bg-blue-900 dark:text-blue-300"
                      : "text-gray-700 hover:bg-gray-200 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                      }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
