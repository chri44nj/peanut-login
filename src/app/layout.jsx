import "./globals.css";

import Contexts from "./components/Contexts";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Body from "./components/Body";
import { AuthProvider } from "./Providers";

export const metadata = {
  title: "Planet Peanut",
  description: "Planet Peanut gør matematik til en sjov og social oplevelse. Download appen nu og vær med til at udrydde matematikangst!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="dk">
      {/*   <Contexts>
        <AuthProvider>
          <Body>
            <Header />
            {children}
            <Footer />
          </Body>
        </AuthProvider>
      </Contexts> */}
      <div>Under maintenance</div>
    </html>
  );
}
