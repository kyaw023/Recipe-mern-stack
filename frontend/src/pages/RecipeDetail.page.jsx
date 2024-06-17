import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoTimeOutline } from "react-icons/io5";
import { SiCodechef } from "react-icons/si";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { AuthContext } from "../contexts/AuthContext";
import { CommentComponent, LoadingComponent } from "../components";
import useFetch from "../Hook/useFetch";

const RecipeDetailPage = () => {
  const [comments, setComments] = useState([]);
  const { id } = useParams();
  const [commentsText, setCommentsText] = useState("");

  const { state } = useContext(AuthContext);

  console.log(comments);

  const {
    data: recipeDetail,
    isError,
    isLoading,
  } = useFetch(`/api/recipes/${id}`, [id]);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`/api/comments/${id}`);
      setComments(res.data);
    })();
  }, [id, commentsText]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (commentsText) {
      const res = await axios.post(`/api/comments/${state?.user?._id}/${id}`, {
        comment: commentsText,
      });

      console.log(res);

      if (res.status === 200) {
        setComments([...comments, res.data]);
      }
    }

    setCommentsText("");
  };

  return (
    <LoadingComponent isLoading={isLoading}>
      <div>
        <div className=" grid grid-cols-3 gap-3  shadow border rounded-2xl p-4">
          <div className=" space-y-5">
            <img
              className=" w-[300px] h-[400px] object-cover rounded shadow "
              src={import.meta.env.VITE_BACKEND_ASSET_URL + recipeDetail?.photo}
              alt=""
            />
            {/* cooking time */}
            <div className=" flex items-center gap-10">
              <div className=" flex flex-col space-y-1">
                <IoTimeOutline size={30} />
                <span className=" text-sm">{recipeDetail?.cook_time}</span>
              </div>
              <div className=" flex flex-col space-y-1">
                <SiCodechef size={30} />
                <span className=" text-sm">{recipeDetail?.servings}</span>
              </div>
              <div className=" flex flex-col space-y-1">
                <IoTimeOutline size={30} />
                <span className=" text-sm">{recipeDetail?.prep_time}</span>
              </div>
            </div>
          </div>

          <div className=" col-span-2 py-5 space-y-5">
            <div className="">
              <h1 className=" text-xl font-semibold ">{recipeDetail?.title}</h1>
            </div>

            {/* description */}
            <div>
              <span className=" font-semibold">Descirption</span>
              <p className=" text-sm text-slate-600">
                {recipeDetail?.description}
              </p>
            </div>

            <div className=" grid grid-cols-2 gap-5">
              {/* ingredients */}
              <div>
                <span className=" font-semibold mb-2">Ingredients</span>
                <div className=" space-y-2">
                  {recipeDetail?.ingredients?.map((ingredient, index) => {
                    return (
                      <ul>
                        <li
                          className="text-sm text-slate-600"
                          key={ingredient?.id ? ingredient?.id : index}
                        >
                          {ingredient?.title ? ingredient?.title : ingredient}
                        </li>
                      </ul>
                    );
                  })}
                </div>
              </div>

              {/*instructions  */}
              <div>
                <span className=" font-semibold mb-2">Instructions</span>
                <div className=" space-y-2">
                  {recipeDetail?.instructions?.map((instruction, index) => {
                    return (
                      <ul>
                        <li
                          className="text-sm text-slate-600"
                          key={instruction?.id ? instruction?.id : index}
                        >
                          {instruction?.title
                            ? instruction?.title
                            : instruction}
                        </li>
                      </ul>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* comments */}
        <div className=" mt-6 flex  gap-6">
          {/* commment form */}
          <form
            onSubmit={submitHandler}
            className="grid w-[800px] h-[200px]  gap-2"
          >
            <Textarea
              name="comment"
              id="comment"
              value={commentsText}
              onChange={(e) => {
                setCommentsText(e.target.value);
              }}
              className="resize-none  border-slate-300  rounded-xl text-slate-600"
              placeholder="Write a comment here"
            />
            <Button
              type="submit"
              className=" bg-green-500 w-60 rounded-xl text-slate-100 hover:bg-green-400"
            >
              Send message
            </Button>
          </form>
          {/* comments lists */}

          <CommentComponent
            comments={comments}
            state={state}
            recipe={recipeDetail}
            setComments={setComments}
          />
        </div>
      </div>
    </LoadingComponent>
  );
};

export default RecipeDetailPage;
