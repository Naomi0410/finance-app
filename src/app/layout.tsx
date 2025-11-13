import "./styles/globals.css";
import "./styles/variables.css";
import { Toaster } from "react-hot-toast";
import AuthToast from "@/lib/AuthToast";
import { Suspense } from "react";

// ✅ Minimal SEO metadata
export const metadata = {
  title: "Personal Finance App",
  description: "Smart budgeting and savings made simple.",
  openGraph: {
    title: "Personal Finance App",
    description: "Smart budgeting and savings made simple.",
    images: ["/preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Finance App",
    images: ["/preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/assets/images/favicon-32x32.png"
        />
        <link rel="canonical" href="https://finance-app-gamma-liard.vercel.app" />
      </head>
      <body className="bg-beige-100 h-full">
        {children}
        <Toaster position="top-center" />
        <Suspense fallback={null}>
          <AuthToast />
        </Suspense>
      </body>
    </html>
  );
}
