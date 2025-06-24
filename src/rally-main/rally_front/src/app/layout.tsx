import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/footer";
import { UserProvider } from "./context/auth_context";
import { ToastContainer, Bounce } from "react-toastify";
import ClientWrapper from "./client_wrapper";
import Navbar from "./components/nav_bar";
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rally - La plateforme",
  description: "Bienvenue sur Rally.",
  openGraph: {
    title: "Rally - La plateforme",
    description: "Bienvenue sur Rally.",
    images: [
      {
        url: "/open_graph/RALLY.png",
        width: 1200,
        height: 630,
        alt: "Image de présentation Rally",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rally - La plateforme",
    description: "Bienvenue sur Rally.",
    images: ["/open_graph/RALLY.png"],
  },
};


export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gray-100`}
      >
        <ClientWrapper>
          <UserProvider>
            <Navbar />
            <main>{children}</main>
            <SpeedInsights />
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              transition={Bounce}
            />
            <Footer />
          </UserProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}
