"use client";
import { useState } from "react";
import styles from "./register.module.css";
import AuthButton from "../../components/auth/auth_button";
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { registerUser } from "./server_actions/register";
import { z } from "zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(12, "Le mot de passe doit contenir au moins 12 caractères"),
  phone_number: z
    .string()
    .regex(/^(\+33|0)[1-9](\d{2}){4}$/, "Numéro de téléphone invalide"),
  first_name: z.string().min(1, "Prénom requis"),
  last_name: z.string().min(1, "Nom requis"),
  photo: z.literal("/pfps/default.jpg"),
});

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [privacyError, setPrivacyError] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const data = {
      email,
      password,
      first_name,
      last_name,
      phone_number: phone,
      photo: "/pfps/default.jpg"
    };

    const parsed = registerSchema.safeParse(data);

    if (!parsed.success) {
      const newErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0]] = err.message;
        }
      });
      setErrors(newErrors);
      toast.error("Veuillez corriger les erreurs du formulaire.");
      return;
    }

    if (!privacyAccepted) {
      setPrivacyError(true);
      toast.error("Vous devez accepter la politique de confidentialité.");
      return;
    }

    try {
      setPrivacyError(false);
      const result = await registerUser(JSON.stringify(parsed.data));

      if (result?.email) {
        setTimeout(() => {
          sessionStorage.setItem("registeredEmail", result.email);
          router.push(`/auth/verification`);
        }, 100);
        toast.success("Utilisateur enregistré");
      } else {
        throw new Error("Email non retourné par l'API");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Une erreur est survenue");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        <div className="w-full bg-[#0F172A] text-white text-center py-4 rounded-t-lg">
          <h2 className="text-2xl font-bold">Inscription</h2>
        </div>
        <div className="pb-8 pl-8 pr-8">
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 pr-10 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                        <EyeIcon className="w-5 h-5" />
                    )}

                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  Prénom
                </label>
                <input
                  id="first_name"
                  type="text"
                  required
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  id="last_name"
                  type="text"
                  required
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  N° de téléphone
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
              </div>

              <div className="flex items-start space-x-2 my-4">
                <input
                  type="checkbox"
                  id="privacy"
                  required
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className={`mt-1 ${privacyError ? "border-red-500" : ""}`}
                />
                <label htmlFor="privacy" className="text-sm">
                  J’ai lu et j’accepte la{" "}
                  <a href="/privacy" className="text-blue-600 underline">
                    politique de confidentialité
                  </a>.
                </label>
              </div>
              {privacyError && (
                <p className="text-red-500 text-sm">
                  Vous devez accepter la politique de confidentialité.
                </p>
              )}
            </div>

            <AuthButton text={"Je m'inscris"} />
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Déjà inscrit(e) ?{" "}
            <a href="/auth/login" className={`text-sm font-medium ${styles.login_links}`}>
              Connectez-vous
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
