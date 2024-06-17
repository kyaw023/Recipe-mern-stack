import React from "react";
import { Loader2 } from "lucide-react";

const LoadingComponent = ({ children, isLoading }) => {
  return (
    <div>
      {isLoading ? (
        <div className=" flex items-center h-screen justify-center">
          <Loader2 className="mr-2 h-6 w-6 animate-spin " />
          <p className="">Please wait</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default LoadingComponent;
