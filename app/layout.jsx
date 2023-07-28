import "../styles/globals.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer"
import { ReduxProvider } from "./lib/features/provider";

export const metadata = {
  title: "Givingly",
  description: "Generated by create next app",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className="body-text body-bg">
        <ReduxProvider>
          <Navbar />
          {children}
          <Footer/>
        </ReduxProvider>
      </body>
    </html>
  );
};

export default RootLayout;
