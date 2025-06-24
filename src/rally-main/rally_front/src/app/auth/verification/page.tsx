"use client";
import { useState } from "react";
import CodeInput from "./components/code_input";
import AuthButton from "../../components/auth/auth_button";
import style from './verification.module.css';
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { sendToken } from "./server_actions/send_token";
import { verifyToken } from "./server_actions/verify_token";
import { z } from "zod";

const tokenSchema = z.string().regex(/^\d{6}$/, "Le code doit contenir exactement 6 chiffres.");

export default function VerificationPage() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [tokenSent, setTokenSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false); // 🆕

  const email = typeof window !== "undefined"
    ? sessionStorage.getItem("registeredEmail") || ""
    : "";

  if (!email) {
    if (typeof window !== "undefined") router.push("/auth/register");
    return null;
  }

  const startTimer = (duration: number) => {
    setTimeLeft(duration);
    if (timerId) clearInterval(timerId);

    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (!prev || prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimerId(id);
  };

  const sendTokenEmail = async () => {
    setErrorMessage("");
    setIsSending(true); // 🆕
    try {
      await sendToken(email);
      startTimer(1200); // 20 min
      setTokenSent(true);
      toast.success("Code envoyé !");
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
        toast.error("Erreur : " + error.message);
      } else {
        setErrorMessage("Erreur inconnue lors de l'envoi du code.");
        toast.error("Erreur inconnue lors de l'envoi du code.");
      }
    } finally {
      setIsSending(false); // 🆕
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    const token = code.join("");

    const parsed = tokenSchema.safeParse(token);
    if (!parsed.success) {
      setErrorMessage(parsed.error.errors[0].message);
      toast.error(parsed.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    try {
      await verifyToken(email, token);
      toast.success("Compte vérifié");
      router.push(`/auth/login`);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
        toast.error(`Erreur: ${error.message}`);
      } else {
        setErrorMessage("Une erreur est survenue.");
        toast.error("Une erreur est survenue.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h1 className={`text-2xl font-bold text-gray-800 mb-4 ${style.verif_title}`}>
          Vérifiez votre compte !
        </h1>
        <p className="text-gray-600 mb-6">
          Veuillez entrer le code à 6 chiffres envoyé à votre email lorsque vous appuierez sur &quot;Envoyer un code&quot;.
        </p>

        <form onSubmit={handleSubmit}>
          <CodeInput code={code} setCode={setCode} />

          {errorMessage && (
            <div className="text-red-600 text-sm mb-4">{errorMessage}</div>
          )}

          <AuthButton text="Vérifier le code" isLoading={isLoading} />

          <p
            className={`mt-6 text-center text-sm text-[#0F172A] hover:text-[#6366F1] cursor-pointer flex justify-center items-center gap-2`}
            onClick={!isSending ? sendTokenEmail : undefined}
          >
            {isSending ? (
              <>
                <svg className="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Envoi en cours...
              </>
            ) : (
              "Envoyer un code"
            )}
          </p>

          {tokenSent && timeLeft !== null && (
            <div className="mt-6 text-lg text-gray-700 font-medium">
              Le token est encore valide pendant :{" "}
              <span className="font-mono text-[#0F172A]">{formatTime(timeLeft)}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
