import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth , db } from "../firebase";


const useUsername = () => {
  const [username, setUsername] = useState(null);
  const [uid , setUid] = useState(null);


  useEffect(() => {


    const fetchUsername = async () => {
      const user = auth.currentUser;



      if(user) setUid(user.uid);
      
      
      if (user && !username ) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUsername(docSnap.data().username);
          
        }
      }
    };
    fetchUsername();
  }, []);

  return {username,uid};
};

export default useUsername;