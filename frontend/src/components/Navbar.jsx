import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  RefreshCw,
  User,
  LogIn,
  Settings,
  LogOut,
  Info,
  Phone,
  ChevronDown,
  ChevronUp,
  KeyIcon,
  Package,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector(".mobile-sidebar");
      const desktopMenu = document.querySelector(".desktop-menu");

      if (sidebar && !sidebar.contains(event.target)) {
        setIsMobileSidebarOpen(false);
      }

      if (desktopMenu && !desktopMenu.contains(event.target)) {
        // Check if we're clicking on the menu button
        const menuButton = document.querySelector(".desktop-menu-button");
        if (!menuButton?.contains(event.target)) {
          setIsDesktopMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileSidebarOpen, isDesktopMenuOpen]);

  // Handle refresh button click
  const handleRefresh = () => {
    window.location.reload();
  };

  // Modified NavLink component to close both sidebars when clicked
  const NavLink = ({ to, icon, text, onClick }) => (
    <Link
      to={to}
      className="text-gray-800 hover:text-orange-500 flex items-center p-2 rounded hover:bg-orange-50 transition-colors duration-200"
      onClick={() => {
        setIsMobileSidebarOpen(false); // Close mobile sidebar
        setIsDesktopMenuOpen(false); // Close desktop menu
        onClick?.(); // Call any additional onClick handler
      }}
    >
      <span className="mr-3 text-orange-500">{icon}</span>
      <span className="font-medium">{text}</span>
    </Link>
  );

  return (
    <nav className="bg-orange-500 text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Left side - Logo and Name */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/hut.png"
              alt="HUT Logo"
              className="h-10 w-10 rounded-full"
            />
            <span className="text-2xl font-bold">HUT</span>
          </Link>

          {/* Right side - Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="hover:text-orange-200 transition-colors duration-200"
              onClick={() => setIsDesktopMenuOpen(false)} // Close desktop menu when clicked
            >
              Home
            </Link>
            <Link
              to="/go-to-hut"
              className="hover:text-orange-200 transition-colors duration-200"
              onClick={() => setIsDesktopMenuOpen(false)} // Close desktop menu when clicked
            >
              Order
            </Link>
            <Link
              to="/about"
              className="hover:text-orange-200 transition-colors duration-200"
              onClick={() => setIsDesktopMenuOpen(false)} // Close desktop menu when clicked
            >
              About
            </Link>
            <button
              onClick={handleRefresh}
              className="hover:text-orange-200 transition-colors duration-200 flex items-center"
            >
              <RefreshCw className="h-5 w-5 mr-1" /> Refresh
            </button>
            <button
              onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
              className="text-white hover:text-orange-200 transition-colors duration-200 flex items-center space-x-1 desktop-menu-button"
            >
              <span>Menu</span>
              {isDesktopMenuOpen ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Navigation (Icons only) */}
          <div className="flex md:hidden items-center space-x-4">
            <Link
              to="/"
              className="hover:text-orange-200 transition"
              onClick={() => setIsMobileSidebarOpen(false)} // Close mobile sidebar when clicked
            >
              <Home className="h-6 w-6" />
            </Link>
            <button
              onClick={handleRefresh}
              className="hover:text-orange-200 transition"
            >
              <RefreshCw className="h-6 w-6" />
            </button>
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="text-white focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Menu Dropdown */}
      <div
        className={`hidden md:block absolute right-4 mt-1 w-56 bg-white rounded-md shadow-xl z-50 desktop-menu transition-all duration-300 ease-out ${
          isDesktopMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="py-2">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Navigation
          </div>
          <NavLink to="/go-to-hut" icon={<Package size={18} />} text="Order" />
          <NavLink to="/about" icon={<Info size={18} />} text="About" />
          <NavLink to="/contact" icon={<Phone size={18} />} text="Contact" />
          <button
            onClick={() => {
              handleRefresh();
              setIsDesktopMenuOpen(false); // Close desktop menu when clicked
            }}
            className="w-full text-gray-800 hover:text-orange-500 flex items-center p-2 rounded hover:bg-orange-50 transition-colors duration-200"
          >
            <RefreshCw size={18} className="mr-3 text-orange-500" />
            <span className="font-medium">Refresh</span>
          </button>

          <div className="border-t border-gray-100 my-2"></div>

          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Account
          </div>
          {!authUser && (
            <NavLink
              to="/register"
              icon={<LogIn size={18} />}
              text="Create account"
            />
          )}

          <NavLink to="/profile" icon={<User size={18} />} text="Profile" />
          <NavLink
            to="/settings"
            icon={<Settings size={18} />}
            text="Settings"
          />

          {authUser && !authUser.role === "shop-owner" && (
            <NavLink
              to={`/shop-ownership-request`}
              icon={<KeyIcon size={18} />}
              text="Open Your Shop"
            />
          )}

          {authUser && authUser.role === "admin" && (
            <NavLink
              to="/get-shop-ownership-request"
              icon={<KeyIcon size={18} />}
              text="Admin Dashboard"
            />
          )}

          {authUser && authUser.role === "shop-owner" && (
            <NavLink
              to="/owner-dashboard"
              icon={<KeyIcon size={18} />}
              text="Your shop"
            />
          )}

          <button
            onClick={() => {
              logout(navigate);
              setIsDesktopMenuOpen(false); // Close desktop menu when clicked
            }}
            className="w-full text-gray-800 hover:text-orange-500 flex items-center p-2 rounded hover:bg-orange-50 transition-colors duration-200"
          >
            <LogOut size={18} className="mr-3 text-orange-500" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar with transition */}
      <div
        className={`fixed inset-0 z-50 overflow-y-auto md:hidden transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {isMobileSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl mobile-sidebar">
              <div className="flex justify-between items-center p-4 border-b">
                <Link
                  to="/"
                  className="flex items-center space-x-2"
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <img
                    src="/hut.png"
                    alt="HUT Logo"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-xl font-bold text-orange-500">HUT</span>
                </Link>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-4">
                <nav className="flex flex-col space-y-1">
                  <div className="px-2 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Navigation
                  </div>
                  <NavLink
                    to="/go-to-hut"
                    icon={<Package size={18} />}
                    text="Order"
                  />
                  <NavLink to="/about" icon={<Info size={18} />} text="About" />

                  <button
                    onClick={() => {
                      handleRefresh();
                      setIsMobileSidebarOpen(false);
                    }}
                    className="text-gray-800 hover:text-orange-500 flex items-center p-2 rounded hover:bg-orange-50 transition-colors duration-200"
                  >
                    <RefreshCw size={18} className="mr-3 text-orange-500" />
                    <span className="font-medium">Refresh</span>
                  </button>

                  <div className="border-t border-gray-100 my-2"></div>

                  <div className="px-2 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Account
                  </div>
                  {!authUser && (
                    <NavLink
                      to="/register"
                      icon={<LogIn size={18} />}
                      text="Create account"
                    />
                  )}

                  <NavLink
                    to="/profile"
                    icon={<User size={18} />}
                    text="Profile"
                  />
                  <NavLink
                    to="/settings"
                    icon={<Settings size={18} />}
                    text="Settings"
                  />

                  {authUser && !authUser.role === "shop-owner" && (
                    <NavLink
                      to={`/shop-ownership-request`}
                      icon={<KeyIcon size={18} />}
                      text="Open Your Shop"
                    />
                  )}

                  {authUser && authUser.role === "admin" && (
                    <NavLink
                      to="/get-shop-ownership-request"
                      icon={<KeyIcon size={18} />}
                      text="Admin Dashboard"
                    />
                  )}

                  {authUser && authUser.role === "shop-owner" && (
                    <NavLink
                      to="/owner-dashboard"
                      icon={<KeyIcon size={18} />}
                      text="Your shop"
                    />
                  )}

                  <button
                    onClick={() => {
                      logout(navigate);
                      setIsMobileSidebarOpen(false);
                    }}
                    className="text-gray-800 hover:text-orange-500 flex items-center p-2 rounded hover:bg-orange-50 transition-colors duration-200"
                  >
                    <LogOut size={18} className="mr-3 text-orange-500" />
                    <span className="font-medium">Logout</span>
                  </button>
                </nav>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
