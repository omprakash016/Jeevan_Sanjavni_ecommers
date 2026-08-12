import { Outlet } from "react-router-dom";
import Navbar from "../component/layout/Navbar";
import Footer from "../component/footer/Footer";
import FloatingButtons from "../component/floatingButtons/FloatingButtons";
import ScrollTop from "../component/scrollTop/ScrollTop";

const MainLayout = () => {
  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />

      <FloatingButtons />

      <ScrollTop />
    </>
  );
};

export default MainLayout;