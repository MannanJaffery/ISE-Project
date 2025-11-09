import { GoogleAuthProvider, reauthenticateWithPopup, deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const GoogleAccountDeletion =async () => {
 const user = auth.currentUser;
  const provider = new GoogleAuthProvider();

  try {

    await reauthenticateWithPopup(user, provider);


    await deleteDoc(doc(db, "users", user.uid));


    await deleteUser(user);

    console.log("Google account deleted successfully");
  } catch (err) {
    console.error("Error deleting Google account:", err);
  }
}

export default GoogleAccountDeletion
