"use client";

import Link from "next/link";
import MyProfile from "./my_profile";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CalendarIcon,
  PlusIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useUser } from "../context/auth_context";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();

  const navLinks = [
    { name: "Accueil", href: "/", icon: <HomeIcon className="h-5 w-5 mr-2" /> },
    { name: "Évènements", href: "/events", icon: <CalendarIcon className="h-5 w-5 mr-2" /> },
    { name: "Organisateurs", href: "/profiles", icon: <UserIcon className="h-5 w-5 mr-2" /> },
  ];

  if (user) {
    navLinks.push(
      { name: "Ajouter un évenement", href: "/events/new", icon: <PlusIcon className="h-5 w-5 mr-2" /> }
    )

    if (user?.user?.role?.role === "ROLE_ADMIN" || user?.user?.role?.role === "ROLE_SUPER_ADMIN") {
      navLinks.push(
        { name: "Backoffice", href: "/admin/signalements", icon: <ShieldCheckIcon className="h-5 w-5 mr-2" /> }
      )
    }
  } else {
    navLinks.push(
      { name: "Connexion", href: "/auth/login", icon: <LockClosedIcon className="h-5 w-5 mr-2" /> }
    )
  }



  const isLinkActive = (href: string) => pathname === href;

  return (
    <Disclosure as="nav" className="bg-white shadow top-0 left-0 right-0 z-50 fixed h-16">
      {({ open, close }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </DisclosureButton>
              </div>

              <div className="flex-1 flex justify-center sm:justify-start">
                <Link href="/" className="text-[#4338CA] font-bold text-xl">
                  Rally
                </Link>
              </div>

              <div className="hidden sm:flex sm:items-center space-x-4 ml-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isLinkActive(link.href)
                      ? "text-[#4338CA] font-semibold"
                      : "text-gray-700 hover:text-[#4338CA]"
                      }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:ml-auto">
                {user && <MyProfile photo={user.photo} email={user.user.email} />}
              </div>
            </div>
          </div>

          {/* Mobile */}
          <DisclosurePanel className="sm:hidden fixed top-16 inset-x-0 bg-white border-t border-gray-200 shadow-md z-[9999]">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => close()}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isLinkActive(link.href)
                    ? "text-[#4338CA] font-semibold"
                    : "text-gray-700 hover:text-[#4338CA]"
                    }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
