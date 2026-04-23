
import { Outlet } from "react-router-dom";
import bgImage from "../../assets/images/AuthLayout/pg.jpg";
import Navbarui from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbarui />
      <main className="flex flex-1 flex-col lg:flex-row">
        <div className="hidden lg:block lg:w-1/2">
          <img src={bgImage} alt="dogs" className="w-full h-full object-cover object-center" />
        </div>
        <div className="lg:hidden h-64 sm:h-72">
          <img src={bgImage} alt="dogs" className="w-full h-full object-cover object-center" />
        </div>
        <div className="flex-1 flex items-center justify-center bg-gray-50 px-5 py-10">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}