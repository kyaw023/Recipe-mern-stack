import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import { Toaster } from "./components/ui/sonner.jsx";

import { AuthContextProvider } from "./contexts/AuthContext.jsx";
import IndexRoute from "./routes/Index.route.jsx";
import { SearchContextProvider } from "./contexts/SearchContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <AuthContextProvider>
      <SearchContextProvider>
        <IndexRoute />
      </SearchContextProvider>
    </AuthContextProvider>
    <Toaster />
  </>
);
