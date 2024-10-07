import { RouterProvider } from "react-router-dom";
import "./App.css";
import AppRouter from "./router/AppRouter";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { currentUser } from "./store/slices/authSlice";

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      console.log("Checking token:", token);

      if (token) {
        try {
          await dispatch(currentUser());
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }

      setIsLoading(false);
    };

    fetchUser();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="">
        <div className="flex space-y-6 flex-col justify-center items-center bg-white h-screen dark:invert">
          <h3 className="text-2xl font-bold text-black/70">Welcome back :)</h3>
          <div className="flex space-x-2 justify-center items-center">
            <div className="h-4 w-4 bg-black/80 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-4 w-4 bg-black/80 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-4 w-4 bg-black/80 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  }

  return <RouterProvider router={AppRouter} />;
}
export default App;
