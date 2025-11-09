import { useEffect, useState } from "react";
import { Trash2, X, Settings, User, Mail, Calendar, Package, Upload, LogOut, Crown } from "lucide-react";
import { auth } from "../firebase";
import useUsername from "../services/getcurrentUsername";

import useEmail from "../services/getcurrentemail";

import { signOut, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useProducts } from "../context/productsContext";
import { useNavigate } from "react-router-dom";



const AccountSettings = ({ plandata, handlegoogledelete, handleDelete }) => {


  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");


  const email = useEmail();
  const {username} = useUsername();
  const currentUser = auth.currentUser;

  const [displayName, setDisplayName] = useState("");
  const user = auth.currentUser;  
  const {products} = useProducts();  
  const storage = getStorage();

  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateProfile(auth.currentUser, { photoURL: url });
      setPhotoURL(url);
      auth.currentUser.photoURL = url;
    } catch (err) {
      console.error("Error uploading file:", err);
    } finally {
      setUploading(false);
    }
  };

  const handlelogout = async ()=>{
    try{
    await signOut(auth);
    console.log("Signed Out");    
    }
    catch(err){
        console.log("Error in sign out , in acocunt settings",err);
    }
  }

  useEffect(()=>{
    if (user?.displayName) {
      setDisplayName(user.displayName);
    } else if (username) {
      setDisplayName(username);
    }
  },[])

  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || "");
  const displayEmail = currentUser?.email || email;

  const initials = displayName
    ? displayName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "";

  const handleSave = async () => {
    try{
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName:displayName, 
        });

      }
    }catch(err){
        console.log("error in account settings : " , err)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#46AA72] to-[#90C1CA] rounded-xl shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Account Settings</h1>
              <p className="text-slate-600 mt-1">Manage your profile and account preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Profile Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <User className="w-5 h-5 text-[#46AA72]" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Profile Information</h2>
          </div>

          {/* Avatar Section */}
          <div className="flex items-start gap-8 mb-8">
            <div className="relative group">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt="User avatar"
                  className="w-24 h-24 rounded-xl object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-semibold text-xl shadow-md">
                  {initials}
                </div>
              )}
              <div className="absolute inset-0 bg-indigo-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-medium text-slate-800 mb-2">Profile Picture</h3>
              <p className="text-slate-600 text-sm mb-4">Upload a new profile picture to personalize your account</p>
              
              <div className="relative cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <button
                  className={`flex items-center gap-2 px-4 py-2 border-2 border-dashed border-green-500 rounded-lg  transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4 text-[#46AA72]" />
                  <span className="text-sm text-[#46AA72] font-medium">
                    {uploading ? 'Uploading...' : 'Choose Image'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter display name"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={displayEmail}
                disabled
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-2">Email cannot be changed from this interface</p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-[#46AA72] to-[hsl(146,42%,57%)] text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Account Statistics & Actions Row */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Profile Overview */}
  <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-xl p-6 space-y-6">
    <h2 className="text-lg font-semibold text-slate-800 border-b pb-3">Account Overview</h2>

    <div className="flex items-center gap-4">
      <div className="p-3 bg-emerald-100 rounded-xl">
        <Calendar className="w-6 h-6 text-emerald-600" />
      </div>
      <div>
        <p className="text-xs text-slate-500">Created</p>
        <p className="text-sm font-medium text-slate-700">{auth.currentUser.metadata.creationTime}</p>
      </div>
    </div>

    <div className="flex items-center gap-4">
      <div className="p-3 bg-violet-100 rounded-xl">
        <Crown className="w-6 h-6 text-violet-600" />
      </div>
      <div>
        <p className="text-xs text-slate-500">Current Plan</p>
        <p className="text-sm font-medium text-slate-700">{plandata.planType === 'onetime' ? "Lifetime":plandata.planType}</p>
      </div>
    </div>

    <div className="flex items-center gap-4">
      <div className="p-3 bg-blue-100 rounded-xl">
        <Package className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <p className="text-xs text-slate-500">Projects</p>
        <p className="text-sm font-medium text-slate-700">{products.length} Showcased</p>
      </div>
    </div>
  </div>

  {/* Actions */}
  <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-xl p-6 flex flex-col justify-between">
    <h2 className="text-lg font-semibold text-slate-800 border-b pb-3 mb-4">Quick Actions</h2>

    <div className="space-y-4">

      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all"
      onClick={()=>{
        navigate("/change-password") 
      }}>
              Change Password
        </button>        


      <button
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all"
        onClick={handlelogout}
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>

      <button
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-medium transition-all"
        onClick={() => {
          if (auth.currentUser.providerData[0].providerId === "password") {
            setShowConfirm(true);
          } else {
            handlegoogledelete();
          }
        }}
      >
        <Trash2 className="w-4 h-4" />
        Delete Account
      </button>
    </div>
  </div>
</div>

      </div>





      {/* Confirm Delete for email */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative border border-slate-200">
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-all"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-100 rounded-xl">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Confirm Account Deletion</h2>
                <p className="text-sm text-slate-600">This action is irreversible</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-700">
                This will permanently delete your account and remove all data associated with it. 
                This action cannot be undone.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Enter your password to confirm
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-3 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-all shadow-lg"
                onClick={() => handleDelete(password)}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;