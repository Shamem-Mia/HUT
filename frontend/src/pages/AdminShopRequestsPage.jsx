import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../context/axiosInstance";
import AdminShopSearch from "../components/AdminShopSearch";

const AdminShopRequestsPage = () => {
  const { authUser } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

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
      // Filter to only show pending requests
      setRequests(data.filter((request) => request.status === "pending"));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (shopId) => {
    try {
      setProcessing(true);
      await axiosInstance.put(`/owners/approve-ownership/${shopId}`);
      toast.success("Shop approved successfully");
      fetchPendingRequests(); // This will refetch and filter again
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
      fetchPendingRequests(); // This will refetch and filter again
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject request");
    } finally {
      setProcessing(false);
    }
  };

  if (authUser?.role !== "admin") {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        Unauthorized Access
      </div>
    );
  }

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* search by pin */}
      <AdminShopSearch />
      <h1 className="text-2xl font-bold mb-6">Pending Shop Requests</h1>
      <div className="space-y-4">
        {requests.length === 0 ? (
          <p className="text-gray-500">No pending requests</p>
        ) : (
          requests.map((request) => (
            <div
              key={request._id}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold">{request.shopName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <p>
                  Category:{" "}
                  <span className="font-medium">{request.shopCategory}</span>
                </p>
                <p>
                  Location:{" "}
                  <span className="font-medium">{request.localArea}</span>
                </p>
                <p>
                  Owner:{" "}
                  <span className="font-medium">{request.owner?.name}</span>
                </p>
                <p>
                  Email:{" "}
                  <span className="font-medium">{request.owner?.email}</span>
                </p>
              </div>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => handleApprove(request._id)}
                  disabled={processing}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {processing ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => handleReject(request._id)}
                  disabled={processing}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {processing ? "Processing..." : "Reject"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminShopRequestsPage;
