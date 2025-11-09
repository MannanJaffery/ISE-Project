import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion
} from "firebase/firestore";

import { db } from "../firebase";
import MainContent from "../components/maincontent";

import { X } from "lucide-react";
import Loader from "../components/loading";

const ProductPage = () => {
  const { username, productname } = useParams();
  const decodedUsername = decodeURIComponent(username);

  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [pageId, setPageId] = useState(null);





  



  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const usersRef = collection(db, "users");
        const userQuery = query(usersRef, where("username", "==", decodedUsername));
        const userSnap = await getDocs(userQuery);

        if (userSnap.empty) {
          console.error("User not found");
          setLoading(false);
          return;
        }

        const uid = userSnap.docs[0].id;
        setUserId(uid);

        // Find product page
        const pagesRef = collection(db, "users", uid, "pages");
        const pageQuery = query(pagesRef, where("productName", "==", productname));
        const pageSnap = await getDocs(pageQuery);

        if (pageSnap.empty) {
          console.error("Page not found");
          setLoading(false);
          return;
        }

        const pageDoc = pageSnap.docs[0];
        setPageData({
          ...pageDoc.data(),
          // Initialize waitlist array if it doesn't exist
          waitlist: pageDoc.data().waitlist || []
        });
        setPageId(pageDoc.id);

      } catch (err) {
        console.error("Error fetching page:", err);
        toast.error("Failed to load page");
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [decodedUsername, productname]);

  const handleGoogleSignup = () => {
    setShowPopup(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      return;
    }

    try {
      if (!userId || !pageId) {
        throw new Error("Missing user or page ID");
      }

      const pageRef = doc(db, "users", userId, "pages", pageId);
      const newSubscriber = {
        name,
        email,
        joinedAt: new Date().toISOString()
      };

      // Update the waitlist array in the product document
      await updateDoc(pageRef, {
        waitlist: arrayUnion(newSubscriber)
      });

      // Update local state
      setPageData(prev => ({
        ...prev,
        waitlist: [...(prev?.waitlist || []), newSubscriber]
      }));

      toast.success("Added to waitlist!");
      setName("");
      setEmail("");
      setShowPopup(false);
    } catch (err) {
      console.error("Error saving to waitlist:", err);
      toast.error("Failed to join waitlist");
    }
  };

  if (loading) {
    return <Loader />
  }

  if (!pageData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Product not found</div>
      </div>
    );
  }

  return (
    <div>
      <MainContent
        editmaintitle={pageData?.title || null}
        editsubtitle={pageData?.subtitle || null}
        benefits={pageData?.benefits || null}
        parsedResponse={pageData?.parsedResponse}
        productName={pageData?.productName || null}
        handleGoogleSignup={handleGoogleSignup}
        waitlistCount={pageData?.waitlist?.length || 0}
        features={pageData?.features}
        featuresexplanation={pageData?.featuresexplanation}
        whyuseline={pageData?.whyuseline}
        whyusepoints={pageData?.whyusepoints}
        pageid={pageId}
        isPreview={false}
      />

      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-[90%] max-w-sm bg-white rounded-2xl shadow-xl p-6 animate-fadeInSlide">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-1">
              Join the Waitlist
            </h2>
            <p className="text-sm text-center text-blue-500 mb-5">
              Get notified when we launch!
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm font-medium transition shadow-sm"
                >
                  Join the Waitlist
                </button>
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;