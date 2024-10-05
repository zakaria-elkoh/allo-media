import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, LogOut, Menu, User, UserPlus } from "lucide-react";
import { logout } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    console.log("logout clicked");

    await dispatch(logout());
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl  mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="font-bold text-xl text-primary">
              Logo
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {/* {isLoggedIn ? ( */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <User className="mr-2 h-4 w-4" />
                  User
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() => console.log("Profile clicked")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <>
              <Link to={"/login"}>
                <Button variant="ghost">
                  <LogIn className="mr-2 h-4 w-4" />
                  Log in
                </Button>
              </Link>
              <Link to={"/signup"}>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </>
          </div>
          <div className="flex items-center sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <span className="sr-only">Open menu</span>
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuItem
                      onSelect={() => console.log("Profile clicked")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onSelect={handleLogin}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => navigate("/signup")}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
