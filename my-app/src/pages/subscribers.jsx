import { useProducts } from "../context/productsContext";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../context/authContext";
import { Download, Users, Crown, BarChart3, ChevronDown, ChevronUp } from "lucide-react";

const Subscribers = () => {
  const { currentUser } = useAuth();
  const { products } = useProducts();
  const [payedSubscribers, setPayedSubscribers] = useState({});
  const [expandedProducts, setExpandedProducts] = useState({});

  useEffect(() => {
    const fetchSubscribers = async () => {
      let subscribersByProduct = {};

      for (let product of products) {
        try {
          const subRef = collection(
            db,
            "users",
            currentUser.uid,
            "pages",
            product.id,
            "subscribers"
          );

          const subSnap = await getDocs(subRef);
          subscribersByProduct[product.id] = subSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        } catch (error) {
          console.error("Error fetching subscribers:", error);
          subscribersByProduct[product.id] = [];
        }
      }

      setPayedSubscribers(subscribersByProduct);
    };

    if (products.length > 0 && currentUser) {
      fetchSubscribers();
    }
  }, [products, currentUser]);

  const downloadCSV = (product) => {
    const waitlistData = product.waitlist || [];
    const paidData = payedSubscribers[product.id] || [];

    const allData = [
      ...waitlistData.map((user) => ({
        email: user.email,
        name: user.name,
        type: "Waitlist",
      })),
      ...paidData.map((user) => ({
        email: user.email,
        name: user.name,
        type: "Paid",
      })),
    ];

    const headers = ["No.", "Name", "Email", "Type"];
    const csvContent = [
      headers.join(","),
      ...allData.map(
        (row, idx) =>
          `"${idx + 1}","${row.name}","${row.email}","${row.type}"`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${product.productName}_subscribers.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTotalSubscribers = (product) => {
    const waitlistCount = product.waitlist ? product.waitlist.length : 0;
    const paidCount = payedSubscribers[product.id]
      ? payedSubscribers[product.id].length
      : 0;
    return waitlistCount + paidCount;
  };

  const getPaidPercentage = (product) => {
    const total = getTotalSubscribers(product);
    if (total === 0) return 0;
    const paidCount = payedSubscribers[product.id]
      ? payedSubscribers[product.id].length
      : 0;
    return Math.round((paidCount / total) * 100);
  };

  const toggleExpand = (productId) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 text-center">
            <Users className="mx-auto h-12 w-12 md:h-16 md:w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No Products Found
            </h2>
            <p className="text-gray-500">
              Create your first product to start managing subscribers.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Subscriber Management
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            View and manage all your product subscribers in one place
          </p>
        </div>

        {/* Products List */}
        <div className="space-y-6">
          {products.map((product) => {
            const totalSubscribers = getTotalSubscribers(product);
            const paidPercentage = getPaidPercentage(product);
            const waitlistUsers = product.waitlist || [];
            const paidUsers = payedSubscribers[product.id] || [];
            const allUsers = [
              ...waitlistUsers.map((user) => ({ ...user, type: "waitlist" })),
              ...paidUsers.map((user) => ({ ...user, type: "paid" })),
            ];

            const expanded = expandedProducts[product.id] || false;

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Product Header */}
                <div className="p-4 md:p-6 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 mb-4 md:mb-0">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        {product.productName}
                      </h2>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 md:h-5 md:w-5 text-[#46AA72] mr-2" />
                          <span className="text-sm font-medium text-gray-700">
                            {totalSubscribers} total
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Crown className="h-4 w-4 md:h-5 md:w-5 text-amber-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">
                            {paidUsers.length} paid ({paidPercentage}%)
                          </span>
                        </div>
                        <div className="flex items-center">
                          <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-gray-500 mr-2" />
                          <div className="w-16 md:w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${paidPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => downloadCSV(product)}
                        className="inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-[#46AA72] text-white rounded-lg hover:bg-[hsl(146,42%,57%)] transition-colors text-sm font-medium"
                      >
                        <Download className="h-4 w-4" />
                        Export CSV
                      </button>
                      <button
                        onClick={() => toggleExpand(product.id)}
                        className="inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        {expanded ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            Hide
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            View
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Subscribers Table */}
                {expanded && (
                  <div className="p-4 md:p-6">
                    {allUsers.length > 0 ? (
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200">
                          <div className="col-span-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            #
                          </div>
                          <div className="col-span-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </div>
                          <div className="col-span-5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </div>
                          <div className="col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </div>
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                          {allUsers.map((user, idx) => (
                            <div
                              key={idx}
                              className={`grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-3 border-b border-gray-100 hover:bg-indigo-50 transition-colors ${
                                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }`}
                            >
                              <div className="md:col-span-1 text-sm text-gray-500 font-mono">
                                <span className="md:hidden text-xs text-gray-400 mr-2">#</span>
                                {idx + 1}
                              </div>
                              <div className="md:col-span-4 text-sm font-medium text-gray-900">
                                <span className="md:hidden text-xs text-gray-400 mr-2">Name: </span>
                                {user.name || "Not provided"}
                              </div>
                              <div className="md:col-span-5 text-sm text-gray-700 truncate">
                                <span className="md:hidden text-xs text-gray-400 mr-2">Email: </span>
                                {user.email}
                              </div>
                              <div className="md:col-span-2">
                                <span className="md:hidden text-xs text-gray-400 mr-2">Status: </span>
                                {user.type === "paid" ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    <Crown className="h-3.5 w-3.5" />
                                    Paid
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Waitlist
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Users className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-300 mb-3" />
                        <h3 className="text-sm font-medium text-gray-700 mb-1">
                          No subscribers yet
                        </h3>
                        <p className="text-xs text-gray-500">
                          Start promoting your product to get subscribers
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

};

export default Subscribers;
