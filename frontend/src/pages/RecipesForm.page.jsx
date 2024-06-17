import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { IngredientsFormComponents, LoadingComponent } from "../components";
import axios from "../helpers/axois";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import useFetch from "../Hook/useFetch";

const RecipesFormPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstrucions] = useState([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [newInstruction, setNewInstruction] = useState("");
  const [previewImg, setPreviewImg] = useState("");
  const [file, setFile] = useState(null);
  const [recipeInfo, setRecipeInfo] = useState({
    title: "",
    cookingTime: "",
    serving: "",
    preTime: "",
    description: "",
  });

  const { id } = useParams();

  const nav = useNavigate();

  const { data, isError, isLoading } = useFetch(`/api/recipes/${id}`, [id]);

  useEffect(() => {
    if (id) {
      setRecipeInfo({
        title: data?.title,
        description: data?.description,
        cookingTime: data?.cook_time,
        serving: data?.servings,
        preTime: data?.prep_time,
      });

      setIngredients(data?.ingredients);
      setInstrucions(data?.instructions);

      setPreviewImg(import.meta.env.VITE_BACKEND_URL + data?.photo);
    }
  }, [data]);

  // add recipeinfo
  const changeHandler = (e) => {
    setRecipeInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // add ingredient function
  const addIngredientHandler = () => {
    if (newIngredient) {
      const ingredientLists = {
        id: Date.now(),
        title: newIngredient,
      };
      setIngredients((prev) => [ingredientLists, ...prev]);
      setNewIngredient("");
    }
  };

  // add instrucion function
  const addInstructionHandler = () => {
    if (newInstruction) {
      const instructionLists = {
        id: Date.now(),
        title: newInstruction,
      };
      setInstrucions((prev) => [instructionLists, ...prev]);
      setNewInstruction("");
    }
  };

  // add recipe function
  const submitRecipeHandler = async (e) => {
    e.preventDefault();
    try {
      const recipe = {
        title: recipeInfo.title,
        description: recipeInfo.description,
        ingredients,
        instructions,
        cook_time: recipeInfo.cookingTime,
        prep_time: recipeInfo.preTime,
        servings: recipeInfo.serving,
      };

      let res;
      if (id) {
        res = await axios.patch(`/api/recipes/${id}`, recipe);
      } else {
        res = await axios.post("/api/recipes", recipe);
      }

      const formData = new FormData();
      formData.set("photo", file);

      await axios.post(`/api/recipes/${res?.data?._id}/upload`, formData, {
        headers: {
          Accept: "multipart/form-data",
        },
      });

      if (res.status === 200) {
        nav("/");
        toast.success(
          `Recipe have been ${id ? "edit" : "create"} successfully`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // file upload function
  const uploadHanlder = (e) => {
    let file = e.target.files[0];
    setFile(file);

    let fileReader = new FileReader();

    fileReader.onload = (e) => {
      setPreviewImg(e.target.result);
    };

    fileReader.readAsDataURL(file);
  };

  return (
    <LoadingComponent isLoading={isLoading}>
      <div className=" max-w-[600px] mx-auto ">
        <Card className=" bg-white py-4 rounded-xl">
          <CardTitle className=" mb-5 text-center">
            Recipes {`${id ? "Edit" : "Create"}`} Form
          </CardTitle>
          {/* <div className="px-6 py-3 space-y-3">
            {!!isError &&
              (Object.keys(isError?.response.data.errors)).map((er, index) => {
                return (
                  <li
                    key={index}
                    className=" text-red-500 border px-3 py-1.5 text-sm "
                  >
                    {er} is required
                  </li>
                );
              })}
          </div> */}
          <form onSubmit={submitRecipeHandler}>
            <CardContent className="space-y-4">
              <div className=" space-y-3">
                <Input
                  className=" rounded"
                  type="file"
                  onChange={uploadHanlder}
                />

                {!!previewImg && (
                  <img
                    width={200}
                    height={200}
                    className=" rounded"
                    src={previewImg}
                  />
                )}
              </div>
              <Input
                value={recipeInfo.title}
                onChange={changeHandler}
                name="title"
                className=" border-slate-400 rounded"
                placeholder="Recipe Title"
              />
              <Input
                value={recipeInfo.cookingTime}
                onChange={changeHandler}
                name="cookingTime"
                className=" border-slate-400 rounded"
                placeholder="Cooking Time"
              />
              <Input
                value={recipeInfo.serving}
                onChange={changeHandler}
                name="serving"
                className=" border-slate-400 rounded"
                placeholder="serving"
              />
              <Input
                value={recipeInfo?.preTime}
                onChange={changeHandler}
                name="preTime"
                className=" border-slate-400 rounded"
                placeholder="preparation time"
              />
              <Textarea
                value={recipeInfo?.description}
                onChange={changeHandler}
                name="description"
                className=" rounded"
                placeholder="Type your message here."
              />

              {/* ingredient input form */}
              <div>
                <div className=" flex items-center space-x-2">
                  <Input
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e?.target?.value)}
                    name="title"
                    className=" border-slate-400 rounded"
                    placeholder="Recipe Ingredients at least 5"
                  />
                  <Button
                    onClick={addIngredientHandler}
                    type="button"
                    className=" rounded active:scale-110 duration-200 cursor-pointer bg-green-400 hover:bg-green-500 text-white"
                  >
                    Add
                  </Button>
                </div>
                <IngredientsFormComponents
                  ingredients={ingredients}
                  setIngredients={setIngredients}
                />
              </div>

              {/* instructions input form */}
              <div>
                <div className=" flex items-center space-x-2">
                  <Input
                    value={newInstruction}
                    onChange={(e) => setNewInstruction(e.target.value)}
                    name="instruction"
                    className=" border-slate-400 rounded"
                    placeholder="Recipe Instructions at least 5"
                  />
                  <Button
                    onClick={addInstructionHandler}
                    type="button"
                    className=" rounded active:scale-110 duration-200 cursor-pointer bg-green-400 hover:bg-green-500 text-white"
                  >
                    Add
                  </Button>
                </div>
                <IngredientsFormComponents
                  ingredients={instructions}
                  setIngredients={setInstrucions}
                />
              </div>
            </CardContent>
            <CardFooter className=" space-x-3">
              <Button className=" w-full rounded mt-4 border">
                <Link to={"/"}>Cancel</Link>
              </Button>
              <Button className=" w-full rounded mt-4 bg-green-400 text-white hover:bg-green-500">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {`${id ? "Update" : "Add"}`}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </LoadingComponent>
  );
};

export default RecipesFormPage;
