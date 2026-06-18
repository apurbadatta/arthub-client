import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ArtHub | Online Art Marketplace",
  description: "Discover & Buy Original Artworks from Global Artists",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
        
          <Navbar /> 
          <main className="min-h-[calc(100vh-16rem)]">
            {children}
          </main>
          
          <Footer />
        
      </body>
    </html>
  );
}