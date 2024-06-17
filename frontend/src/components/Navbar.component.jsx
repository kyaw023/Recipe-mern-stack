import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "../helpers/axois";
import { toast } from "sonner";
import { AuthContext } from "../contexts/AuthContext";
import { ProfileComponent } from ".";
import { SearchContext } from "../contexts/SearchContext";

const NavbarComponent = () => {
  const nav = useNavigate();
  const [queryValue, setQueryValue] = useState("");
  const { dispatch, state } = useContext(AuthContext);
  const { searchHandler } = useContext(SearchContext);

  const onsubmitHandler = (e) => {
    e.preventDefault();
    searchHandler(queryValue);
    nav(`/recipes/search?q=${queryValue}`);
    setQueryValue((prev) => (prev = ""));
  };

  const logoutHandler = async () => {
    const logoutUser = await axios.post("/api/users/logout");
    if (logoutUser.status === 200) {
      dispatch({ type: "LOGOUT" });
      nav("/login");
      toast.success("Logout successfully");
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <section className=" fixed w-full shadow-sm bg-white">
      <nav className=" max-w-[1200px] mx-auto py-3">
        <div className=" flex items-center justify-between">
          {/* logo */}
          <ul>
            <li className=" text-green-400 text-2xl font-semibold">
              <Link to={"/"}>Mateam</Link>
            </li>
          </ul>

          {/* navLink */}
          <ul>
            <li className=" space-x-4">
              <NavLink to="/">Home</NavLink>
              <NavLink to="about">About</NavLink>
              <NavLink to="contact">Contact</NavLink>
              <NavLink to="recipes/create">Add Recipes</NavLink>
            </li>
          </ul>

          {/* user info */}

          {/* login and logout buttons */}
          <div className=" flex items-center space-x-4">
            {/* search  */}
            <div>
              <form onSubmit={onsubmitHandler}>
                <Input
                  value={queryValue}
                  onChange={(e) => setQueryValue(e.target.value)}
                  className="rounded w-[280px]"
                  placeholder="search"
                />
              </form>
            </div>

            <div>
              {state?.user ? (
                <div className=" flex items-center space-x-2">
                  <div>
                    <ProfileComponent
                      id={user?._id}
                      logoutHandler={logoutHandler}
                    />
                  </div>
                </div>
              ) : (
                <div className=" space-x-3">
                  <Link to={"/login"}>
                    <Button variant="outline" className=" rounded">
                      Sign in
                    </Button>
                  </Link>
                  <Link to={"/sign-up"}>
                    <Button className=" bg-black text-white rounded hover:bg-slate-900">
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </section>
  );
};

export default NavbarComponent;
