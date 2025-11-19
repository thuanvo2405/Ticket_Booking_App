import { Outlet } from "react-router-dom";
import Header from "../header";
import Footer from "../footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
