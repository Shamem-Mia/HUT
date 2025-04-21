import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../context/axiosInstance";
import AdminShopSearch from "../components/AdminShopSearch";
import { ChevronDown, ChevronUp } from "lucide-react";

const AdminShopRequestsPage = () => {
  const { authUser } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [expandedRequest, setExpandedRequest] = useState(null);

  useEffect(() => {
    if (authUser?.role === "admin") {
      fetchPendingRequests();
    }
  }, [authUser]);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        "/owners/shop-ownership-request"
      );
      setRequests(data.filter((request) => request.status === "pending"));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandRequest = (requestId) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  const handleApprove = async (shopId) => {
    try {
      setProcessing(true);
      await axiosInstance.put(`/owners/approve-ownership/${shopId}`);
      toast.success("Shop approved successfully");
      fetchPendingRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve request");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (shopId) => {
    try {
      setProcessing(true);
      await axiosInstance.delete(`/owners/reject-ownership/${shopId}`);
      toast.success("Shop request rejected");
      fetchPendingRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject request");
    } finally {
      setProcessing(false);
    }
  };

  if (authUser?.role !== "admin") {
    return (
      <div className="container mx-auto p-4 text-center text-red-600 font-semibold text-lg">
        ❌ Unauthorized Access
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center text-blue-600 font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <AdminShopSearch />
      <h1 className="text-3xl font-extrabold text-purple-700 mb-6 text-center">
        Pending Shop Requests
      </h1>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <p className="text-gray-500 text-center">🎉 No pending requests</p>
        ) : (
          requests.map((request) => (
            <div
              key={request._id}
              className="border border-purple-200 p-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300 bg-gradient-to-r from-purple-50 via-white to-purple-50"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpandRequest(request._id)}
              >
                <div>
                  <h2 className="text-xl font-bold text-purple-800">
                    {request.shopName}
                  </h2>
                  <p className="text-sm text-purple-500">
                    {request.shopCategory}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-2 py-1 text-xs bg-yellow-200 text-yellow-900 rounded-full">
                    Pending
                  </span>
                  {expandedRequest === request._id ? (
                    <ChevronUp className="w-5 h-5 text-purple-700" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-purple-700" />
                  )}
                </div>
              </div>

              {expandedRequest === request._id && (
                <div className="mt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-purple-100">
                      <h3 className="font-semibold mb-2 text-purple-800">
                        Shop Information
                      </h3>
                      <div className="space-y-2 text-sm text-purple-900">
                        <p>
                          <span className="font-semibold">PIN:</span>{" "}
                          {request.shopPin}
                        </p>
                        <p>
                          <span className="font-semibold">
                            Delivery Charge:
                          </span>{" "}
                          ৳{request.deliveryCharge?.[0] || 0}
                        </p>
                        <p>
                          <span className="font-semibold">Self Delivery:</span>{" "}
                          {request.selfDelivery ? "Yes" : "No"}
                        </p>
                        <p>
                          <span className="font-semibold">
                            Additional Info:
                          </span>{" "}
                          {request.additionalInfo || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-purple-100">
                      <h3 className="font-semibold mb-2 text-purple-800">
                        Location
                      </h3>
                      <div className="space-y-2 text-sm text-purple-900">
                        <p>
                          <span className="font-semibold">Address:</span>{" "}
                          {request.permanentAddress}
                        </p>
                        <p>
                          <span className="font-semibold">Areas:</span>{" "}
                          {request.localAreas?.join(", ")}
                        </p>
                        <p>
                          <span className="font-semibold">Contact:</span> 0
                          {request.contactNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-purple-100">
                    <h3 className="font-semibold mb-2 text-purple-800">
                      Payment Methods
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-900">
                      <p>
                        <span className="font-semibold">Bkash:</span> 0
                        {request.BkashNumber}
                      </p>
                      <p>
                        <span className="font-semibold">Nagad:</span> 0
                        {request.NagadNumber}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-purple-100">
                    <h3 className="font-semibold mb-2 text-purple-800">
                      Owner Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-900">
                      <p>
                        <span className="font-semibold">Email:</span>{" "}
                        {request.owner?.email}
                      </p>
                      <p>
                        <span className="font-semibold">ID:</span>{" "}
                        {request.owner?._id}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-purple-100">
                    <h3 className="font-semibold mb-2 text-purple-800">
                      Timeline
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-900">
                      <p>
                        <span className="font-semibold">Created:</span>{" "}
                        {new Date(request.createdAt).toLocaleString()}
                      </p>
                      <p>
                        <span className="font-semibold">Updated:</span>{" "}
                        {new Date(request.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => handleApprove(request._id)}
                      disabled={processing}
                      className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 shadow-md"
                    >
                      {processing ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleReject(request._id)}
                      disabled={processing}
                      className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 shadow-md"
                    >
                      {processing ? "Processing..." : "Reject"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminShopRequestsPage;
