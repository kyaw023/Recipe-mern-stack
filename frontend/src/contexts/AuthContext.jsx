import axios from "../helpers/axois";
import { createContext, useEffect, useReducer, useState } from "react";

const AuthContext = createContext();

const initialState = {
  user: null,
  loading: true,
};

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return { ...state, user: action.payload, loading: false };
    case "LOGOUT":
      localStorage.removeItem("user");
      return { ...state, user: null, loading: false };
    case "UPDATE_USER":
      console.log(action.payload);
      const updatedUser = { ...state.user, photo: action.payload };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return { ...state, user: updatedUser };
    default:
      return state;
  }
};

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/users/me");

        const user = res.data;
        if (user) {
          dispatch({ type: "LOGIN", payload: user });
        } else {
          dispatch({ type: "LOGOUT" });
        }
      } catch (error) {
        dispatch({ type: "LOGOUT" });
      }
    };

    fetchUser();
  }, []);

  const updateUser = (updatedUserData) => {
    dispatch({ type: "UPDATE_USER", payload: updatedUserData });
  };
  return (
    <AuthContext.Provider value={{ state, dispatch, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
