// Ce fichier reste un composant Server (pas besoin de "use client")
import { Suspense } from "react";
import ResetPasswordForm from "@/app/components/auth/reset_password_form";

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
