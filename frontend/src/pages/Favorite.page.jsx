import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import useFetch from "../Hook/useFetch";
import { LoadingComponent } from "../components";

const FavoritePage = () => {
  const [favoriteRecipe, setFavoriteRecipe] = useState([]);
  const { id } = useParams();

  const { data, isError, isLoading } = useFetch(`/api/users/${id}/favorites`, [
    id,
  ]);

  useEffect(() => {
    setFavoriteRecipe(data);
  }, [data]);

  const removeFavorite = async (recipeId) => {
    const res = await axios.delete(`/api/users/${id}/favorites/${recipeId}`);
    setFavoriteRecipe((prev) => prev.filter((fav) => fav._id !== recipeId));
    if (res.status === 200) {
      toast.success("Recipe removed from favorites");
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <LoadingComponent isLoading={isLoading}>
      <div>
        <h1 className=" text-lg font-semibold mb-4">Favorite Recipe</h1>
        <div className=" grid grid-cols-3 gap-3">
          {favoriteRecipe?.map((fav) => {
            return (
              <div className=" border rounded-2xl shadow  flex gap-4 ">
                <img
                  className=" w-32 h-32 object-cover rounded-tl-2xl rounded-bl-2xl"
                  src={import.meta.env.VITE_BACKEND_ASSET_URL + fav.photo}
                  alt=""
                />
                <div className=" py-2 flex flex-col space-y-3">
                  <div>
                    <Link to={`/recipes/detail/${fav?._id}`}>
                      <h1 className=" text-lg font-semibold">{fav.title}</h1>
                    </Link>
                    <h1 className=" text-sm text-slate-500">
                      {fav.description}
                    </h1>
                  </div>
                  <div className="">
                    <Button
                      onClick={() => removeFavorite(fav?._id)}
                      size="sm"
                      className=" active:scale-110 transition duration-200 bg-red-500 hover:bg-red-400 text-white rounded-xl "
                    >
                      Remove from favorite
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </LoadingComponent>
  );
};

export default FavoritePage;
