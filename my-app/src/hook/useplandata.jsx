// hooks/usePlanData.js
import { useEffect, useState } from "react";
import { subscribeToPlanData } from "../services/plandata";


const usePlanData = () => {
  const [planData, setPlanData] = useState(null);

  useEffect(() => {
    // subscribe to shared service
    const unsub = subscribeToPlanData(setPlanData);

    return () => unsub(); // cleanup
  }, []);

  return planData;
};

export default usePlanData;
