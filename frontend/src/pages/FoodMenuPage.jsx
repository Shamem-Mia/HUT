import { useState, useEffect, useRef } from "react";
import { axiosInstance } from "../context/axiosInstance";
import { toast } from "react-hot-toast";
import { Search, Loader2, X } from "lucide-react";
import ShopCard from "../components/ShopCard";

const FoodMenuPage = () => {
  const [localArea, setLocalArea] = useState("");
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const searchShops = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const { data } = await axiosInstance.get(
          `/food-items?localArea=${encodeURIComponent(localArea)}`,
          { signal: abortControllerRef.current.signal }
        );

        if (!Array.isArray(data)) throw new Error("Invalid data format");
        const openShops = data.filter((shop) => shop.isOpen !== false);

        setShops(openShops);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Search error:", err);
          setError(err.message);
          toast.error(err.response?.data?.message || "Search failed");
          setShops([]);
        }
      } finally {
        setLoading(false);
      }
    };

    if (localArea.trim().length >= 2) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(searchShops, 500);
    } else {
      setShops([]);
    }

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [localArea]);

  const handleInputChange = (e) => setLocalArea(e.target.value);

  const clearSearch = () => {
    setLocalArea("");
    setShops([]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Find Shops Near You</h1>

      <div className="mb-8 max-w-md mx-auto">
        <label
          htmlFor="search"
          className="text-green-600 font-semibold text-lg"
        >
          Type Your University / Local Area
        </label>
        <div className="relative flex items-center bg-white rounded-lg shadow-sm border mt-2">
          <div className="pl-3 text-gray-500">
            <Search size={20} />
          </div>
          <input
            id="search"
            type="text"
            value={localArea}
            onChange={handleInputChange}
            placeholder="Type your local area (e.g. CUET)"
            className="flex-1 px-3 py-3 focus:outline-none"
            aria-label="Search shops by location"
          />
          {localArea && (
            <button
              onClick={clearSearch}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
          {loading && (
            <div className="pr-3">
              <Loader2 className="animate-spin h-5 w-5 text-blue-500" />
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2 pl-1">
          {localArea.length > 0 && localArea.length < 2
            ? "Type at least 2 characters"
            : shops.length > 0
            ? `${shops.length} ${shops.length === 1 ? "shop" : "shops"} found`
            : "Results will update automatically"}
        </p>
      </div>

      {error ? (
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => setError(null)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry Search
          </button>
        </div>
      ) : shops.length === 0 && localArea.length >= 2 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          {loading ? (
            <p className="text-gray-600">Searching shops in {localArea}...</p>
          ) : (
            <p className="text-gray-600">
              No shops found in <span className="font-medium">{localArea}</span>
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {shops.map((shop) => (
            <ShopCard key={shop._id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodMenuPage;
