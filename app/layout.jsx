import './globals.css';

export const metadata = {
  title: "Healthcare Translation App",
  description: "Real-time speech translation prototype for healthcare encounters",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
