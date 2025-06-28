import "bootstrap/dist/css/bootstrap.min.css"; // bootstrap CSS
import "./globals.css";
import "../scss/style.scss";
import "primereact/resources/themes/saga-blue/theme.css"; // Choose your theme
import "primereact/resources/primereact.min.css"; // PrimeReact CSS
import "primeicons/primeicons.css"; // PrimeIcons CSS
import ThemeProvider from "@/context/ThemeProvider";
import dynamic from "next/dynamic";

export const metadata = {
  title: "Yashoda Healthcare",
  description: "Yashoda Healthcare",
  keywords: [
    "Hospitals",
    "Patients",
    "Surgeries",
    "Doctors",
    "Medicine"
  ],
  authors: [
    { name: "Yashoda Healthcare" },
    { name: "Yashoda Healthcare", url: "https://yashodahealthcare.com/" },
  ],
  creator: "Yashoda Healthcare",
  publisher: "Yashoda Healthcare",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.png", // icon
    shortcut: "/favicon.png", // shortcut-icon
    apple: "/favicon.png", // apple-icon
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/favicon.png", //apple-touch-icon-precomposed
    },
  },
  verification: {
    google: "google",
    yandex: "yandex",
    yahoo: "yahoo",
    other: {
      me: ["info@movietimecinemas.in", "https://movietimecinemas.in/"],
    },
  },
  category: "Healthcare",
  openGraph: {
    title: "Yashoda Healthcare",
    description: "Yashoda Healthcare",
  },
};

const Navbar = dynamic(() => import("@/components/Navbar"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Navbar />
          <div style={{ position: "relative", top: "7rem" }}>
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
