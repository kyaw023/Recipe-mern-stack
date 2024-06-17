import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import axios from "../../helpers/axois";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "sonner";
import {  formatDistanceToNow, } from "date-fns";

const RecipesCardComponent = ({ recipe, deleteRecipesHandlerOnClient }) => {
  const [addFav, setAddFav] = useState(false);
  const { state } = useContext(AuthContext);
  const date = new Date(recipe.createdAt);
  const [favLists, setFavLists] = useState([]);
  const [loading, setLoading] = useState(false);

  const deleteRecipesHandler = async () => {
    const deletedRecipe = await axios.delete("/api/recipes/" + recipe?._id);
    if (deletedRecipe.status === 200) {
      deleteRecipesHandlerOnClient(recipe?._id);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await axios.get(`/api/users/${state.user._id}/favorites`);
      setFavLists(res.data);
      setLoading(false);
    })();
  }, [state.user._id]);

  useEffect(() => {
    setAddFav(
      favLists.some((fav) => {
        return fav?._id === recipe?._id;
      })
    );
  }, [favLists, recipe?._id]);

  const addToFavorite = async () => {
    try {
      const res = await axios.post(`/api/users/${state.user._id}/favorites`, {
        recipeId: recipe?._id,
      });

      if (res.status === 200) {
        console.log(res.data);
        toast.success(`Recipe is successfully added to favorite list`);
        setAddFav(true);
      }
    } catch (error) {
      setAddFav(true);
      toast.error(`${error.response.data?.msg} `);
    }
  };

  return (
    <div>
      {!loading && (
        <Card className=" bg-[#f8f6f6] rounded-xl relative h-[200px]">
          <CardHeader>
            <CardTitle className=" text-xl">
              <Link to={`/recipes/detail/${recipe?._id}`}>{recipe?.title}</Link>
            </CardTitle>
            <div className=" absolute -top-3 right-2">
              <img
                className=" animate-spin w-[100px] h-[100px] rounded-[50%] shadow-2xl  border-2 border-white"
                src={import.meta.env.VITE_BACKEND_ASSET_URL + recipe?.photo}
                alt=""
              />
            </div>
            <CardDescription className=" text-slate-600">
              {recipe?.description}
            </CardDescription>
          </CardHeader>
          <CardFooter className=" flex flex-col space-y-5 items-start">
            <div className=" flex items-center gap-10">
              <p className=" text-slate-600 text-xs">
                CookingTime : {recipe?.cook_time}
              </p>
              <span className=" text-xs text-slate-500">
                Created At:{" "}
                {formatDistanceToNow(new Date(date), {
                  addSuffix: true,
                })}
                
              </span>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className=" space-x-3">
                <Link to={`/recipes/edit/${recipe?._id}`}>
                  <Button
                    size={"sm"}
                    className=" bg-green-500 text-xs rounded-xl hover:bg-green-300 text-slate-100"
                  >
                    Edit
                  </Button>
                </Link>
                <Button
                  onClick={deleteRecipesHandler}
                  size={"sm"}
                  className=" bg-red-500 rounded-xl text-xs hover:bg-red-300 text-slate-100"
                >
                  Deleted
                </Button>
              </div>
              <div className=" absolute bottom-0 right-0">
                <Button
                  onClick={addToFavorite}
                  size={"sm"}
                  className=" border border-slate-300 rounded-tr-3xl rounded-bl-3xl  text-xs bg-green-400  hover:bg-green-300 text-slate-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill={addFav ? "red" : "white"}
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default RecipesCardComponent;
