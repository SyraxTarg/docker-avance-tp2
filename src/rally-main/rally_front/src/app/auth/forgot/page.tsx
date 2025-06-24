"use client";

import { useRef, useState } from "react";
import { createResetLink } from "./server_actions/create_reset_link";
import { toast } from "react-toastify";
import { z } from "zod";

// Schéma Zod
const forgotPasswordSchema = z.object({
    email: z.string().email("Adresse email invalide"),
});

export default function ForgotPasswordPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formRef.current) return;

        const formData = new FormData(formRef.current);
        const email = formData.get("email")?.toString() || "";

        const validation = forgotPasswordSchema.safeParse({ email });

        if (!validation.success) {
            const firstError = validation.error.errors[0];
            toast.error(firstError.message);
            return;
        }

        try {
            await createResetLink(email);
            setSuccess(true);
            toast.success("Un lien de réinitialisation a été envoyé à votre adresse e-mail.");
        } catch {
            toast.error("Une erreur est survenue. Vérifiez votre e-mail.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20 pb-8 px-4">
            <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg space-y-6">
                <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
                    Mot de passe oublié
                </h1>

                {success ? (
                    <p className="text-green-600 text-center">
                        Vérifiez votre boîte mail pour réinitialiser votre mot de passe.
                    </p>
                ) : (
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="Votre adresse e-mail"
                            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            type="submit"
                            className="w-full py-2 rounded transition duration-200 bg-[#4338CA] hover:bg-[#6366F1] text-white cursor-pointer"
                        >
                            Envoyer le lien de réinitialisation
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
