import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/ui/ToastProvider";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "PizzaHub — Hot & Fresh Pizza Ordering & Delivery",
  description:
    "Order handcrafted, stone-baked pizzas, sides, and artisan desserts from premier local pizzerias with fast home delivery.",
  keywords: "pizza, pizza delivery, online ordering, artisan pizza, pepperoni, wood fired pizza",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={plusJakarta.variable} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)] font-sans selection:bg-[var(--brand-primary)] selection:text-white">
        <AuthProvider>
          <ToastProvider />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
