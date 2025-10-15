import { useState } from "react";
import { auth , googleprovider } from "../../firebase";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { db } from "../../firebase";

import { doc , getDoc , setDoc  } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import PasswordInput from "../../components/passwordInput";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";


const Login = () => {

    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(false);


  const [showemailverification , setShowEmailVerification] = useState(false);



  const handleResendVerificationEmail = async ()=>{
    const user = auth.currentUser;;

    if(!user) 
      {toast.error("Kindly LogIn first");
        return}

    if(user && !user.emailVerified){
      await sendEmailVerification(user);
      toast.success("Email Sent , Kindly Check Inbox or spam")
    }

  }
  

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;

      await user.reload();
      if(!user.emailVerified){
        setShowEmailVerification(true);
        return;
      }else{
      navigate('/');
    }
    } catch (err) {
      console.error("Email login error:", err);

      if(err.code=='auth/invalid-credential')
      {
        setInvalid(true);
      }
    } finally {
      setLoading(false);
    }
  };


const handleGoogleSignIn = async () => {
  try {
    setLoading(true);
    const result = await signInWithPopup(auth, googleprovider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists() || !userSnap.data().username) {
      const name = user.displayName;

      await setDoc(userRef, {
        email: user.email,
        username: name,
        emailVerified: true,
        plan:{
          active:false,
          planType:"free",
        },
        createdAt: new Date(),
      },{merge:true});
    }

    console.log("Signed in with Google:", user.email);
    navigate('/');
  } catch (error) {
    console.error("Google sign-in error:", error.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      
      <div className=" w-[430px] h-[510px] max-w-md p-6 bg-white shadow-lg rounded-2xl">
        
        <h2 className="text-xl font-semibold text-center mb-1">
          Sign In to Build Your Waitlist Now
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Welcome back! Please sign in to continue
        </p>


        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          <FcGoogle size={20} />
          <span className="font-medium text-sm text-gray-700">
            {loading ? "Signing in..." : "Continue with Google"}
          </span>
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <hr className="flex-grow border-gray-300" />
          or
          <hr className="flex-grow border-gray-300" />
        </div>

<form onSubmit={handleEmailLogin} className="space-y-4">
  <div>
    <label className="block text-sm mb-1 font-medium text-gray-700">
      Email address
    </label>
    <input
      type="email"
      placeholder="Enter your email address"
      value={email}
      onChange={(e) => {setEmail(e.target.value)
        setInvalid(false);
      }}
      required
      disabled={loading}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm disabled:opacity-50"
    />
  </div>

  <div>
    <label className="block text-sm mb-1 font-medium text-gray-700">
      Password
    </label>
    <PasswordInput
      value={password}
      onChange={(e) => {setPassword(e.target.value)
        setInvalid(false);
      }}
      placeholder="Enter your password"
      disabled={loading}
    />
  </div>

  {invalid && (
    <div className="flex justify-center">
      <div className="w-full max-w-md bg-red-50 border border-red-200 text-red-700 rounded-md p-3 text-sm shadow-sm flex items-start space-x-2">
<AlertCircle className="h-5 w-5 text-red-500" />
        <p>Invalid credentials, Please try again.</p>
      </div>
    </div>
  )}


{showemailverification && (
  <div className="flex justify-center">
    <div className="w-full max-w-md bg-red-50 border border-red-200 text-red-700 rounded-md p-3 text-sm shadow-sm flex items-start space-x-3">
      <AlertCircle className="h-5 w-5 text-red-500 mt-1" />

      <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <p className="text-sm">Kindly verify your email.</p>

        <button
          onClick={handleResendVerificationEmail}
          className="text-sm text-gray-600 hover:underline font-medium"
        >
          Resend Link
        </button>
      </div>
    </div>
  </div>
)}

  <button
    type="submit"
    disabled={loading}
    className="w-full bg-[#46AA72] text-white py-2 rounded-lg hover:bg-[hsl(146,42%,57%)] font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? "Logging in..." : "Continue"}
  </button>
</form>

<div className="mt-6 flex justify-between text-sm text-gray-600">
  <div>
    No account ? {" "}
    <a
      href="/register"
      className="text-[#46AA72] hover:underline font-medium"
    >
      Sign up
    </a>
  </div>
  <a
    href="/forget-password"
    className="text-[#46AA72] hover:underline font-medium"
  >
    Forgot password?
  </a>
</div>

      </div>
    </div>
  );
};

export default Login;
