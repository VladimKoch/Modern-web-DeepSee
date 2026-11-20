import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DEEP SEA | Ocean Exploration & Conservation",
  description:
    "Embark on cutting-edge marine expeditions, discover untouched underwater ecosystems, and help protect our planet's greatest frontier.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased selection:bg-cyan-500 selection:text-white">
      <body className="min-h-full flex flex-col bg-[#051329] text-white">
        {children}
      </body>
    </html>
  );
}
