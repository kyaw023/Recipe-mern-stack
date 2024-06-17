import { createContext, useState } from "react";

const SearchContext = createContext();

const SearchContextProvider = ({ children }) => {
  const [search, setSearch] = useState("");

  const searchHandler = (value) => {
    setSearch(value);
  };

  return (
    <SearchContext.Provider value={{ search, setSearch, searchHandler }}>
      {children}
    </SearchContext.Provider>
  );
};

export { SearchContext, SearchContextProvider };
