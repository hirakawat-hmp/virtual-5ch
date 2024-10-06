import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from 'next-themes';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="bg-background text-foreground transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="container mx-auto mt-8 px-4">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}