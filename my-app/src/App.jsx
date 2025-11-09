import Register from "./pages/authentication/register";
import Login from "./pages/authentication/login";
import { AuthProvider } from "./context/authContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage";
import Changepassword from "./pages/authentication/changepassword";
import ForgotPasswordPage from "./pages/authentication/forgetpassword";
import ProtectedRoute from "./components/protectedRoute";

import Dashboard from "./pages/dashboard";
import PreviewandEdit from "./pages/previewandedit";
import ProductPage from "./pages/productpage";



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
          <Route path = "/dashboard/:id" element = {
              <ProtectedRoute>
              <Dashboard />
              </ProtectedRoute>}/>

              <Route path="/:username/:productname/preview+edit" element={
                
              <PreviewandEdit/>

              }/>
              

              <Route path="/:username/:productname" element={
              <ProductPage/>
              
              }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
