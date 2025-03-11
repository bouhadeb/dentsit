// import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dental App",
  description: "Made By Bouhadeb Abdeslam",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="clean.png" sizes="any" />
      <body className="h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
