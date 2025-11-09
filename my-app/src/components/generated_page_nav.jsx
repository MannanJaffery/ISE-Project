import { useState } from "react";
import { Menu, X } from "lucide-react";

const Generated_Page_Nav = ({ makesidebarshow,setPreview,handlePublishButton }) => {
  const [menuOpen, setMenuOpen] = useState(false);   

  return (
    <nav className="w-full z-50 fixed top-0 left-0 bg-white/80 backdrop-blur-md border-b shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold">
          Bloom<span className="text-blue-600">Queue</span>
        </a>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-sm font-medium">
          <li>
            <button
              onClick={() => makesidebarshow(true)}
              className="hover:text-blue-600 transition"
            >
              Edit
            </button>
          </li>
          <li>
            <button className="hover:text-blue-600 transition" onClick={()=>{
                setPreview(true);
            }}>
              Preview
            </button>
          </li>
        </ul>

        {/* Desktop Button */}
        <div className="hidden md:block">
          <button className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors bg-blue-500 text-white hover:bg-blue-400" 
          onClick={handlePublishButton}>
            Publish
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <ul className="space-y-4 text-sm font-medium">
            <li>
              <button
                onClick={() => {
                  makesidebarshow(true);
                  setMenuOpen(false);
                }}
                className="block w-full text-left hover:text-blue-600 transition"
              >
                Edit
              </button>
            </li>
            <li>
              <button
                onClick={() => {setMenuOpen(false)
                    setPreview(true);
                }}
                className="block w-full text-left hover:text-blue-600 transition"

              >
                Preview
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                    handlePublishButton();
                    setMenuOpen(false)}}
                className="block w-full text-left font-bold text-black hover:text-blue-600 transition"

              >
                Publish
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Generated_Page_Nav;
