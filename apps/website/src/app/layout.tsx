import { Amplify } from "aws-amplify";
import { Inter } from "next/font/google";
import awsExports from "../aws-exports";
import "./globals.css";

Amplify.configure({ ...awsExports, ssr: true });

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
