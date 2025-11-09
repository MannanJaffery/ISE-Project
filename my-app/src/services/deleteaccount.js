import { auth, db } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";


const deleteAccount = async (email, password) => {
  const user = auth.currentUser;

  try {
    if (!user) throw new Error("No authenticated user found.");

    const credential = EmailAuthProvider.credential(email, password);
    await reauthenticateWithCredential(user, credential);


    await deleteDoc(doc(db, "users", user.uid));

    await deleteUser(user);

    alert("Your account has been deleted successfully.");
  } catch (error) {
    console.error("Error deleting account:", error);
    alert(error.message || "Failed to delete account, try again later.");
  }
};

export default deleteAccount;
