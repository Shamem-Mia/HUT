import { useState } from "react";
import { axiosInstance } from "../context/axiosInstance";
import toast from "react-hot-toast";
import { useAuthStore } from "../stores/useAuthStore";

const DeliveryManRequest = () => {
  const { authUser } = useAuthStore();
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    workArea: "",
    age: "",
    profession: "",
    vehicleType: "bicycle",
    experience: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/delivery-man/request", {
        ...formData,
        userId: authUser._id,
      });
      toast.success("Request submitted successfully!");
      setFormData({
        phone: "",
        address: "",
        workArea: "",
        age: "",
        profession: "",
        vehicleType: "bicycle",
        experience: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Request for Delivery Job and Become Partner
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Work Area
          </label>
          <input
            type="text"
            name="workArea"
            value={formData.workArea}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="18"
              max="65"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profession
            </label>
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vehicle Type
          </label>
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="bicycle">Bicycle</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="car">Car</option>
            <option value="walking">Walking</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Delivery Experience (years)
          </label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            min="0"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default DeliveryManRequest;
