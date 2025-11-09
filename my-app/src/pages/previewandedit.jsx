
import { useLocation } from 'react-router-dom'

import { useEffect , useState } from 'react';
import Sidebar from '../components/edit_sidebar';
import Generated_Page_Nav from '../components/generated_page_nav';

import MainContent from '../components/maincontent';
import { addDoc , collection } from 'firebase/firestore';
import { db ,auth } from '../firebase';
import usePlanData from '../hook/useplandata';
import { useNavigate } from 'react-router-dom';


const PreviewandEdit = () => {

  const navigate = useNavigate();


  const user = auth.currentUser;



  const [editmaintitle , seteditmaintitle] = useState('');
  const [editsubtitle , seteditsubtitle] = useState('');

  const [showtermspopup, setShowtermspopup] = useState(false);
  const [isChecked, setIsChecked] = useState(false);


  const [features , setFeatures] = useState([]);
  const [featuresexplanation , setFeaturesExplanation] = useState([]);


  const [whyuseline , setWhyuseLine] = useState('');
  const [whyusepoints , setWhyUsePoints] = useState([]);


  const [showsidebar , setshowsidebar] = useState(false);
  const [preview , setPreview] = useState(false);
 
const [isMobile, setIsMobile] = useState(window.innerWidth < 768);



const plandata= usePlanData();




useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  window.addEventListener('resize', handleResize);

 
  return () => window.removeEventListener('resize', handleResize);
}, []);


  const [benefits, setBenefits] = useState([
  { title: "50%", subtitle: "Discount" },
  { title: "VIP", subtitle: "Priority" },
  { title: "1 Month", subtitle: "Free Trial" },
]);


  const handleGoogleSignup = () => {
    console.log('Google signup clicked');
  };


 const location = useLocation();
  const { productName, aiResponse } = location.state || {};
  
  let parsedResponse = null;
  
  if (aiResponse) {
    try {
   
      if (typeof aiResponse === 'object'){
        parsedResponse = aiResponse;
        console.log(parsedResponse);
      } else {
        const cleanedResponse = aiResponse
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
        parsedResponse = JSON.parse(cleanedResponse);

      }

    } catch (error) {
      console.error("Failed to parse AI response:", error);
      console.log("Raw AI response:", aiResponse);
      return <div>Error: Invalid AI response format</div>;
    }
  }

  
  if (!productName || !parsedResponse) {
    return <div>No data available</div>;
  }


  useEffect(()=>{

    if(parsedResponse && !editmaintitle && !editsubtitle &&(!features || features.length === 0) &&
    (!featuresexplanation || featuresexplanation.length === 0) && !whyuseline && (!whyusepoints || whyusepoints.length===0)){
      seteditmaintitle(parsedResponse.heading);
      seteditsubtitle(parsedResponse.subheading);
      setFeatures(parsedResponse.features_and_benefits);
      setFeaturesExplanation(parsedResponse.features_explanation);
      setWhyuseLine(parsedResponse.why_use.line);
      setWhyUsePoints(parsedResponse.why_use.points);
    }
  },[parsedResponse])






const handlePublish = async ()=> {

  if(!editmaintitle || !editsubtitle || !benefits.length || !productName ||!parsedResponse){
    return;
  }


  if(plandata.active===false){
    alert("Upgrade Your Plan to publish");
    return;
  }

  
  
    const pageData = {
    title: editmaintitle,
    subtitle: editsubtitle,
    benefits,
    productName,
    parsedResponse,
    features,
    featuresexplanation,
    whyuseline,
    whyusepoints,
    createdAt: new Date(),
  };

  try {
    const user = auth.currentUser;
    await addDoc(collection(db, "users", user.uid, "pages"), pageData);
    setShowtermspopup(false);
    alert("Page published successfully!");


    navigate(`/dashboard/${user.uid}`)
    console.log("The uid of user",user.uid);


  } catch (error) {
    console.error("Error publishing page:", error);
    setShowtermspopup(false);
    alert("Failed to publish page.");
  }
}


const handlePublishButton = ()=>{

  if(!user){
    alert("Log In and update Plan to continue");
    return;
  }


  setShowtermspopup(true);
}

return (

    <>



<div className='flex min-h-screen'>

{!showsidebar && !preview && user && (
<Generated_Page_Nav 
makesidebarshow = {setshowsidebar}
setPreview = {setPreview}
handlePublishButton={handlePublishButton}
 />
)}



{showtermspopup && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    {/* Blurred Background */}
    <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

    {/* Popup Content */}
    <div className="bg-white rounded-xl shadow-xl p-6 relative z-10 max-w-md w-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Confirm Terms
      </h2>
      <p className="text-gray-600 mb-4">
        By publishing your page, you confirm that it does <strong>not</strong> contain any prohibited content as defined by our policy.
      </p>

      <div className="flex items-center mb-6">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
        />
        <label className="ml-2 text-gray-700 select-none">
          I confirm my page complies with the terms
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={()=>setShowtermspopup(false)}
          className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button
          onClick={handlePublish}
          disabled={!isChecked}
          className={`px-4 py-2 rounded-xl text-white font-semibold transition ${
            isChecked ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Publish
        </button>
      </div>
    </div>
  </div>
)}





<div
  className={`fixed top-0 left-0 h-screen w-[250px] bg-white border-r border-gray-200 shadow-lg z-50 transition-transform duration-300 ${
    showsidebar ? 'translate-x-0' : '-translate-x-full'
  }`}
>


  <Sidebar
    editmaintitle={editmaintitle}
    seteditmaintitle={seteditmaintitle}
    editsubtitle={editsubtitle}
    seteditsubtitle={seteditsubtitle}
    benefits={benefits}
    setBenefits={setBenefits}
    setshowsidebar={setshowsidebar}
    features = {features}
    featuresexplanation = {featuresexplanation}
    setFeatures = {setFeatures}
    setFeaturesExplanation = {setFeaturesExplanation}
    whyuseline={whyuseline}
    whyusepoints={whyusepoints}
    setWhyuseLine={setWhyuseLine}
    setWhyUsePoints={setWhyUsePoints}
  />
</div>


<MainContent 
  showsidebar={showsidebar}
  isMobile={isMobile}
  preview={preview}
  setPreview={setPreview}
  editmaintitle={editmaintitle}
  editsubtitle={editsubtitle}
  handleGoogleSignup={handleGoogleSignup}
  benefits={benefits}
  parsedResponse={parsedResponse}
  productName={productName}
  features = {features}
  featuresexplanation = {featuresexplanation}
  whyuseline={whyuseline}
  whyusepoints={whyusepoints}
  isPreview={true}
/>
</div>
    </>

);
}

export default PreviewandEdit
