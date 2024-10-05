import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { Toaster } from "sonner";

const DefaultLayout = () => {
  return (
    <main className="bg-gray-100 min-h-screen">
      <Toaster
        position="bottom-right"
        closeButton
        richColors
        toastOptions={{
          style: {
            minWidth: "200px",
            maxWidth: "400px",
            padding: "12px 16px",
          },
          duration: 5000,
        }}
      />
      <NavBar />
      <Outlet />
    </main>
  );
};

export default DefaultLayout;
