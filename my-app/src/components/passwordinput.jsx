import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({ value, onChange, placeholder = "Password" }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
      />
      <div
        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
        onClick={() => setShow((prev) => !prev)}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </div>
    </div>
  );
};

export default PasswordInput;
