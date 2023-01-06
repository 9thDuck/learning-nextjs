import "../styles/globals.css";
import "../styles/general.sass";
import MainLayout from "../src/components/layouts/Main-layout";

export default function App({ Component, pageProps }) {
 return (
  <MainLayout>
   <Component {...pageProps} />
  </MainLayout>
 );
}
