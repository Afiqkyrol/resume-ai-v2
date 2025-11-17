import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title:
    "Malaysia Resume AI Builder by Cerouno | Create ATS-Friendly Resumes in Seconds",
  description:
    "Malaysia Resume AI Builder by Cerouno lets you instantly generate clean, modern, ATS-friendly resumes. Paste your career info and get a polished, one-page resume.",
  keywords: [
    "AI resume builder",
    "resume generator",
    "ATS resume",
    "one page resume",
    "professional resume",
    "resume creator",
    "Cerouno",
    "Malaysia resume",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
