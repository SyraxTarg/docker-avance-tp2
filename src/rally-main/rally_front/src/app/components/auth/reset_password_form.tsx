"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "react-toastify";
import { updatePassword } from "../../auth/reset/server_actions/update_password";
import { z } from "zod";

// Schéma Zod
const passwordSchema = z.object({
    newPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
});

export default function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("t");
    const formRef = useRef<HTMLFormElement>(null);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formRef.current || !token) return;

        const formData = new FormData(formRef.current);
        const newPassword = formData.get("newPassword")?.toString() || "";
        const confirmPassword = formData.get("confirmPassword")?.toString() || "";

        // Validation zod
        const validation = passwordSchema.safeParse({ newPassword, confirmPassword });
        if (!validation.success) {
            const firstError = validation.error.errors[0];
            toast.error(firstError.message);
            return;
        }

        try {
            const success = await updatePassword(token, newPassword, confirmPassword);
            if (!success) throw new Error();
            toast.success("Mot de passe réinitialisé avec succès !");
            router.push("/auth/login");
        } catch {
            toast.error("Erreur lors de la réinitialisation.");
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
                <p className="text-center text-red-500 text-lg">Token invalide ou manquant.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-20 px-4">
            <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg space-y-6">
                <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
                    Réinitialiser votre mot de passe
                </h1>

                <form ref={formRef} onSubmit={handleReset} className="space-y-4">
                    <input
                        name="newPassword"
                        type="password"
                        required
                        placeholder="Nouveau mot de passe"
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        name="confirmPassword"
                        type="password"
                        required
                        placeholder="Confirmer le mot de passe"
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition duration-200"
                    >
                        Réinitialiser le mot de passe
                    </button>
                </form>
            </div>
        </div>
    );
}
