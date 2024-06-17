import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { LoadingComponent, RecipesCardComponents } from "../components";
import useFetch from "../Hook/useFetch";

const SearchPage = () => {
  const location = useLocation();

  const searchQuery = new URLSearchParams(location.search);

  let query = searchQuery.get("q");

  const {
    data: searchRecipes,
    isError,
    isLoading,
  } = useFetch(`/api/recipes/search?q=${query}`, [query]);

  // useEffect(() => {
  //   (async () => {
  //     const res = await axios.get(`/api/recipes/search?q=${query}`);
  //     setSearchRecipes(res?.data);
  //   })();
  // }, [query]);

  return (
    <LoadingComponent>
      <div className="grid grid-cols-3 gap-3">
        {searchRecipes?.length > 0 ? (
          searchRecipes?.map((recipe) => {
            return (
              <RecipesCardComponents
                key={recipe?._id}
                recipe={recipe}
                //deleteRecipesHandlerOnClient={deleteRecipesHandlerOnClient}
              />
            );
          })
        ) : (
          <div className="">
            <h1 className=" text-lg font-semibold">No Recipes</h1>
          </div>
        )}
      </div>
    </LoadingComponent>
  );
};

export default SearchPage;
