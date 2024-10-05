import { RouterProvider } from "react-router-dom";
import "./App.css";
import AppRouter from "./router/AppRouter";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { useEffect } from "react";
import { currentUser } from "./store/slices/authSlice";

function App() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(
      "kandiro check ghi sbor a bro, token::",
      localStorage.getItem("token")
    );
    if (localStorage.getItem("token")) {
      dispatch(currentUser());
    }
  }, [dispatch]);

  return <RouterProvider router={AppRouter} />;
}
export default App;
