import { useEffect, useState } from "react";
import { axiosInstance } from "../context/axiosInstance";
import toast from "react-hot-toast";

const GetDeliveryManRequestsAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/delivery-man/requests");
      setRequests(res.data || []);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      toast.error("Failed to fetch requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (requestId, decision) => {
    try {
      await axiosInstance.put(`/delivery-man/requests/${requestId}`, {
        decision,
      });
      toast.success(`Request ${decision}`);
      fetchRequests();
    } catch (err) {
      console.error("Decision error:", err);
      toast.error(`Failed to ${decision} request`);
    }
  };

  if (loading)
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto p-4 text-red-500">
        Error: {error}
        <button
          onClick={fetchRequests}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Delivery Man Requests</h2>

      {requests.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p>No pending requests found</p>
          <button
            onClick={fetchRequests}
            className="mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request._id} className="bg-white p-4 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">
                    {request.user?.name || "N/A"}
                  </h3>
                  <p>Email: {request.user?.email || "N/A"}</p>
                  <p>Phone: {request.phone || "N/A"}</p>
                  <p>Age: {request.age || "N/A"}</p>
                </div>
                <div>
                  <p>Address: {request.address || "N/A"}</p>
                  <p>Work Area: {request.workArea || "N/A"}</p>
                  <p>Vehicle: {request.vehicleType || "N/A"}</p>
                  <p>Experience: {request.experience || "0"} years</p>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleDecision(request._id, "rejected")}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleDecision(request._id, "approved")}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetDeliveryManRequestsAdmin;
