import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Trash2,
  AlertCircle,
  Store,
  RotateCcw,
  Loader,
} from "lucide-react";
import { axiosInstance } from "../context/axiosInstance";
import toast from "react-hot-toast";

const AdminShopEdit = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    shopName: "",
    shopCategory: "",
    shopPin: "",
    status: "pending",
    contactNumber: "",
    BkashNumber: "",
    NagadNumber: "",
    permanentAddress: "",
    localAreas: [],
    deliveryCharge: [],
    deliveryCount: 0,
    isOpen: true,
    isBlock: false,
    image: "",
  });

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/shops/${shopId}`);
        setShop(data);
        setFormData({
          shopName: data.shopName,
          shopCategory: data.shopCategory,
          shopPin: data.shopPin,
          status: data.status,
          contactNumber: data.contactNumber,
          BkashNumber: data.BkashNumber,
          NagadNumber: data.NagadNumber,
          permanentAddress: data.permanentAddress,
          localAreas: data.localAreas || [],
          deliveryCharge: data.deliveryCharge || [],
          deliveryCount: data.deliveryCount || 0,
          isOpen: data.isOpen,
          isBlock: data.isBlock || false,
          image: data.image || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch shop details");
        toast.error("Failed to fetch shop details");
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [shopId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value.split(",").map((item) => item.trim()),
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, "");
    setFormData((prev) => ({
      ...prev,
      [name]: digitsOnly,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axiosInstance.put(`/shops/${shopId}`, formData);

      toast.success("Shop updated successfully");
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update shop");
      toast.error("Failed to update shop");
    } finally {
      setSaving(false);
    }
  };

  const handleResetDeliveryCount = async () => {
    if (
      !window.confirm("Are you sure you want to reset the delivery count to 0?")
    ) {
      return;
    }

    try {
      setResetting(true);
      await axiosInstance.patch(`/shops/${shopId}/reset-deliveries`);
      setFormData((prev) => ({
        ...prev,
        deliveryCount: 0,
      }));
      toast.success("Delivery count reset successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset delivery count");
      toast.error("Failed to reset delivery count");
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Store className="text-blue-500" /> Edit Shop: {shop?.shopName}
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              Basic Information
            </h2>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isBlock"
                checked={formData.isBlock}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isBlock: e.target.checked,
                    // If blocking, also close the shop
                    isOpen: e.target.checked ? false : prev.isOpen,
                  }))
                }
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Block this shop (will also close the shop)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isOpen"
                checked={formData.isOpen}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isOpen: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Shop is currently open
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Name
              </label>
              <input
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Category
              </label>
              <input
                type="text"
                name="shopCategory"
                value={formData.shopCategory}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop PIN
              </label>
              <input
                type="text"
                name="shopPin"
                value={formData.shopPin}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              Contact Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleNumberChange}
                maxLength={11}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bkash Number
              </label>
              <input
                type="text"
                name="BkashNumber"
                value={formData.BkashNumber}
                onChange={handleNumberChange}
                maxLength={11}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nagad Number
              </label>
              <input
                type="text"
                name="NagadNumber"
                value={formData.NagadNumber}
                onChange={handleNumberChange}
                maxLength={11}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Location Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              Location Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Permanent Address
              </label>
              <textarea
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Local Areas (comma separated)
              </label>
              <textarea
                value={formData.localAreas.join(", ")}
                onChange={(e) =>
                  handleArrayChange("localAreas", e.target.value)
                }
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Delivery Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              Delivery Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Charges (comma separated)
              </label>
              <textarea
                value={formData.deliveryCharge.join(", ")}
                onChange={(e) =>
                  handleArrayChange("deliveryCharge", e.target.value)
                }
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Deliveries
                </label>
                <input
                  type="number"
                  value={formData.deliveryCount}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <button
                type="button"
                onClick={handleResetDeliveryCount}
                disabled={resetting}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 mt-6 disabled:opacity-70"
              >
                {resetting ? (
                  <Loader className="animate-spin" size={16} />
                ) : (
                  <RotateCcw size={16} />
                )}
                Reset Count
              </button>
            </div>
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-70"
          >
            {saving ? (
              <Loader className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminShopEdit;
