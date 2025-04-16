import React from "react";
import HeroSection from "../components/HeroSection";
import LinkBoxes from "../components/LinkBoxes";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import FoodItemSearchForHome from "../components/FoodItemSearchForHome";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <LinkBoxes />
      <FoodItemSearchForHome />

      {/* footer */}

      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
