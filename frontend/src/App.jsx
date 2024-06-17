import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { NavbarComponents } from "./components";
import { AuthContext } from "./contexts/AuthContext";

const App = () => {
  const { state } = useContext(AuthContext);

  return (
    <>
      {state?.user && <NavbarComponents />}

      <div className="  py-3">
        <div className="max-w-[1200px] mx-auto mt-20">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default App;
