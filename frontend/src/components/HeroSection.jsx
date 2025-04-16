import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Utensils } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    text: "Delicious Food Delivered Fast 1",
    cta: "Order Now",
  },
  {
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    text: "Fresh Ingredients Daily 2",
    cta: "Order Now",
  },
  {
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
    text: "Special Offers Just For You 3",
    cta: "Order Now",
  },
];

const HeroSection = () => {
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);

  const handleOrderClick = () => {
    toast.success("Redirecting to menu...", {
      icon: <Utensils className="text-orange-500" />,
    });
    navigate("/go-to-hut");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.8 }}
          className="absolute inset-0 flex items-center"
          style={{
            backgroundImage: `url(${slides[currentSlide].image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-white max-w-lg"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {slides[currentSlide].text}
              </h1>
              <button
                onClick={handleOrderClick}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition-all"
              >
                {slides[currentSlide].cta}
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroSection;
