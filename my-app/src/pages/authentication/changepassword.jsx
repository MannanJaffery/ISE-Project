import { useState, useEffect } from "react";

import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { auth } from '../../firebase';


const Changepassword = () => {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [provider, setProvider] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setProvider(user.providerData[0]?.providerId);
    }
  }, []);

  const changepass = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      alert("User must be logged in to change the password");
      navigate("/login");
      return;
    }

    try {
      
      const credential = EmailAuthProvider.credential(user.email, currentPass);
      await reauthenticateWithCredential(user, credential);

      //Then update to the new password
      await updatePassword(user, newPass);
      alert("Password updated successfully!");
      navigate("/");
    } catch (err) {
      console.log("Error:", err.message);
      alert("Invalid Credentials");
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50">

        <div className="flex-1 flex items-center justify-center px-4">
          {provider === "password" ? (
            <form
              onSubmit={changepass}
              className="flex flex-col gap-4 w-11/12 max-w-md p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-lg"
            >
              <h2 className="text-2xl font-semibold text-center text-blue-800">
                Change Password
              </h2>

              <input
                type="password"
                placeholder="Current Password"
                onChange={(e) => setCurrentPass(e.target.value)}
                required
                className="p-2 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />

              <input
                type="password"
                placeholder="New Password"
                onChange={(e) => setNewPass(e.target.value)}
                required
                className="p-2 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />

              <button
                type="submit"
                className="bg-blue-800 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300"
              >
                Change Password
              </button>
            </form>
          ) : provider === "google.com" ? (
            <div className="text-center bg-white p-6 border rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                Google Account Password
              </h2>
              <p className="mb-4">
                You signed in with <strong>Google</strong>. Your password is
                managed through Google, not this app.
              </p>
              <a
                href="https://myaccount.google.com/security"
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-lg transition duration-300"
              >
                Change Password on Google
              </a>
            </div>
          ) : (
            <h1>Loading.....</h1>
          )}
        </div>

      </div>
    </>
  );
};

export default Changepassword;