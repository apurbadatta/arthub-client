import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/shared/LayoutWrapper";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ArtHub | Online Art Marketplace",
  description: "Discover & Buy Original Artworks from Global Artists",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}