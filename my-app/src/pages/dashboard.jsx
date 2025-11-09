

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db , auth } from "../firebase";
import useUsername from "../services/getcurrentUsername";


import { Plus, Calendar, Users, ChevronDown, ChevronUp, Mail, User ,X , Trash2 ,Menu,LinkIcon, CopyIcon , CreditCard , Loader2  } from "lucide-react";
import Loader from "../components/loading";
import useEmail from "../services/getcurrentemail";

import deleteAccount from "../services/deleteaccount";
import GoogleAccountDeletion from "../services/googleaccountdeletion";


import { doc , deleteDoc } from "firebase/firestore";
import usePlanData from "../hook/useplandata";


import { getFunctions, httpsCallable } from "firebase/functions";
import { useProducts } from "../context/productsContext";

import Subscribers from "./subscribers";
import AccountSettings from "../components/accountsettings";



const Dashboard = () => {


  const navigate = useNavigate();
  const {username} = useUsername();
  const email = useEmail();

  const { id } = useParams();
  const {products , setProducts , loading} = useProducts();
  const [expanded, setExpanded] = useState({});
  const [accountsettings, setAccountsettings] = useState(false);


  const [showConfirm, setShowConfirm] = useState(false);


  const [showsidebar , setShowSidebar] = useState(false);
  const [password, setPassword] = useState("");

  const [connected , setConnected] = useState(null);


  const [stripeloading , setStripeLoading] = useState(false);


  const [showSubscribers,setShowSubscribers] = useState(false);
  const [showProjects,setShowProjects] = useState(true);
  const [showAccountSettings,setShowAccountSettings] = useState(false);

  





  const plandata = usePlanData();

  const functions = getFunctions();

  const toggleExpand = (productId) => {
    setExpanded((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (link, productId) => {
    navigator.clipboard.writeText(link).then(() => {
      setCopiedId(productId);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000); 
    });
  };

  const handleaccountsettings = () => {
    // let settings = accountsettings === false ? true : false;
    // setAccountsettings(settings);
    setShowProjects(false);
    setShowSubscribers(false);
    setShowAccountSettings(true);
  }


    const handleDelete = async () => {

    await deleteAccount(email,password);
    
  };


  const handlegoogledelete = async ()=>{
    await GoogleAccountDeletion();
  }

const handleDeleteproduct = async (id) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user found.");


    const pageRef = doc(db, "users", user.uid, "pages", id);

    await deleteDoc(pageRef);

    setProducts((prev) => prev ? prev.filter((p) => p.id !== id) : []);

    alert("Deleted successfully!");
  } catch (error) {
    console.error("Error deleting product:", error);
    alert(error.message || "Failed to delete product. Please try again.");
  }
};


const handlestripelinking = async ()=>{
  const user = auth.currentUser;



  try {

    setStripeLoading(true);
    
    const createStripeConnectLink = httpsCallable(functions, "createStripeConnectLink");

    const result = await createStripeConnectLink({ email: user.email });

    const { url } = result.data;

    if (!url) {
      throw new Error("No Stripe onboarding URL returned.");
    }

    window.location.href = url;
  } catch (error) {
    console.error("Error linking Stripe:", error);
  }
  finally{
    setStripeLoading(false);
  }

}



 useEffect(() => {

    const checkConnection = async () => {
      if (!auth.currentUser) return;
      try {
        const checkStripeConnection = httpsCallable(functions, "checkStripeConnection");
        const result = await checkStripeConnection({});
        setConnected(result.data.connected);
      } catch (error) {
        console.error("Error checking Stripe connection:", error);
        setConnected(false);
      }
    };
    checkConnection();
  }, [auth.currentUser, functions]);




   if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
       
        
<div 
  className={`w-72 bg-white flex flex-col h-screen shadow-sm border-r border-slate-200 fixed left-0 top-0 z-10 transition-transform duration-300 ease-in-out ${
    showsidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
  }`}
>
          {/* Sidebar Header */}
          <div className="px-8 py-8 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#46AA72] to-[#90C1CA] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>


<div className="flex items-center w-full justify-between">
  
  <div>
    <h2 className="text-lg font-semibold text-slate-900">Dashboard</h2>
    <p className="text-xs text-slate-500">Workspace</p>
  </div>


    <span
      className="md:hidden cursor-pointer p-1 rounded hover:bg-gray-200"
      onClick={() => setShowSidebar(false)}
      aria-label="Close sidebar"
      role="button"
    >
      <X size={20} />
    </span>
  
</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-6 space-y-2 overflow-y-auto">
            {/* New Project Button */}
            <div className="mb-8">
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r bg-[#46AA72] hover:bg-[hsl(146,42%,57%)] text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={()=>{
                navigate("/input-idea");
              }}>
                <Plus className="w-5 h-5" />
                <span>New Project</span>
              </button>
            </div>

            {/* Menu Items */}
            <div className="space-y-1">
              <button
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all duration-200 group ${
                  showProjects ? "text-[#46AA72]" : "text-slate-700 hover:text-[hsl(146,42%,57%)]"
                }`}
                onClick={()=>{
                  setShowSubscribers(false);
                  setShowAccountSettings(false);
                  setShowProjects(true);
                }}
              >
                <svg
                  className={`w-5 h-5 transition-colors duration-200 ${
                    showProjects ? "text-[#46AA72]" : "text-slate-400 group-hover:text-[hsl(146,42%,57%)]"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z"
                  />
                </svg>
                <span className="font-medium">Projects</span>
              </button>


                <button
                  onClick={() => {
                    setShowProjects(false);
                    setShowAccountSettings(false);
                    setShowSubscribers(true);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    showSubscribers
                      ? " text-[#46AA72]"
                      : "text-slate-700 hover:bg-slate-50 hover:text-[hsl(146,42%,57%)]"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      showSubscribers ? "text-[#46AA72]" : "text-slate-400 group-hover:text-[hsl(146,42%,57%)]"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span className="font-medium">Subscribers</span>
                </button>

            </div>

            {/* Account Settings */}
            <div className="pt-6 border-t border-slate-100">


    {  connected==false &&        
    <button
      onClick={handlestripelinking}
      disabled={stripeloading}
      className={`w-full flex justify-between items-center px-4 py-3 rounded-xl 
        text-slate-700 transition-all duration-200 group
        ${stripeloading ? "bg-slate-100 cursor-not-allowed" : "hover:bg-slate-50 hover:text-[#46AA72]"}`}
    >
      <div className="flex items-center space-x-3">
        {stripeloading ? (
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
        ) : (
          <CreditCard className="w-4 h-4 transform transition-transform duration-200" />
        )}
        <span className="font-medium">
          {stripeloading ? "Connecting..." : "Connect Stripe"}
        </span>
      </div>
    </button>
}


{connected ==true && 
    <button
      disabled
      className={`w-full flex justify-between items-center px-4 py-3 rounded-xl 
        text-slate-700 transition-all duration-200 group
        ${stripeloading ? "bg-slate-100 cursor-not-allowed" : "hover:bg-slate-50 hover:text-[hsl(146,42%,57%)]"}`}
    >
      <div className="flex items-center space-x-3">
        <CreditCard className="w-4 h-4 transform transition-transform duration-200 text-[#46AA72]" />
        <span className="font-medium text-[#46AA72]">
          Stripe Connected
        </span>
      </div>
    </button>
}


              <button
                onClick={handleaccountsettings}
                className="w-full flex justify-between items-center px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-700 transition-all duration-200 group"
              >
<div
  className="flex items-center space-x-3 cursor-pointer group"
  
>
  <svg
    className={`w-5 h-5 transition-colors duration-200 
      ${accountsettings ? "text-[#46AA72]" : "text-slate-700"} 
      group-hover:text-[#46AA72]`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 
         0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 
         2.37 2.37a1.724 1.724 0 001.065 
         2.572c1.756.426 1.756 2.924 0 3.35a1.724 
         1.724 0 00-1.066 2.573c.94 1.543-.826 
         3.31-2.37 2.37a1.724 1.724 0 
         00-2.572 1.065c-.426 1.756-2.924 
         1.756-3.35 0a1.724 1.724 0 
         00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 
         1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 
         0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 
         2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>

  <span
    className={`font-medium transition-colors duration-200 
      ${accountsettings ? "text-[#46AA72]" : "text-slate-700"} 
      group-hover:text-[#46AA72]`}
  >
    Account Settings
  </span>
</div>

              </button>

              
            </div>
          </nav>


          {/* User Profile */}
 <div className="p-6 border-t border-slate-100">
  <div className="flex items-center space-x-3">
    {/* Avatar */}
    {auth.currentUser?.photoURL ? (
      <img
        src={auth.currentUser.photoURL}
        alt="avatar"
        className="w-10 h-10 rounded-full object-cover"
      />
    ) : (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
        {(auth.currentUser?.displayName || username || "")
          .split(" ")
          .map(word => word[0])
          .join("")
          .toUpperCase()}
      </div>
    )}

    {/* Name & Email */}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-900 truncate">
        {auth.currentUser?.displayName || username}
      </p>
      <p className="text-xs text-slate-500 truncate">
        {auth.currentUser?.email || email}
      </p>
    </div>

    {/* Button */}
    <button className="text-slate-400 hover:text-slate-600 transition-colors" 
    onClick={handleaccountsettings}>
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
    </button>
  </div>
</div>
        </div>





        {/* Main Content */}


        {showProjects && (
          <main className="flex-1 ml-0 md:ml-72">
          <div className="px-8 py-8">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">


<div className="flex flex-col md:flex-row md:items-center md:justify-between">


  <div>
    <div className="flex items-center justify-between space-x-2">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        Welcome back, {username}
      </h1>

      <span className="md:hidden p-2 rounded-md bg-[#90C1CA] text-white cursor-pointer"
      onClick={()=>setShowSidebar(true)}>
        <Menu size={24} />
      </span>
    </div>

    <p className="text-slate-600 max-w-max">
      Manage your products and track customer <span className={`md:hidden`}><br /></span>engagement
    </p>
  </div>

</div>


                <div className="flex items-center gap-3">


                  <Link
                    to="/input-idea"
                    className="inline-flex items-center gap-2 bg-gradient-to-r bg-[#46AA72] hover:bg-[hsl(146,42%,57%)] text-white px-6 py-3 rounded-xl  transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Plus size={18} />
                    New Project
                  </Link>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="flex justify-center">
              {products.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-2xl shadow-sm">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Plus className="text-[#90C1CA]" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    No projects yet
                  </h3>
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    Create your first project to start building your waitlist and engaging with customers
                  </p>
                  <Link
                    to="/input-idea"
                    className="inline-flex items-center gap-2 
bg-gradient-to-r from-[#46AA72] to-[#90C1CA] 
text-white px-8 py-4 rounded-xl 
hover:from-[#3d9462] hover:to-[#7db3bb] 
transition-all duration-200 font-medium 
shadow-lg hover:shadow-xl 
transform hover:-translate-y-0.5"
                  >
                    <Plus size={20} />
                    Create Your First Project
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full max-w-7xl">
                  {products.map((product) => {
                    const waitlist = product.waitlist || [];
                    const isExpanded = expanded[product.id];
                    const createdAtFormatted = product.createdAt
                      ? new Date(product.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : "Unknown";

                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-2xl border border-slate-200 hover:border-green-200 transition-all duration-300 h-80 flex flex-col shadow-sm hover:shadow-lg group overflow-hidden"
                      >
                        {/* Product Header */}
                        <div className="p-6 border-b border-slate-100 flex-shrink-0">

                          <div className="flex justify-between">

                   
                          <Link to={`/${username}/${encodeURIComponent(product.productName)}`} className="block">
                            <h3 className="font-semibold text-slate-900 group-hover:text-[#46AA72] transition-colors line-clamp-1 mb-2 text-lg">
                              {product.productName}
                            </h3>
                          </Link>
                          <span className="text-red-600 cursor-pointer hover:text-red-500" onClick={()=>{
                            handleDeleteproduct(product.id);
                          }}>
                            <Trash2 size={16} />
                          </span>
                   </div>

                          <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                            <Calendar size={14} className="text-slate-400" />
                            <span>{createdAtFormatted}</span>
                          </div>

                          {/* Project Link */}
                          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                            <LinkIcon size={14} className="text-slate-400 flex-shrink-0" />
                            <a
                              href={`https://bloomqueue.com/${encodeURIComponent(username)}/${encodeURIComponent(product.productName)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#46AA72] hover:text-[hsl(146,42%,57%)] flex-1 truncate text-sm font-medium"
                            >
                              {`bloomqueue.com/${username}/${product.productName}`}
                            </a>
                            <button
                              onClick={() =>
                                handleCopy(
                                  `https://bloomqueue.com/${encodeURIComponent(username)}/${encodeURIComponent(product.productName)}`,
                                  product.id
                                )
                              }
                              className="text-slate-400 hover:text-slate-600 transition-colors"
                              title="Copy link"
                            >
                              <CopyIcon size={16} />
                            </button>
                            {copiedId === product.id && (
                              <span className="text-xs text-green-600 font-medium">Copied!</span>
                            )}
                          </div>
                        </div>

                        {/* Waitlist Section */}
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <Users size={16} className="text-[#46AA72]" />
                              </div>
                              <div>
                                <span className="text-lg font-semibold text-slate-900">
                                  {waitlist.length}
                                </span>
                                <span className="text-sm text-slate-500 ml-1">
                                  waitlisted
                                </span>
                              </div>
                            </div>

                            {waitlist.length > 0 && (
                              <button
                                onClick={() => toggleExpand(product.id)}
                                className="flex items-center gap-1 text-sm font-medium text-[#46AA72] hover:text-[hsl(146,42%,57%)] transition-colors px-3 py-1 rounded-lg hover:bg-indigo-50"
                              >
                                {isExpanded ? (
                                  <>
                                    Hide <ChevronUp size={14} />
                                  </>
                                ) : (
                                  <>
                                    View All <ChevronDown size={14} />
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          {isExpanded && waitlist.length > 0 && (
                            <div className="flex-1 border-t border-slate-100 pt-4">
                              <div className="space-y-3 h-32 overflow-y-auto">
                                {waitlist.map((entry, index) => (
                                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0 text-indigo-700 text-xs font-semibold">
                                      {entry.name?.charAt(0)?.toUpperCase() || (
                                        <User size={14} className="text-indigo-500" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium text-slate-900 truncate">
                                        {entry.name || 'Anonymous'}
                                      </div>
                                      <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <Mail size={10} />
                                        <span className="truncate">{entry.email}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
        )}

        {showSubscribers && (
          <>
            <main className="flex-1 ml-0 md:ml-72">
              <div className="px-8 py-8">
                <Subscribers />
              </div>
            </main>
          </>
        )}


                {showAccountSettings && (
          <>
            <main className="flex-1 ml-0 md:ml-72">
              <div className="px-8 py-8">
                <AccountSettings 
                plandata={plandata}
                handlegoogledelete={handlegoogledelete}
                handleDelete={handleDelete}/>
              </div>
            </main>
          </>
        )}


        
      </div>
    </div>



  );
};

export default Dashboard;