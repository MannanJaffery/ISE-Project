
import { useNavigate } from "react-router-dom";

import { 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  Zap, 
  Brush, 
  LayoutGrid, 
  Shield, 
  Settings, 
  Users, 
  TrendingUp 
} from "lucide-react";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

import { getFunctions , httpsCallable } from 'firebase/functions';
import { app } from '../firebase';
import { auth } from "../firebase";


export default function MainContent({
  showsidebar,
  isMobile,
  preview,
  setPreview,
  editmaintitle,
  editsubtitle,
  handleGoogleSignup,
  benefits,
  parsedResponse,
  productName,
  features,
  featuresexplanation,
  whyuseline,
  whyusepoints,
  pageid,
  isPreview,
}) {

const user = auth.currentUser;
const navigate = useNavigate();


  useEffect(()=>{

    console.log("page id from main content component:",pageid);

  },[pageid])





const handleSubscribeConnectedAccount = async () => { 
  try {
    const functions = getFunctions(app);
    const createConnectedAccountCheckout = httpsCallable(functions, "createConnectedAccountCheckout");
    const result = await createConnectedAccountCheckout(pageid);
    window.location.href = result.data.url;
  } catch (error) {
    console.error("Error creating checkout session:", error);
  }
};



  return (
    <main className={`flex-1 overflow-hidden ${showsidebar&&!isMobile ? 'ml-[250px]':''}`}>
      {/* Hero Section */}
      <section className={`relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden`}>
        {!showsidebar && preview && (
          <div
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-md bg-white text-gray-500 hover:text-gray-700 shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 z-50 border border-gray-200"
            onClick={() => setPreview(false)}
          >
            <EyeOff className="w-5 h-5" />
          </div>
        )}

        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl"></div>
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-xs mb-8 hover:shadow-sm transition-shadow duration-200">
              <span className="text-sm font-medium text-gray-700 tracking-wider">✨ EXCLUSIVE EARLY ACCESS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {editmaintitle}
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-full mx-auto leading-relaxed font-normal">
              {editsubtitle}
            </p>

            {/* CTA Container */}
            <div className="bg-blue-50/50 p-6 sm:p-8 rounded-2xl backdrop-blur-sm border border-blue-100/50 max-w-md lg:max-w-[640px] mx-auto md:max-w-[540px]">
              {/* Google Sign-in Button */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">Get early access updates</p>
                <button 
                  onClick={handleGoogleSignup}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <FcGoogle className="w-5 h-5" />
                  <span>Join the Free Waitlist</span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300/80"></div>
                <span className="mx-4 text-sm text-gray-500">OR</span>
                <div className="flex-grow border-t border-gray-300/80"></div>
              </div>

              {/* Reserve Button */}
              <div className="relative group">
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-50 blur-sm group-hover:opacity-75 transition-all duration-300"></div>
                <button className="relative w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-0.5"
                onClick={handleSubscribeConnectedAccount}>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">Become an Early Supporter for $5</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </button>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {benefits.map((item, index) => (
                  <div key={index} className="bg-white/90 p-3 rounded-lg border border-gray-200/50 shadow-xs">
                    <div className="text-lg sm:text-xl font-bold text-blue-600">{item.title}</div>
                    <div className="text-xs text-gray-600">{item.subtitle}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mt-12">
              <div className="flex flex-wrap gap-2 justify-center z-10 mt-4 px-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md border border-green-200 bg-green-50 text-green-500 text-sm font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  Secure reservation
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md border border-blue-200 bg-blue-50 text-blue-500 text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  Limited availability
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md border border-purple-200 bg-purple-50 text-purple-500 text-sm font-medium">
                  <CreditCard className="w-4 h-4" />
                  No payment required
                </span>
              </div>

              <p className="mt-4 text-xs text-gray-500 tracking-wide">
                Cancel anytime • Data secured with 256-bit encryption
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>


      {!user && isPreview && (
  <div className="bg-[#F0F6FB] border border-[#D6E4F0] text-center py-8 px-6 mb-8 rounded-2xl shadow-sm">
    <h2 className="text-2xl font-bold text-[#003F2F]">
      Your waitlist is ready — now unlock the full experience!
    </h2>
    <p className="text-gray-700 mt-3 text-lg">
      Sign up to preview your full page and see how it converts.
    </p>

    <div className="mt-6 flex flex-col  justify-center items-center gap-4">
      <button
        className="bg-[#46AA72] text-white w-64 px-6 py-3 rounded-xl font-semibold hover:bg-[#3d9564] transition"
        onClick={() => navigate("/register")}
      >
        Create Free Account
      </button>

      
      <p className="text-gray-700">
        Already have an account?{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-[#003F2F] font-medium hover:underline"
        >
          Log In
        </button>
      </p>
    </div>
  </div>
)}



      {/* Features Section */}
<section
  className={`py-20 bg-gray-50 ${(!showsidebar && user) ? "section1" : ""} ${
    !user && isPreview ? "blur-md pointer-events-none select-none" : ""
  }`}
>



  

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Features and Benefits
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Crafted to Perform Flawlessly. Built to Help You Achieve More
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features?.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 border border-gray-200 hover:border-blue-100 transition-all duration-300 hover:shadow-lg"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${
                  index % 6 === 0 ? 'bg-blue-50 text-blue-600' :
                  index % 6 === 1 ? 'bg-purple-50 text-purple-600' :
                  index % 6 === 2 ? 'bg-red-50 text-red-600' :
                  index % 6 === 3 ? 'bg-cyan-50 text-cyan-600' :
                  index % 6 === 4 ? 'bg-green-50 text-green-600' :
                  'bg-yellow-50 text-yellow-600'
                }`}>
                  {index % 6 === 0 && <Zap className="w-6 h-6" />}
                  {index % 6 === 1 && <CreditCard className="w-6 h-6" />}
                  {index % 6 === 2 && <Brush className="w-6 h-6" />}
                  {index % 6 === 3 && <LayoutGrid className="w-6 h-6" />}
                  {index % 6 === 4 && <Shield className="w-6 h-6" />}
                  {index % 6 === 5 && <Settings className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {featuresexplanation[index]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Use Section */}
<section
  className={`w-full bg-[#F9F9FA] py-20 px-6 md:px-20${(!showsidebar && user) ? "section1" : ""} ${
    !user && isPreview ? "blur-md pointer-events-none select-none" : ""
  }`}
>
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-900 leading-tight">
      Why Use{" "}
      <span className="text-blue-600 font-medium">{productName}</span>?
    </h2>
    <p className="text-gray-600 text-lg md:text-xl mb-16 max-w-2xl mx-auto leading-relaxed">
      {whyuseline || "The smarter way to validate your idea"}
    </p>

    <div className="grid md:grid-cols-2 gap-12 text-left max-w-7xl mx-auto">
      {whyusepoints.map((point, index) => {
        // Optional: choose icon & color per index
        const icons = [
          { icon: Zap, color: "text-blue-600" },
          { icon: Users, color: "text-green-600" },
          { icon: Clock, color: "text-amber-600" },
          { icon: TrendingUp, color: "text-purple-600" },
        ];
        const IconComponent = icons[index % icons.length].icon;
        const iconColor = icons[index % icons.length].color;

        return (
          <div
            key={index}
            className="flex items-start gap-6 p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex-shrink-0">
              <IconComponent className={`${iconColor} w-5 h-5 mt-1`} />
            </div>
            <div>
              <p className="text-lg text-gray-700 leading-relaxed">
                {point || ""}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>


      {/* CTA Section */}
      <section className={`w-full bg-white py-20 px-4 sm:px-6 ${(!showsidebar && user) ? "section1" : ""} ${
    !user && isPreview ? "blur-md pointer-events-none select-none" : ""
  } `}>
        <div className="max-w-4xl mx-auto rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 sm:p-12 border border-gray-200/50 shadow-sm">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Secure Your Advantage
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Early adopters get <span className="font-semibold text-blue-600">exclusive pricing</span> and <span className="font-semibold text-purple-600">priority access</span>
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-6">
            {/* Google Early Access Sign-In */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-3">Get early access updates</p>
              <button 
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <FcGoogle className="w-5 h-5" />
                <span>Join the Free Waitlist</span>
              </button>
            </div>

            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-sm text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            
            {/* Main Reserve Now Button */}
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-75 blur-sm group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
              <button className="relative w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-0.5"
              onClick={handleSubscribeConnectedAccount}>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">Become an Early Supporter for $5</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 text-center">
              {benefits.map((item, index) => (
                <div key={index} className="bg-white/90 p-3 rounded-lg border border-gray-200/50">
                  <div className="text-xl font-bold text-blue-600">{item.title}</div>
                  <div className="text-xs text-gray-600">{item.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}