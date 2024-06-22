import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const AdminDashboardPage = () => {
  return (
    <div className="max-w-[1400px] mx-auto py-5 ">
      <div className=" grid grid-cols-5 gap-2">
        {/* side */}
        <div className=" col-span-1 bg-slate-100 shadow-md rounded-xl h-[650px]  py-10 border-r-2">
          <div className=" px-5">
            <h1 className=" text-2xl font-semibold text-green-400">Mateam</h1>
          </div>
          <div>
            <h1 className=" font-semibold text-slate-500 mt-4 px-5">Menu</h1>
            <ul className=" mt-3 space-y-1">
              <li className=" bg-slate-200 py-2 px-5">
                <NavLink to={"/admin/users"}>Users</NavLink>
              </li>
              <li className=" bg-slate-200 py-2 px-5">
                <NavLink to={"/admin/recipes"}>Recipes</NavLink>
              </li>
              <li className=" bg-slate-200 py-2 px-5">
                <NavLink to={"/admin/report"}>Report</NavLink>
              </li>
            </ul>
          </div>
        </div>
        {/* main */}

        <div className=" col-span-4 bg-slate-100 shadow-md w-full h-[650px] overflow-scroll  px-5 py-10 rounded-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
