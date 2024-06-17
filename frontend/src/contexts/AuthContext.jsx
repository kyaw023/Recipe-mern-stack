import axios from "../helpers/axois";
import { createContext, useEffect, useReducer } from "react";

const AuthContext = createContext();

// const AuthReducer = (state, action) => {
//   switch (action.type) {
//     case "LOGIN":
//       localStorage.setItem("user", JSON.stringify(action.payload));
//       return { user: action.payload };
//     case "LOGOUT":
//       localStorage.removeItem("user");
//       return { user: null };
//     default:
//       return state;
//   }
// };
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
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
