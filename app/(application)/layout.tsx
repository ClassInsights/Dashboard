import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="h-16 w-full" />
      {children}
      <div className="h-40 w-full" />
      <Footer />
    </>
  );
}
