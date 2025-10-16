import Register from "./pages/authentication/register";
import Login from "./pages/authentication/login";
import { AuthProvider } from "./context/authContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage";
import Changepassword from "./pages/authentication/changepassword";
import ForgotPasswordPage from "./pages/authentication/forgetpassword";

function App() {
  return ( 
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/change-password" element={<Changepassword />} />
          <Route path="/forget-password" element={<ForgotPasswordPage />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
