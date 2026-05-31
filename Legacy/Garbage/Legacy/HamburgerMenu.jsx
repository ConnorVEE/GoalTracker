import { useState, useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function HamburgerMenu() {
  const { logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="fixed top-4 left-4 z-50">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="p-2 bg-purple-500 rounded-md text-white hover:bg-purple-600 transition"
      >
        {/* Hamburger Icon (3 bars) */}
        <div className="space-y-1">
          {/* <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span> */}

          <motion.span
            animate={isOpen ? { rotate: 45, x: 4, y: -2.5} : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-white origin-left"
          />
          <motion.span
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="block w-6 h-0.5 bg-white"
          />
          <motion.span
            animate={isOpen ? { rotate: -45, x: 4, y: 2.5} : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-white origin-left"
          />
        </div>

      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 w-28 bg-white rounded-md shadow-lg border border-purple-200"
          >
            <div className="flex flex-col">
              {["Home", "Tasks", "Goals"].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase() === "home" ? "home" : item.toLowerCase()}`}
                  className="w-auto text-center px-3 py-2 text-purple-900 font-semibold hover:bg-purple-300 hover:text-purple-900 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              ))}

              <hr className="border-t border-purple-300" />
              <button
                className="w-auto text-center px-3 py-2 text-red-600 font-semibold hover:bg-red-200 hover:text-red-800 transition-colors duration-200"
                onClick={() => {
                  logout();
                  console.log("User logged out");
                  setIsOpen(false);
                }}
              >
                Logout
              </button>

            </div>


          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}