import React, { useContext, useEffect, useState } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {
  AboutPage,
  AdminDashboardPage,
  AdminRecipesPage,
  AdminUsersPage,
  ContactPage,
  EditProfilePage,
  FavoritePage,
  HomePage,
  LoginPage,
  RecipeDetailPage,
  RecipesFormPage,
  ResetPasswordPage,
  SearchPage,
  SignUpPage,
} from "../pages";

import App from "../App";
import { LoadingComponent } from "../components";

const IndexRoute = () => {
  const { state } = useContext(AuthContext);

  const { user, loading } = state;

  const isAdmin = user && user?.role == "admin";

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
          path: "/reset-password/:id",
          element:
            user || loading ? (
              <ResetPasswordPage />
            ) : (
              <Navigate to={"/login"} />
            ),
        },
        {
          path: "/sign-up",
          element: !user && !loading ? <SignUpPage /> : <Navigate to={"/"} />,
        },
        {
          path: "/login",
          element: !user && !loading ? <LoginPage /> : <Navigate to={"/"} />,
        },
        {
          path: "/editProfile/:id",
          element: !!user ? <EditProfilePage /> : <Navigate to={"/login"} />,
        },
      ],
    },
    {
      path: "/admin",
      element: loading ? (
        <LoadingComponent />
      ) : isAdmin ? (
        <AdminDashboardPage />
      ) : (
        <Navigate to={"/login"} />
      ),
      children: [
        {
          index: true,
          path: "users",
          element: loading ? (
            <LoadingComponent />
          ) : isAdmin ? (
            <AdminUsersPage />
          ) : (
            <Navigate to={"/login"} />
          ),
        },
        {
          path: "recipes",
          element: loading ? (
            <LoadingComponent />
          ) : isAdmin ? (
            <AdminRecipesPage />
          ) : (
            <Navigate to={"/login"} />
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default IndexRoute;
