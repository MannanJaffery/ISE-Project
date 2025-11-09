import { useEffect, useState } from "react";
import { Menu, X , ChevronDown} from "lucide-react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [openTools, setOpenTools] = useState(false);



  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "FAQ", href: "#faq" },
    { name: "Pricing", href: "#pricing" },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setMenuOpen(false);
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <nav className="w-full z-50 fixed top-0 left-0 bg-white/80 backdrop-blur-md border-b shadow-sm h-16 items-center ">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-full">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img
            src="./Bloomqueue_Logo_V2.png"
            alt="Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="text-2xl font-bold ml-2">
            Bloom<span className="text-[#46AA72]">Queue</span>
          </span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-8 text-sm font-medium">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a href={link.href} className="hover:text-green-600 transition">
                {link.name}
              </a>
            </li>
          ))}


    

          {user && (
            <a
              href={`/dashboard/${user.uid}`}
              className="hover:text-green-600 transition"
            >
              Dashboard
            </a>
          )}
          
<li className="relative">
      {/* Button to toggle dropdown */}
      <button
        onClick={() => setOpenTools(!openTools)}
        className="flex items-center hover:text-green-600 transition text-sm font-medium"
      >
        Tools
        <ChevronDown
          size={16}
          className={`ml-1 transition-transform duration-300 ${
            openTools ? "rotate-180 text-green-600" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {openTools && (
        <ul
          className="absolute right-0 mt-3 w-60 rounded-xl bg-white/95 backdrop-blur-lg shadow-lg 
                     p-4 space-y-3 border border-gray-100 animate-dropdown"
        >
          <li>
            <a
              href="/idea-validator"
              className="block text-gray-800 font-medium hover:text-green-600 transition"
            >
              Idea Ranker
            </a>
          </li>
          <li>
            <a
              href="/competitor-finder"
              className="block text-gray-800 font-medium hover:text-green-600 transition"
            >
              Competitor Finder
            </a>
          </li>
          <li>
            <a
              href="/market-size-estimate"
              className="block text-gray-800 font-medium hover:text-green-600 transition"
            >
              Market Size Estimator
            </a>
          </li>
        </ul>
      )}

      <style jsx>{`
        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-dropdown {
          animation: dropdownFade 0.25s ease-out;
        }
      `}</style>
    </li>



        </ul>

        {/* Desktop Auth Button */}
        <div className="hidden md:block">
          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors bg-gray-50 text-gray-700 hover:bg-gray-100"
            >
              Sign Out
            </button>
          ) : (
            <a
              href="/login"
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors bg-gray-50 text-gray-700 hover:bg-gray-100"
            >
              Login
            </a>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden animate-slideDown">
          <div className="bg-white/95 backdrop-blur-lg shadow-lg p-6 space-y-4">
            <ul className="space-y-4 text-sm font-medium">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block hover:text-green-600 transition"
                  >
                    {link.name}
                  </a>
                </li>
              ))}


              {user && (
                <li>
                  <a
                    href={`/dashboard/${user.uid}`}
                    onClick={() => setMenuOpen(false)}
                    className="block hover:text-green-600 transition"
                  >
                    Dashboard
                  </a>
                </li>
              )}

               <li className="border-t border-gray-100 pt-3">
     
      <button
        onClick={() => setOpenTools(!openTools)}
        className="w-full flex items-center justify-between text-gray-800 font-semibold hover:text-green-600 transition"
      >
        <span>Tools</span>
        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${
            openTools ? "rotate-180 text-green-600" : ""
          }`}
        />
      </button>
{openTools && (
  <ul
    className="mt-3 pl-3 space-y-3 p-4 animate-fade"
  >
    <li>
      <a
        href="/idea-validator"
        className="block text-gray-700 font-medium hover:text-green-600 transition"
      >
        Idea Ranker
      </a>
    </li>
    <li>
      <a
        href="/competitor-finder"
        className="block text-gray-700 font-medium hover:text-green-600 transition"
      >
        Competitor Finder
      </a>
    </li>
    <li>
      <a
        href="/market-size-estimate"
        className="block text-gray-700 font-medium hover:text-green-600 transition"
      >
        Market Size Estimator
      </a>
    </li>
  </ul>
)}

<style jsx>{`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade {
    animation: fadeIn 0.25s ease-out;
  }
`}</style>
</li>

              <li>
                {user ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left font-bold text-gray-800 hover:text-green-600 transition"
                  >
                    Sign Out
                  </button>
                ) : (
                  <a
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block font-bold text-gray-800 hover:text-green-600 transition"
                  >
                    Login
                  </a>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Slide-down animation */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.25s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
