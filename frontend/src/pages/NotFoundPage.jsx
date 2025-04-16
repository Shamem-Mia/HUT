import { useNavigate } from "react-router-dom";
import { Home, Utensils, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <div className="w-24 h-24 bg-red-200 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-red-300 rounded-full flex items-center justify-center">
                <span className="text-red-700 font-bold text-2xl">404</span>
              </div>
            </div>
          </div>
          <Utensils className="absolute top-0 right-0 text-red-400 w-8 h-8 transform rotate-12" />
          <Utensils className="absolute bottom-0 left-0 text-red-400 w-8 h-8 transform -rotate-12" />
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </button>
        </div>

        {/* Food-related decorative elements */}
        <div className="mt-12 flex justify-center space-x-6 opacity-50">
          <Utensils className="w-6 h-6 text-gray-400" />
          <span className="text-gray-400">•</span>
          <Utensils className="w-6 h-6 text-gray-400" />
          <span className="text-gray-400">•</span>
          <Utensils className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
