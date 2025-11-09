import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const useEmail = () => {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const fetchEmail = async () => {
      const user = auth.currentUser;

      if (user && !email) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEmail(docSnap.data().email);
        }
      }
    };
    fetchEmail();
  }, [email]);

  return email;
};

export default useEmail;
