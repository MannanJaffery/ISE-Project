import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle , Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setIsSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => navigate('/login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 px-4">
      <div className="relative max-w-md w-full bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-purple-100">
        {isSuccess ? (
    <div className="text-center space-y-6">
      {/* Success Icon with Animation */}
      <div className="relative">
        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-lg ring-4 ring-green-50">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Header & Description */}
      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Check Your Email</h2>
        
        <p className="text-gray-700 max-w-sm mx-auto leading-relaxed">
          We've sent a secure password reset link to
        </p>
        
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 max-w-sm mx-auto">
          <div className="flex items-center justify-center gap-2">
            <Mail className="w-4 h-4 text-[#46AA72]" />
            <span className="font-semibold text-green-700 break-all text-sm">{email}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
          If you don't see it in your inbox, please check your{" "}
          <span className="font-semibold text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded">spam</span>{" "}
          or{" "}
          <span className="font-semibold text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded">junk</span>{" "}
          folder.
        </p>
      </div>

      {/* Security Notice */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-4 max-w-sm mx-auto">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Shield className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-900 mb-1">Security Notice</p>
            <p className="text-xs text-slate-700 leading-relaxed">
              This link expires in <span className="font-semibold">15 minutes</span> for your protection. 
              You can request a new one anytime from the login page.
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleBackToLogin}
        className="w-full bg-[#46AA72] hover:bg-[hsl(146,42%,57%)] text-white py-3.5 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl focus:ring-4 focus:ring-purple-300 focus:outline-none flex items-center justify-center gap-3 group max-w-sm mx-auto"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-200" />
        <span>Back to Login</span>
      </button>

      {/* Help Text */}
      <div className="pt-2">
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Still having trouble? Contact our{" "}
          <button className="text-green-800 hover:text-green-700 font-medium underline underline-offset-2 hover:underline-offset-4 transition-all duration-200">
            support team
          </button>
        </p>
      </div>
    </div>


        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-[#46AA72]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
              <p className="text-gray-600">Enter your email to receive a reset link.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white/50"
                    placeholder="Enter your email"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#46AA72] hover:bg-[hsl(146,42%,57%)] disabled:bg-green-400 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-purple-300 focus:outline-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail size={18} />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                Remember your password?{' '}
                <button
                  onClick={handleBackToLogin}
                  className="text-[#46AA72] hover:text-[hsl(146,42%,57%)] font-semibold underline transition-colors duration-200"
                >
                  Back to Login
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}