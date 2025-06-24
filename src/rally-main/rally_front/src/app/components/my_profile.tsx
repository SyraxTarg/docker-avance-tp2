"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@heroui/modal";
import LogoutModal from "./logout_modal";
import { useUser } from '../context/auth_context';
import { toast } from "react-toastify";
import Avatar from "./avatar";
import { logout } from "../auth/login/server_actions/logout";


export default function MyProfile({ photo, email }: { photo: string, email: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { refetchUser } = useUser();

  const onLogout = async () => {
    try {
      await logout();

      await new Promise((resolve) => setTimeout(resolve, 100));

      await refetchUser();
      router.push("/")
      router.refresh();

      toast.success("Déconnexion réussie");
    } catch (error) {
      console.error("Erreur lors du logout:", error);
    } finally {
      onClose();
    }
  };


  return (
    <>
      <Dropdown>
      <DropdownTrigger>
        <button type="button">
          <Avatar src={photo} alt={`Avatar de ${email}`} />
        </button>
      </DropdownTrigger>

        <DropdownMenu
          aria-label="Menu du profil"
          className="bg-white shadow-lg rounded-lg px-2 py-2 w-48"
        >
          <DropdownItem
            key="my_profile"
            textValue="my profile"
            className="hover:bg-gray-100 rounded-md px-2 py-1"
          >
            <Link
              href="/profiles/me"
              className="block w-full text-left text-gray-800 hover:text-blue-600 px-2 py-1"
            >
              Mon profil
            </Link>
          </DropdownItem>

          <DropdownItem
            key="logout"
            textValue="logout"
            className="hover:bg-red-50 rounded-md px-2 py-1"
          >
            <button
              className="block w-full text-left text-red-600 hover:text-red-700 px-2 py-1 cursor-pointer"
              onClick={onOpen}
            >
              Déconnexion
            </button>
          </DropdownItem>
        </DropdownMenu>

      </Dropdown>
      <LogoutModal isOpen={isOpen} onClose={onClose} onLogout={onLogout} />
    </>
  );
}
