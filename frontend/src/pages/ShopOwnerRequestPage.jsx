import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { axiosInstance } from "../context/axiosInstance";
import { useNavigate } from "react-router-dom";

const ShopOwnerRequestPage = () => {
  const { authUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    shopName: "",
    localAreas: [""],
    permanentAddress: "",
    shopCategory: "",
    contactNumber: "",
    BkashNumber: "",
    NagadNumber: "",
    selfDelivery: true,
    additionalInfo: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const shopCategories = [
    "Food Delivery",
    "Library",
    "Stationery",
    "Printing",
    "Confectionary",
    "Electronics",
    "Clothing",
    "Laundry Services",
    "Pharmacy",
    "Old Books",
    "Others",
  ];

  // to handle adding/removing local areas
  const handleLocalAreaChange = (index, value) => {
    const newLocalAreas = [...formData.localAreas];
    newLocalAreas[index] = value;
    setFormData({ ...formData, localAreas: newLocalAreas });
  };

  const addLocalAreaField = () => {
    if (formData.localAreas.length >= 20) {
      // Example limit of 5
      toast.error("Maximum 20 local areas allowed");
      return;
    }
    setFormData({ ...formData, localAreas: [...formData.localAreas, ""] });
  };

  const removeLocalAreaField = (index) => {
    if (formData.localAreas.length <= 1) return;
    const newLocalAreas = formData.localAreas.filter((_, i) => i !== index);
    setFormData({ ...formData, localAreas: newLocalAreas });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.shopName.trim()) newErrors.shopName = "Shop name is required";
    if (!formData.localAreas.some((area) => area.trim())) {
      newErrors.localAreas = "At least one local area is required";
    }
    if (!formData.permanentAddress.trim())
      newErrors.permanentAddress = "Permanent address is required";
    if (!formData.shopCategory)
      newErrors.shopCategory = "Shop category is required";
    if (!formData.contactNumber.trim())
      newErrors.contactNumber = "Contact number is required";
    if (formData.contactNumber && !/^\d{11}$/.test(formData.contactNumber))
      newErrors.contactNumber = "Contact number must be 11 digits";
    if (formData.BkashNumber && !/^\d{11}$/.test(formData.BkashNumber))
      newErrors.BkashNumber = "Bkash number must be 11 digits";
    if (formData.NagadNumber && !/^\d{11}$/.test(formData.NagadNumber))
      newErrors.NagadNumber = "Nagad number must be 11 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!authUser) {
      toast.error("You must be logged in to submit a request");
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(
        "/owners/shop-ownership-request",
        {
          ...formData,
          localAreas: formData.localAreas
            .map((area) => area.trim())
            .filter((area) => area),
          contactNumber: Number(formData.contactNumber),
          BkashNumber: formData.BkashNumber
            ? Number(formData.BkashNumber)
            : null,
          NagadNumber: formData.NagadNumber
            ? Number(formData.NagadNumber)
            : null,
        }
      );

      toast.success(
        "Request submitted successfully! Waiting for admin approval"
      );
      setFormData({
        shopName: "",
        localAreas: [""],
        permanentAddress: "",
        shopCategory: "",
        contactNumber: "",
        BkashNumber: "",
        NagadNumber: "",
        additionalInfo: "",
      });
      navigate("/shop-owner-confirmation");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to submit request";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Become a Shop Owner
          </h1>
          <p className="mt-3 text-xl text-gray-600">
            Fill out the form below to request shop ownership
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-8 sm:p-10">
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Shop Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Shop Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3 border ${
                    errors.shopName ? "border-red-500" : "border-gray-300"
                  } transition duration-200`}
                  placeholder="Enter your shop name"
                />
                {errors.shopName && (
                  <p className="mt-1 text-sm text-red-600 animate-fadeIn">
                    {errors.shopName}
                  </p>
                )}
              </div>

              {/* Local Area */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Local Areas (যেসব এরিয়াতে আপনার প্রডাক্ট বিক্রি করবেন )
                  <span className="text-red-500">*</span>
                </label>

                {formData.localAreas.map((area, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={area}
                      onChange={(e) =>
                        handleLocalAreaChange(index, e.target.value)
                      }
                      className={`flex-1 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3 border ${
                        errors.localAreas ? "border-red-500" : "border-gray-300"
                      } transition duration-200`}
                      placeholder={`Local area ${index + 1}`}
                    />
                    {formData.localAreas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLocalAreaField(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addLocalAreaField}
                  className="text-sm text-orange-600 hover:text-orange-800 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add another local area
                </button>

                {errors.localAreas && (
                  <p className="mt-1 text-sm text-red-600 animate-fadeIn">
                    {errors.localAreas}
                  </p>
                )}
              </div>

              <div className="mt-4 mb-6">
                {/* Self Delivery Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="selfDelivery"
                    name="selfDelivery"
                    checked={formData.selfDelivery}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        selfDelivery: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="selfDelivery"
                    className="text-sm text-gray-700"
                  >
                    We will provide self delivery service (আমাদের প্রডাক্ট আমরা
                    নিজেই ডেলিভারি দিবো )
                  </label>
                </div>
              </div>

              {/* Permanent Address */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Permanent Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  rows={3}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3 border ${
                    errors.permanentAddress
                      ? "border-red-500"
                      : "border-gray-300"
                  } transition duration-200`}
                  placeholder="Enter your permanent address"
                />
                {errors.permanentAddress && (
                  <p className="mt-1 text-sm text-red-600 animate-fadeIn">
                    {errors.permanentAddress}
                  </p>
                )}
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Contact Information
                </h3>

                {/* Contact Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    maxLength={11}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3 border ${
                      errors.contactNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    } transition duration-200`}
                    placeholder="01XXXXXXXXX"
                  />
                  {errors.contactNumber && (
                    <p className="mt-1 text-sm text-red-600 animate-fadeIn">
                      {errors.contactNumber}
                    </p>
                  )}
                </div>

                {/* Payment Numbers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bkash Number */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Bkash Number
                    </label>
                    <input
                      type="tel"
                      name="BkashNumber"
                      value={formData.BkashNumber}
                      onChange={handleChange}
                      maxLength={11}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3 border ${
                        errors.BkashNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      } transition duration-200`}
                      placeholder="01XXXXXXXXX"
                    />
                    {errors.BkashNumber && (
                      <p className="mt-1 text-sm text-red-600 animate-fadeIn">
                        {errors.BkashNumber}
                      </p>
                    )}
                  </div>

                  {/* Nagad Number */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Nagad Number
                    </label>
                    <input
                      type="tel"
                      name="NagadNumber"
                      value={formData.NagadNumber}
                      onChange={handleChange}
                      maxLength={11}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3 border ${
                        errors.NagadNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      } transition duration-200`}
                      placeholder="01XXXXXXXXX"
                    />
                    {errors.NagadNumber && (
                      <p className="mt-1 text-sm text-red-600 animate-fadeIn">
                        {errors.NagadNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shop Category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Shop Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="shopCategory"
                  value={formData.shopCategory}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3 border ${
                    errors.shopCategory ? "border-red-500" : "border-gray-300"
                  } transition duration-200`}
                >
                  <option value="">Select a category</option>
                  {shopCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.shopCategory && (
                  <p className="mt-1 text-sm text-red-600 animate-fadeIn">
                    {errors.shopCategory}
                  </p>
                )}
              </div>

              {/* Additional Information */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Additional Information
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3 border border-gray-300 transition duration-200"
                  placeholder="Any additional details about your shop"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-70 transition duration-200 transform hover:scale-[1.01]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Processing...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopOwnerRequestPage;
