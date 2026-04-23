
import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Navbarui from "../../components/Navbar/Navbar";

export default function MainLayout() {
  return (
    <>
      <Navbarui />
      <Outlet />
      <Footer />
    </>
  );
}