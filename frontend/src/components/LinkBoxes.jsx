import { DoorOpen, Store } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const LinkBoxes = () => {
  // CSS animation for continuous bouncing
  const bounceAnimation = {
    animation: "bounce 1s infinite",
  };

  // Add the animation to global styles
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {/* Card 1: Your Hut - Orange theme */}
        <Link
          to="/my-hut"
          className="bg-orange-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center text-center border border-orange-100"
        >
          <div
            className="bg-orange-100 p-3 md:p-4 rounded-full mb-3 md:mb-4"
            style={bounceAnimation}
          >
            <svg
              className="w-6 h-6 md:w-8 md:h-8 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <h3 className="text-md md:text-lg font-semibold mb-1 md:mb-2 text-orange-800">
            My HUT
          </h3>
          <p className="text-xs md:text-sm text-orange-600">
            Get your all information
          </p>
        </Link>

        {/* Card 2: Find Local Shop - Green theme */}
        <Link
          to="/go-to-hut"
          className="bg-green-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center text-center border border-green-100"
        >
          <div
            className="bg-green-100 p-3 md:p-4 rounded-full mb-3 md:mb-4"
            style={bounceAnimation}
          >
            <svg
              className="w-6 h-6 md:w-8 md:h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h3 className="text-md md:text-lg font-semibold mb-1 md:mb-2 text-green-800">
            Go to HUT
          </h3>
          <p className="text-xs md:text-sm text-green-600">
            Discover shops near you and order
          </p>
        </Link>

        {/* Card 3: Manage Order - Blue theme */}
        <Link
          to="/shop-ownership-request"
          className="bg-blue-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center text-center border border-blue-100"
        >
          <div
            className="bg-blue-100 p-3 md:p-4 rounded-full mb-3 md:mb-4"
            style={bounceAnimation}
          >
            <Store size={28} />
          </div>

          <h3 className="text-md md:text-lg font-semibold mb-1 md:mb-2 text-blue-800">
            Open Your Shop
          </h3>
          <p className="text-xs md:text-sm text-blue-600">
            Open your shop in HUT for free
          </p>
        </Link>

        {/* Card 4: Recommended - Purple theme */}
        <Link
          to="/recommended"
          className="bg-purple-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center text-center border border-purple-100"
        >
          <div
            className="bg-purple-100 p-3 md:p-4 rounded-full mb-3 md:mb-4"
            style={bounceAnimation}
          >
            <svg
              className="w-6 h-6 md:w-8 md:h-8 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>
          <h3 className="text-md md:text-lg font-semibold mb-1 md:mb-2 text-purple-800">
            Recommended
          </h3>
          <p className="text-xs md:text-sm text-purple-600">
            Personalized suggestions for you
          </p>
        </Link>
      </div>
    </div>
  );
};

export default LinkBoxes;
