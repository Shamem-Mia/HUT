import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Lock } from "lucide-react";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Lock Illustration */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <div className="w-24 h-24 bg-red-200 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-red-300 rounded-full flex items-center justify-center">
                <Lock className="text-red-700 w-8 h-8" />
              </div>
            </div>
          </div>
          <Lock className="absolute top-0 right-0 text-red-400 w-8 h-8 transform rotate-12" />
          <Lock className="absolute bottom-0 left-0 text-red-400 w-8 h-8 transform -rotate-12" />
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Registration Required
        </h1>
        <p className="text-gray-600 mb-6">
          You need to create a account first to access this page.
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
          <button
            onClick={() => navigate("/register")}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Lock className="w-4 h-4 mr-2" />
            Create Account
          </button>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 flex justify-center space-x-6 opacity-50">
          <Lock className="w-6 h-6 text-gray-400" />
          <span className="text-gray-400">•</span>
          <Lock className="w-6 h-6 text-gray-400" />
          <span className="text-gray-400">•</span>
          <Lock className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
