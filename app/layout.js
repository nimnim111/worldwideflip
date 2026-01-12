import "./globals.css";

export const metadata = {
  title: "Worldwide Flip",
  description: "Log backflips from around the globe and track your progress on an interactive map."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
