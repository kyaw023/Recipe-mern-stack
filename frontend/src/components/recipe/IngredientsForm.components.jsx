import { Button } from "../ui/button";

const IngredientsFormComponents = ({ ingredients, setIngredients }) => {
  const deleteHandler = (id) => {
    setIngredients(ingredients.filter((ingredient) => ingredient?.id !== id));
  };
  return (
    <div className=" mt-3">
      <ul className=" space-y-3">
        {ingredients?.map((ingredient, index) => {
          return (
            <div className=" flex items-center gap-3">
              <li
                key={ingredient?.id ? ingredient?.id : index}
                className="w-full border px-3 py-1.5 text-sm text-slate-600"
              >
                {ingredient?.title ? ingredient?.title : ingredient}
              </li>
              <Button
                onClick={() => deleteHandler(ingredient?.id)}
                type="button"
                size="sm"
                className=" bg-red-500  text-white rounded text-sm hover:bg-red-400"
              >
                Delete
              </Button>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default IngredientsFormComponents;
