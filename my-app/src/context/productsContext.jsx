
import { createContext, useState, useContext, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./authContext";

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const pagesRef = collection(db, "users", currentUser.uid, "pages");

    const unsubscribe = onSnapshot(
      pagesRef,
      (snapshot) => {
        const productList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to products:", error);
        setLoading(false);
      }
    );

  
    return () => unsubscribe();
  }, [currentUser?.uid]);

  return (
    <ProductsContext.Provider value={{ products, setProducts, loading }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
