"use client";

import { useState, useEffect } from "react";
import { updateRole } from "@/app/admin/super-admin/profiles/server_actions/update_role";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  onSuccess?: () => void;
};

type Profile = {
  id: number;
  first_name: string;
  last_name: string;
  photo: string;
  nb_like: number;
  user: {
    id: number;
    email: string;
    phone_number: string;
    is_planner: boolean;
    account_id: string | null;
    role: {
      id: number;
      role: string;
    };
  };
  created_at: string | Date;
  updated_at: string | Date;
};

const Roles = [
  { name: "Utilisateur", value: "ROLE_USER" },
  { name: "Administrateur", value: "ROLE_ADMIN" },
  { name: "Super-administrateur", value: "ROLE_SUPER_ADMIN" },
];

export default function RoleModal({ isOpen, onClose, profile, onSuccess }: Props) {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && profile) {
      setSelectedRole(profile.user.role.role);
    } else {
      setSelectedRole("");
    }
  }, [isOpen, profile]);

  const handleRoleChange = async () => {
    if (!profile) return; // sécurité

    try {
      setSaving(true);
      await updateRole(selectedRole, profile.id);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Erreur lors de la mise à jour du rôle :", err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-50 w-full max-w-md bg-white rounded-xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-3">
          Modifier le rôle de l’utilisateur {profile?.user.email ?? ""}
        </h2>

        {profile ? (
          <>
            <div className="mb-6">
              <label
                htmlFor="roles"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Rôle actuel
              </label>
              <select
                name="roles"
                id="roles"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="" disabled>
                  -- Sélectionnez un rôle --
                </option>
                {Roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                disabled={saving}
                className="px-5 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition disabled:opacity-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleRoleChange}
                disabled={saving || selectedRole === ""}
                className="px-5 py-3 rounded-lg bg-[#4338CA] hover:bg-[#6366F1] focus:ring-4 focus:ring-[#6366F1] text-white font-semibold transition disabled:opacity-50 cursor-pointer"
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-red-500">Profil introuvable.</p>
        )}
      </div>
    </div>
  );
}
