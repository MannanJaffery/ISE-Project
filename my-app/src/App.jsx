import Register from "./pages/authentication/register";
import Login from "./pages/authentication/login";
import { AuthProvider } from "./context/authContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage";

function App() {
  return ( 
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
