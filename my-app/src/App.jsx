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

import { ProductsProvider } from "./context/productsContext";
import Subscribers from "./pages/Subscribers";

import Scoring_Tool from "./pages/tools/scoring_tools";
import CompetitorFinder from "./pages/tools/competetor_finder";
import MarketSizeEstimator from "./pages/tools/market_size_estimator";






function App() {
  return ( 
    <AuthProvider>

      <ProductsProvider>
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

               <Route path="/idea-validator" element={<Scoring_Tool/>}/>
              <Route path="/competitor-finder" element={<CompetitorFinder/>}/>
              <Route path="/market-size-estimate" element={<MarketSizeEstimator/>}/>
              

              <Route path="/:username/:productname" element={
              <ProductPage/>
              
              }/>


                          <Route path = "/subscribers/:userid" element = {
            <ProtectedRoute>
              <Subscribers />
            </ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>

      </ProductsProvider>
    </AuthProvider>
  );
}

export default App;
