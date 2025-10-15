
import {LayoutDashboard,CreditCard,Paintbrush,Smartphone,Rocket,
  Brush,ShieldCheck,ChevronDown,
  Hammer , UserCheck , Clock , TrendingUp , HelpCircle , Star , CheckCircle , XCircle , BadgeCheck , ArrowRight, Zap,Sparkles , Users } from "lucide-react";


import { useEffect ,useState , useRef } from 'react';
import { useAuth } from '../context/authContext';
import { sendEmailVerification } from 'firebase/auth';

import { getFunctions , httpsCallable } from 'firebase/functions';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';



//this is mock data for now , while creating mvp
const faqs = [
  {
    question: "Why do I need BloomQueue?",
    answer:
      "Before spending months building a SaaS, BloomQueue helps you validate your idea quickly. It generates a landing page using AI, collects waitlist signups, and even lets you test pricing with early payments — so you launch smarter and avoid building products no one wants.",
  },
  {
    question: "How does this help validate my idea?",
    answer:
      "We generate an AI-powered landing page tailored to your startup concept, complete with compelling copy, visuals, and a built-in waitlist form. You can drive traffic to this page and measure interest through signups and payments to know if your idea has real traction.",
  },
  {
    question: "Can I accept payments before building?",
    answer:
      "Yes. With built-in Stripe integration, you can collect pre-orders or deposits to test pricing models. This shows real commitment from users — turning curiosity into capital — even before development begins.",
  },
  {
    question: "What can I customize on the landing page?",
    answer:
      "Once your page is generated, you can edit key content such as the headline, subheading, features, and call-to-action using our easy editor. This gives you control while preserving design consistency across devices.",
  },
  {
    question: "Do I get analytics or user data?",
    answer:
      "Yes. Every landing page includes a dashboard where you can track total signups, view user details (name + email), and monitor engagement. This lets you gauge demand with real metrics, not just guesses.",
  },
  {
    question: "How do I share my page?",
    answer:
      "You'll get a unique URL like `yourdomain.com/yourname` to share anywhere — Twitter, Reddit, emails, or ads. Anyone who visits can view your idea, join the waitlist, or make a payment if enabled.",
  },
  {
    question: "Is this a complete MVP or full product builder?",
    answer:
      "No , BloomQueue is focused on validation — helping you test the waters before committing to code. You’re not building the full SaaS here, but you are getting everything you need to validate with speed: AI landing pages, Stripe payments, waitlist forms, and analytics.",
  },
];

const testimonials = [
  {
    name: "Sarah Malik",
    role: "Developer",
    quote:
      "I launched my MVP landing page in minutes. The best part? People actually signed up before I even wrote a single line of backend code.",
    avatar:
      "https://randomuser.me/api/portraits/women/44.jpg",
    stars:5
  },
  {
    name: "Ali Raza",
    role: "Startup Founder",
    quote:
      "The MVP builder helped us validate our product idea without wasting months of development. We even got 30+ paying users just from the landing page.",
    avatar:
      "https://randomuser.me/api/portraits/men/32.jpg",
    stars:4
  },
  {
    name: "Huda Khan",
    role: "Co-Founder",
    quote:
      "I am not a developer, but I was able to build and share my idea. It felt like cheating — in a good way! I did not do anything , almost everything was selected by AI",
    avatar:
      "https://randomuser.me/api/portraits/women/65.jpg",
    stars:5
  },
];



const LandingPage = () => {


  const navigate = useNavigate();
  const auth = useAuth();


  const [description,setDescription]= useState('');



  const handleSubscribe = async (type) => { // subscription logic from the backend , it will handle the monthly and all time subscription
  try {
    const functions = getFunctions(app);
    const createCheckoutSession = httpsCallable(functions, "createCheckoutSession");
    const result = await createCheckoutSession({ type });
    window.location.href = result.data.url;
  } catch (error) {
    console.error("Error creating checkout session:", error);
  }
};


const generateProductName =async () =>{
  try {
  
const prompt = `Generate a catchy product name based on this description: "${description}".
Rules:
- The name must be only 2 to 3 words.
- Use normal title-style words (no hyphens, no underscores, no numbers).
- Return only ONE name, nothing else.`;

    const result = await model.generateContent(prompt);

  
    let name = result.response.text().trim();

    name = name.replace(/\s+/g, "-").toLowerCase();

    return name;
  } catch (error) {
    console.error("Error generating product name:", error);
    return "default-product";
  }
}



const [openIndex, setOpenIndex] = useState(null);
const main_heading_words = ["MVP", "Startup", "Product", "WebApp"];

const [loading , setLoading] = useState(false);

const imageref = useRef(null);
  const [showNotice, setShowNotice] = useState(true);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };


let index = 0;


useEffect(()=>{
    
    const interval = setInterval(()=>{
        index = (index +1) % main_heading_words.length;
        const changer = document.getElementById('changer');
        if(changer){
            changer.textContent = main_heading_words[index];
        }
    },2000)


return () => clearInterval(interval); 

},[])    



const { currentUser } = useAuth();
const [buttonloading , setButtonLoading] = useState(false);

const handleSubmit= async ()=>{
      setButtonLoading(true);  
const name=await generateProductName(description);

  const prompt_product = `You are required to extract structured data from the provided product information. Do not include any explanations, comments, or extra words. Your output must be strictly and only the following in **valid JSON format**:
{
 "heading": "(Describe what the product actually is, not just the name , 5 to 6 words only , unique )",
 "subheading": "(Provide a bit more detail explaining the heading ,at least 15 words )",
 "why_use": {
   "line": "(A one-line summary of the main benefit , atleast 15 words )",
   "points": [
     "(First reason , at least 20 words)",
     "(Second reason , at least 20 words)",
     "(Third reason , at least 20 words)",
     "(Fourth reason , at least 20 words)"
   ]
 },
 "features_and_benefits": [
   "(Feature 1 , short and clear)",
   "(Feature 2, short and clear)",
   "(Feature 3, short and clear)"
 ],
 "features_explanation": [
   "(Explanation for feature 1 , at least 20 words)",
   "(Explanation for feature 2 , at least 20 words)",
   "(Explanation for feature 3 , at least 20 words)"
 ]
}
 
Use the product name and description below to generate the required content:
PRODUCT NAME: ${name}
PRODUCT DESCRIPTION: ${description}`;


  if(description.trim()!==""){

    try{

    const result = await model.generateContent(prompt_product);
    const response = await result.response;
    const text = await response.text();
    
    console.log("Text of response of AI:", text);

     navigate(`/${username}/${name}/preview+edit`,{

      state:{
        productName:name,
        aiResponse: text,
      }

    });
    }catch(err){
      console.log("error:",err);
    }
    finally{
      setButtonLoading(false);
    }
    console.log("The description is:" , description);

    console.log("The AI generated Name is" , name);



    setDescription("");
  }


}



const handleResendVerification = async () => {
  if (currentUser) {
    try {
      await sendEmailVerification(currentUser);
      toast.success("email verified");
    } catch (error) {
      console.error("Error sending email verification:", error);
    }
  }
};



console.log("currentUser:",currentUser);
console.log("Email Verified:", currentUser?.emailVerified);




if(loading) return <Loader />

return (
<>

<div className='overflow-x-hidden'>
{
  currentUser &&
  !currentUser.emailVerified &&
  showNotice && (
    <div className="fixed top-6 right-6 z-50 bg-white border border-gray-200 text-gray-800 px-6 py-4 rounded-md shadow-md flex flex-col gap-2 w-[320px]">
      <div className="flex justify-between items-start gap-2">
        <div className="text-sm font-medium">
          Email not verified. Check inbox or spam.
        </div>
        <button
          onClick={() => setShowNotice(false)}
          className="text-gray-500 hover:text-gray-700 text-lg leading-none font-bold"
        >
          ×
        </button>
      </div>
      <button
        onClick={handleResendVerification}
        className="text-sm text-blue-600 hover:underline self-start"
      >
        Resend verification email
      </button>
    </div>
  )
}



<div className="relative z-0 w-full pt-32 pb-8 bg-[#003F2F] min-h-screen ">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#90C1CA]/20 via-transparent to-[#46AA72]/10"></div>
      </div>

      {/* Landing Content */}
      <div className='flex flex-col items-center justify-center px-4 relative z-10'>
  <h1 className="flex flex-wrap justify-center mb-8 p-4 
  text-4xl sm:text-4xl lg:text-5xl font-bold 
  text-center relative text-white">
  Email Waitlists Aren’t Enough.
  <span className="hidden lg:inline-block w-full"></span>
  <span className="text-[
#90C1CA] ml-2">
    Find Out Who Will Actually Pay Before <br />  You Build.
  </span>
</h1>

        {/* Subtitle */}
        <p className="text-xl text-white/80 text-center max-w-2xl mb-12 leading-relaxed">
         Collecting emails is easy. Capturing buyer demand is what sets you apart. BloomQueue helps you do both — so you know who truly wants your product before you build.
          <span className="text-[
#90C1CA]"> No coding required.</span>
        </p>

        {/* Premium Input Section */}
        <div className="w-full max-w-3xl mx-auto mb-12">
          <div className="relative">
            {/* Main input container */}
            <div className="relative flex flex-col sm:flex-row items-stretch gap-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-2 shadow-2xl">
              {/* Input field */}
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <Zap className="w-5 h-5 text-[#90C1CA]/60" />
                </div>

                <input
                  type="text"
                  value={description}
                  onChange={(e)=> setDescription(e.target.value)}
                  placeholder="Enter description of your idea to get started..."
                  className="w-full h-14 pl-12 pr-4 bg-transparent text-white placeholder-white/50 text-lg font-medium
                             focus:outline-none rounded-xl transition-all duration-300"
                />

              </div>
              
              {/* Launch button */}
<button
  className="group relative h-14 px-8 bg-gradient-to-r from-[#90C1CA] to-[#46AA72] 
             text-[#003F2F] font-bold text-lg rounded-xl
             hover:shadow-lg hover:shadow-[#90C1CA]/25 
             transform hover:scale-[1.02] transition-all duration-300 ease-out
             focus:outline-none focus:ring-2 focus:ring-[#90C1CA]/50 focus:ring-offset-2 focus:ring-offset-[#003F2F]
             sm:min-w-[180px] whitespace-nowrap flex items-center justify-center gap-2"
  onClick={handleSubmit}
  // disabled={loading}
>
 {buttonloading ? (
  <div className="flex items-center gap-3">
    {/* Cool orbital loader with rocket */}
    <div className="relative w-5 h-5">
      {/* Outer orbit ring */}
      <div className="absolute inset-0 border-2 border-transparent border-t-[#003F2F] rounded-full animate-spin [animation-duration:2s]"></div>
      {/* Inner orbit ring */}
      <div className="absolute inset-1 border-2 border-transparent border-b-[#46AA72] rounded-full animate-spin [animation-duration:1.2s] [animation-direction:reverse]"></div>
      {/* Center rocket with pulse */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Rocket className="w-3 h-3 text-[#003F2F] animate-pulse" />
      </div>
      {/* Trailing particles */}
      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-[#46AA72] rounded-full animate-ping [animation-delay:0.5s]" style={{transform: 'translate(-50%, -50%) translateX(-8px)'}}></div>
      <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-[#003F2F] rounded-full animate-ping [animation-delay:1s]" style={{transform: 'translate(-50%, -50%) translateX(-10px)'}}></div>
    </div>
    <span>Launch Your Idea</span>
    <div className="relative w-4 h-4">
      {/* Animated arrow with trail effect */}
      <ArrowRight className="w-4 h-4 animate-pulse" />
      <div className="absolute inset-0 w-4 h-4 opacity-30">
        <ArrowRight className="w-4 h-4 animate-ping" />
      </div>
    </div>
  </div>
) : (
  <>
    <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
    <span>Launch Your Idea</span>
    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
  </>
)}
</button>

            </div>
            
            {/* Glowing effect */}
            <div className="absolute pointer-events-none -inset-1 bg-gradient-to-r from-[#90C1CA]/20 to-[#46AA72]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-sm text-white/60">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>No setup or coding needed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#90C1CA]"></div>
            <span>Waitlist in under 30 secs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span>Gauge demand from real buyers, not just email clicks </span>
          </div>
        </div>
</div>

        {/* Stats section */}
        <div className="flex flex-wrap justify-center items-center gap-8 max-w-2xl mx-auto mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#90C1CA] mb-1">1K+</div>
            <div className="text-sm text-white/60">MVPs Launched</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-white/20"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#90C1CA] mb-1">30s</div>
            <div className="text-sm text-white/60">Average Setup Time</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-white/20"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#90C1CA] mb-1">94%</div>
            <div className="text-sm text-white/60">Success Rate</div>
          </div>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap gap-3 justify-center z-10 px-2">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#90C1CA]/30 bg-[#90C1CA]/10 text-[#90C1CA] text-sm font-medium backdrop-blur-sm">
            <Smartphone size={16} />
            Landing Page
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#46AA72]/30 bg-[#46AA72]/10 text-[#46AA72] text-sm font-medium backdrop-blur-sm">
            <CreditCard size={16} />
            Payment Integration
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#90C1CA]/30 bg-[#90C1CA]/10 text-[#90C1CA] text-sm font-medium backdrop-blur-sm">
            <Paintbrush size={16} />
            Modern Design
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#46AA72]/30 bg-[#46AA72]/10 text-[#46AA72] text-sm font-medium backdrop-blur-sm">
            <LayoutDashboard size={16} />
            Analytics Dashboard
          </span>
        </div>

        {/* Secondary CTA */}
        <div className="mt-12">
          <button className="text-white/70 hover:text-[#90C1CA] text-sm font-medium transition-colors duration-300 flex items-center gap-2 group">
            <span onClick={()=>navigate("/input-idea")}>See how it works</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute top-1/4 left-10 w-2 h-2 rounded-full bg-[#90C1CA]/30 animate-pulse"></div>
      <div className="absolute top-1/3 right-16 w-1 h-1 rounded-full bg-[#46AA72]/40 animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-[#90C1CA]/20 animate-pulse delay-500"></div>
      <div className="absolute bottom-1/3 right-1/3 w-1 h-1 rounded-full bg-[#46AA72]/30 animate-pulse delay-1500"></div>
    </div>


<section id='features' className="section1 max-w-7xl mx-auto px-4 py-16 bg-[#F7F8F3]">
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
    Build Smarter. Launch Faster.
  </h2>
  <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
    Don’t build the MVP — sell it first. Let AI make your landing page, waitlist, and Stripe setup in one go
  </p>

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

    {/* Feature 1 */}
    <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      <div className="text-blue-600 mb-4">
        <Rocket className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-lg mb-2">Ready-to-Go Landing Pages</h3>
      <p className="text-sm text-gray-600">
        Launch with stunning, responsive pages built for conversion — no design skills required.
      </p>
    </div>

    {/* Feature 2 */}
    <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      <div className="text-purple-600 mb-4">
        <CreditCard className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-lg mb-2">Stripe Integration</h3>
      <p className="text-sm text-gray-600">
        Accept payments seamlessly with built-in Stripe setup, so you can test pricing and gauge true interest
      </p>
    </div>

    {/* Feature 3 */}
    <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      <div className="text-red-600 mb-4">
        <Brush className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-lg mb-2">Modern UI Design</h3>
      <p className="text-sm text-gray-600">
        Built with Tailwind and best design practices to deliver a beautiful user experience.
      </p>
    </div>

    {/* Feature 4 */}
    <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      <div className="text-cyan-600 mb-4">
        <LayoutDashboard className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-lg mb-2">Interactive Dashboard</h3>
      <p className="text-sm text-gray-600">
        Manage users, content, and settings in a clean, intuitive dashboard that scales with your app.
      </p>
    </div>

    {/* Feature 5 */}
    <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      <div className="text-green-600 mb-4">
        <ShieldCheck className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-lg mb-2">Auth & Security</h3>
      <p className="text-sm text-gray-600">
        Secure authentication with Firebase or custom setups, keeping user data protected and access smooth.
      </p>
    </div>

    {/* Feature 6 */}
    <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      <div className="text-yellow-500 mb-4">
        <Hammer className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-lg mb-2">Fully Customizable</h3>
      <p className="text-sm text-gray-600">
        Modify every section to match your brand and features — you're in full control.
      </p>
    </div>
  </div>
</section>


    <section className="section2 w-full bg-[#F7F8F3] py-16 px-6 md:px-20 ">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          Why Use BloomQueue?
        </h2>
        <p className="text-gray-600 text-lg md:text-xl mb-12">
          Validate ideas fast, test with users, and launch with confidence — all without writing a single line of backend code.
        </p>

        <div className="grid md:grid-cols-2 gap-10 text-left">
          <div className="flex items-start gap-4">
            <Rocket className="text-blue-600 w-8 h-8 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Launch Quickly</h3>
              <p className="text-gray-600">
                Launch quickly with proof — know who will actually pay before you build.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <UserCheck className="text-green-600 w-8 h-8 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Validate with Real Users</h3>
              <p className="text-gray-600">
                Get your idea in front of early adopters and gather actionable feedback.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Clock className="text-yellow-500 w-8 h-8 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Save Time & Money</h3>
              <p className="text-gray-600">
                Avoid building features users don’t need by starting small and focused.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <TrendingUp className="text-purple-600 w-8 h-8 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Build Momentum</h3>
              <p className="text-gray-600">
                Turn your idea into traction fast and set the stage for funding or scaling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>





<section id='faq' className="section3 w-full py-16 px-6 md:px-20 bg-[#fafafc]">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12">
      Frequently Asked Questions
    </h2>
    <div className="space-y-6">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-xl shadow-sm transition-all duration-300 bg-white"
        >
          <button
            onClick={() => toggle(index)}
            className="w-full flex justify-between items-center p-6 text-left group hover:bg-gray-50 rounded-t-xl"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-green-900 group-hover:text-green-600 transition-colors" />
              <span className="text-lg md:text-xl font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                {faq.question}
              </span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 group-hover:text-green-600 transition-transform duration-300 ${
                openIndex === index ? "rotate-180 text-green-600" : ""
              }`}
            />
          </button>
          <div
            className={`px-6 pt-0 overflow-hidden transition-all duration-300 text-gray-600 ${
              openIndex === index ? "max-h-screen pb-6" : "max-h-0"
            }`}
          >
            <p className="text-base leading-relaxed">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

<section className="section1 bg-white py-20 px-6 md:px-20">
  <div className="max-w-5xl mx-auto text-center">
    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
      Trusted by Early Founders & Builders
    </h2>
    <p className="text-gray-600 mb-12">
      Makers from all backgrounds are using BloomQueue to validate ideas faster than ever.
    </p>

    <div className="grid md:grid-cols-3 gap-8">
      {testimonials.map((t, i) => (
        <div
          key={i}
          className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition duration-300 flex flex-col justify-between h-full"
        >
            <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-4">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">{t.name}</h4>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
            {/* Star rating (emoji or Lucide icons) */}
            <div className="flex gap-1 text-yellow-400">
              {[...Array(t.stars)].map((_, starIndex) => (
                <Star key={starIndex} className="w-4 h-4 fill-yellow-400" />
              ))}
            </div>
          </div>


          <div>
            <p className="text-gray-700 italic mt-4">“{t.quote}”</p>
          </div>
          
        </div>
      ))}
    </div>
  </div>
</section>

<section id="pricing" className="section3 w-full bg-[#003F2F] py-28 px-6">
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
      Choose Your Plan
    </h2>
    <p className="text-[#e5e7eb] text-lg mb-16">
      Get started for free — upgrade anytime. No hidden fees. Cancel anytime.
    </p>

    <div className="grid gap-8 md:grid-cols-3">
      {/* Free Demo Plan */}
      <div className="relative border-2 border-purple-200 bg-gray-100 rounded-2xl p-10 shadow-md flex flex-col justify-between hover:shadow-lg transition-all duration-300 min-h-[400px]">
        <div>
          <span className="text-sm font-semibold text-gray-500 uppercase">Free Demo</span>
          <h3 className="text-3xl font-bold text-gray-800 mt-2 mb-4">Free</h3>
          <ul className="text-left text-sm text-gray-600 space-y-3">
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-900" />Full platform access (limited)</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-900" />Generate multiple free website template</li>
            <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-400" />Dashboard or analytics</li>
            <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-400" />Make Landing Pages publishable</li>
          </ul>
        </div>
        <div className="mt-6">
          {/* <Button
            text="Free Demo"
            color="bg-[#46AA72]"
            bgcolor_border="bg-green-100 border-green-200"
            onClick={()=>{


              if(!auth.currentUser){
                navigate("/login");
              }else{
                toast.success("Already registered, check plan from dashboard");
              }
            }}
          /> */}

          <button className='bg-[#46AA72] text-white font-semibold px-6 py-3 rounded-xl shadow-md 
             hover:bg-[#3d9463] hover:shadow-lg transition-all duration-300 ease-in-out
             focus:outline-none focus:ring-2 focus:ring-[#46AA72] focus:ring-offset-2' 
             onClick={()=>{
              
              if(!auth.currentUser){
                navigate("/login");
              }else{
                toast.success("Already registered, check plan from dashboard");
              }

             }}
             >Free Demo</button>
        </div>
      </div>

      {/* Monthly Plan */}
      <div className="relative border-2 border-green-800 bg-gray-100 rounded-2xl p-10 shadow-md flex flex-col justify-between hover:shadow-lg transition-all duration-300 min-h-[400px]">
        <div>
          <span className="text-sm font-semibold text-green-900 uppercase">Standard</span>
          <h3 className="text-3xl font-bold text-gray-800 mt-2 mb-4">$10/mo</h3>
          <ul className="text-left text-sm text-gray-600 space-y-3">
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-900" />Full feature access</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-900" />Unlimited site generations monthly</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-900" />Make Landing Pages publishable</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-900" />Dashboard + analytics access</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-900" />Priority support</li>
          </ul>
        </div>
        <div className="mt-6">
          {/* <Button
            text="Subscribe Monthly"
            color="bg-[#46AA72]"
            bgcolor_border="bg-green-100 border-green-200"

            onClick={()=>handleSubscribe("subscription")}
          /> */}

          <button className='bg-[#46AA72] text-white font-semibold px-6 py-3 rounded-xl shadow-md 
             hover:bg-[#3d9463] hover:shadow-lg transition-all duration-300 ease-in-out
             focus:outline-none focus:ring-2 focus:ring-[#46AA72] focus:ring-offset-2'
             onClick={()=>handleSubscribe("subscription")}
             >
              Subscribe Monthly
          </button>
        </div>
      </div>

      {/* Lifetime Deal */}
      <div className="relative border-4 border-green-800 bg-gray-100 rounded-2xl p-10 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all duration-300 min-h-[400px]">
        {/* Ribbon */}
        <div className="absolute -top-3 right-4 bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
          <Star className="w-3.5 h-3.5" /> Most Popular
        </div>
        <div>
          <span className="text-sm font-semibold text-green-900 uppercase">Lifetime Access</span>
          <h3 className="text-3xl font-bold text-gray-800 mt-2 mb-4">$49</h3>
          <ul className="text-left text-sm text-gray-600 space-y-3">
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-900" />One-time payment</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-900" />All Standard plan features</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-900" />Unlimited Site Generations</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-900" />Dashboard + analytics access</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-900" />Make Landing Pages publishable</li>
            <li className="flex items-center gap-2"><BadgeCheck className="w-4 h-4 text-green-900" />Priority Support</li>
          </ul>
        </div>
        <div className="mt-6">
          {/* <Button
            text="Get Lifetime Deal"
            color="bg-[#46AA72]"
            bgcolor_border="bg-green-100 border-green-200"
            onClick={()=>handleSubscribe("onetime")}
          /> */}
          <button onClick={()=>handleSubscribe("onetime")} className='bg-[#46AA72] text-white font-semibold px-6 py-3 rounded-xl shadow-md 
             hover:bg-[#3d9463] hover:shadow-lg transition-all duration-300 ease-in-out
             focus:outline-none focus:ring-2 focus:ring-[#46AA72] focus:ring-offset-2'>
            Get Lifetime Deal
          </button>
        </div>
      </div>
    </div>
  </div>

</section>


</div>
</>
)
};

export default LandingPage;