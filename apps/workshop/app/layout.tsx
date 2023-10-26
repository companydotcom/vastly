import "./globals.css";

export const metadata = {
  title: "Vastly Workshop App",
  description: "Used to test stuff with NextJS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
