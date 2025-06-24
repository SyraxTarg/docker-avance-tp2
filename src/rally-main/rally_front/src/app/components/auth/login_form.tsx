"use client";
import { useState } from "react";
import AuthButton from "./auth_button";
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { login } from "../../auth/login/server_actions/login";
import { useUser } from "@/app/context/auth_context";
import { z } from "zod";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { refetchUser } = useUser();
  const router = useRouter();

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      setErrorMessage(firstError.message);
      toast.error(firstError.message);
      setIsLoading(false);
      return;
    }

    if (!executeRecaptcha) {
      setErrorMessage("Impossible de valider reCAPTCHA.");
      toast.error("reCAPTCHA non disponible");
      setIsLoading(false);
      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha("login");
      const body = { email, password, remember_me: rememberMe, recaptcha_token: recaptchaToken };

      await login(body);
      await refetchUser();
      router.push(`/`);
      toast.success("Connexion réussie");
    } catch (error) {
      console.error(error);
      setErrorMessage("Mot de passe ou identifiant invalide.");
      toast.error("Connexion impossible");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        <div className="w-full bg-[#0F172A] text-[#F7FAF6] text-center py-4 rounded-t-lg">
          <h2 className="text-2xl font-bold">Connexion</h2>
        </div>
        <div className="pb-8 pl-8 pr-8">
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`mt-1 block w-full rounded-md px-3 py-2 text-gray-900 shadow-sm focus:outline-none ${errorMessage
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-200"
                      : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    } sm:text-sm`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                    Mot de passe
                  </label>
                  <a href="/auth/forgot" className="text-sm font-medium text-[#0F172A] hover:underline">
                    Mot de passe oublié ?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`mt-1 block w-full rounded-md px-3 py-2 text-gray-900 shadow-sm focus:outline-none ${errorMessage
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-200"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      } sm:text-sm pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 top-1 flex items-center text-gray-500 focus:outline-none"
                    tabIndex={-1}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                    ) : showPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>

            {errorMessage && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}

            <AuthButton text={"Je me connecte"} isLoading={isLoading} />
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Aucun compte ?{" "}
            <a href="/auth/register" className="text-sm font-medium text-[#0F172A] hover:underline">
              Inscrivez-vous
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
