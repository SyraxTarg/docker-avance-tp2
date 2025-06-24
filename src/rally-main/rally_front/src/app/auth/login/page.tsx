"use client";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import Login from "../../components/auth/login_form";

export default function LoginPage() {

  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_GOOGLE_FRONT || ""}>
      <Login />
    </GoogleReCaptchaProvider>
  );
}
