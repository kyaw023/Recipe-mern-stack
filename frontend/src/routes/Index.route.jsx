import React, { useContext } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {
  AboutPage,
  ContactPage,
  EditProfilePage,
  FavoritePage,
  HomePage,
  LoginPage,
  RecipeDetailPage,
  RecipesFormPage,
  SearchPage,
  SignUpPage,
} from "../pages";

import App from "../App";

const IndexRoute = () => {
  const { state } = useContext(AuthContext);

  const { user, loading } = state;

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: user || loading ? <HomePage /> : <Navigate to={"/login"} />,
        },
        {
          path: "/about",
          element: <AboutPage />,
        },
        {
          path: "/contact",
          element: <ContactPage />,
        },
        {
          path: "/recipes/create",
          element:
            user || loading ? <RecipesFormPage /> : <Navigate to={"/login"} />,
        },
        {
          path: "/recipes/edit/:id",
          element:
            user || loading ? <RecipesFormPage /> : <Navigate to={"/login"} />,
        },
        {
          path: "/recipes/detail/:id",
          element:
            user || loading ? <RecipeDetailPage /> : <Navigate to={"/login"} />,
        },
        {
          path: "/recipes/search",
          element:
            user || loading ? <SearchPage /> : <Navigate to={"/login"} />,
        },
        {
          path: "/:id/favorite",
          element:
            user || loading ? <FavoritePage /> : <Navigate to={"/login"} />,
        },
        {
          path: "/sign-up",
          element: !user ? <SignUpPage /> : <Navigate to={"/"} />,
        },
        {
          path: "/login",
          element: !user ? <LoginPage /> : <Navigate to={"/"} />,
        },
        {
          path: "/editProfile/:id",
          element: !!user ? <EditProfilePage /> : <Navigate to={"/login"} />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default IndexRoute;
