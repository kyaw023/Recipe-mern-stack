import React, { useEffect, useState } from "react";
import {
  HeroComponent,
  LoadingComponent,
  PaginationComponent,
  RecipesCardComponents,
} from "../components";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../helpers/axois";
import useFetch from "../Hook/useFetch";

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [links, setLinks] = useState([]);

  const location = useLocation();

  const searchQuery = new URLSearchParams(location.search);

  let page = searchQuery.get("page");

  page = parseInt(page) ? parseInt(page) : 1;

  const nav = useNavigate();

  const { data, isError, isLoading } = useFetch(`/api/recipes?page=${page}`, [
    page,
  ]);

  useEffect(() => {
    setLinks(data?.links);
    setRecipes(data?.data);
  }, [data]);

  const deleteRecipesHandlerOnClient = (_id) => {
    if (recipes.length === 1 && page > 1) {
      nav("/?page=" + (page - 1));
    }
    setRecipes((prev) => prev?.filter((recipe) => recipe?._id !== _id));
  };

  return (
    <LoadingComponent isLoading={isLoading}>
      <div>
        <HeroComponent />
        <div className="grid grid-cols-3 gap-3">
          {recipes ? (
            recipes?.map((recipe) => {
              return (
                <RecipesCardComponents
                  key={recipe?._id}
                  recipe={recipe}
                  deleteRecipesHandlerOnClient={deleteRecipesHandlerOnClient}
                />
              );
            })
          ) : (
            <div className=" mt-20">
              <h1>No Recipes</h1>
            </div>
          )}
        </div>
        {/* pagination */}
        {!!recipes && <PaginationComponent links={links} page={page || 1} />}
      </div>
    </LoadingComponent>
  );
};

export default HomePage;
