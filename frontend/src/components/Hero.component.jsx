import React from "react";
import Chef from "../assets/Chef.json";
import Lottie from "lottie-react";

const HeroComponent = () => {
  return (
    <div className=" pt-3 pb-12 flex items-start justify-between">
      <div className="  space-y-3">
        <h1 className=" text-4xl font-semibold">
          Recipes for your <br /> Home Cooked Meals
        </h1>
        <p className=" max-w-sm mx-auto text-sm text-slate-500">
          Elevate your home-cook meals with our delicious recipe collection,
          Impress your family with your culinary
        </p>
      </div>
      <div className=" w-[400px] h-[400px] mx-auto">
        <Lottie animationData={Chef} />
      </div>
    </div>
  );
};

export default HeroComponent;
