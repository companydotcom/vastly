"use client";
import { UiProvider } from "@vastly/ui";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UiProvider>
          {children}
        </UiProvider>
        </body>
    </html>
  );
}
