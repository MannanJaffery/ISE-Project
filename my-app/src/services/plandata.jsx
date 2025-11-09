
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";

let cachedPlanData = null;
let listeners = [];
let unsubscribe = null;

export const subscribeToPlanData = (callback) => {

  if (cachedPlanData !== null) {
    callback(cachedPlanData);
  }

  listeners.push(callback);

  if (!unsubscribe) {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "users", user.uid);

      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          cachedPlanData = docSnap.data().plan;
          listeners.forEach((cb) => cb(cachedPlanData));
        }
      });
    }
  }



  return () => {
    listeners = listeners.filter((cb) => cb !== callback);
    if (listeners.length === 0 && unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  };
};
