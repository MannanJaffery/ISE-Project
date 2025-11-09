import { Twitter, Linkedin, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-10 md:px-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-white">BloomQueue</h2>
          <p className="text-sm mt-2 text-gray-400">
            Validate the actual paying users before even building your product.
          </p>
        </div>

        {/* Tools */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Tools</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <button 
                onClick={() => navigate('/idea-validator')} 
                className="hover:text-white text-left"
              >
                Idea Ranker
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/competitor-finder')} 
                className="hover:text-white text-left"
              >
                Competitor Finder
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/market-size-estimate')} 
                className="hover:text-white text-left"
              >
                Market Size Estimator
              </button>
            </li>
          </ul>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#features" className="hover:text-white">Features</a></li>
            <li><a href="#faq" className="hover:text-white">FAQ</a></li>
            <li><a href="#contact" className="hover:text-white">Contact</a></li>
            <li><a href="#signup" className="hover:text-white">Sign Up</a></li>
            <li>
              <a 
                href="BloomQueue_Terms_of_Service.pdf" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white"
              >
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Social & Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
          <div className="flex gap-5 text-xl">
            <a 
              href="https://twitter.com/yourhandle" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-white"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a href="mailto:yourname@gmail.com" className="hover:text-white">
              <Mail className="w-5 h-5" />
            </a>
            <a 
              href="https://linkedin.com/in/yourprofile" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-white"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} BloomQueue. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;


