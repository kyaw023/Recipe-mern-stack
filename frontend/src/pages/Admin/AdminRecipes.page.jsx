import useFetch from "../../Hook/useFetch";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { LoadingComponent, PaginationComponent } from "../../components";
import { formatDistanceToNow } from "date-fns";

const AdminRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [links, setLinks] = useState([]);

  const location = useLocation();

  const searchQuery = new URLSearchParams(location.search);

  let page = searchQuery.get("page");

  page = parseInt(page) ? parseInt(page) : 1;

  const nav = useNavigate();

  const { data, isError, isLoading } = useFetch("/api/admin/recipes", [page]);

  useEffect(() => {
    setLinks(data?.links);
    setRecipes(data?.data);
  }, [data]);
  return (
    <LoadingComponent>
      <div>
        <div className=" flex items-center justify-between mb-3">
          <h1 className=" text-lg font-semibold">Recipes Lists</h1>

          <Button className=" bg-black text-white rounded-xl">
            {" "}
            + New Customers
          </Button>
        </div>

        <div>
          <Table>
            <TableCaption>All Recipes</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">
                  <h1 className=" text-md font-semibold">Recipe Name</h1>
                </TableHead>
                <TableHead>
                  <h1 className=" text-md font-semibold">Create User</h1>
                </TableHead>
                <TableHead>CreatedAt</TableHead>
                <TableHead>Recipe Detail</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipes?.map((recipe) => (
                <TableRow key={recipe?._id}>
                  <TableCell>{recipe?.title}</TableCell>
                  <TableCell>
                    {recipe?.createdBy[0]?.name || "unknown"}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(recipe?.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <Link
                      className=" hover:border-b-2 hover:border-green-400 hover:py-1 transition duration-300"
                      to={"/"}
                    >
                      Detail
                    </Link>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button className=" border border-slate-700 rounded-xl">
                      Edit
                    </Button>
                    <Button className=" bg-red-500 text-white rounded-xl">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="">
              <div className="py-2">
                {!!recipes && (
                  <PaginationComponent
                    links={links}
                    page={page || 1}
                    pageName={"admin"}
                  />
                )}
              </div>
            </TableFooter>
          </Table>
          {/* pagination */}
        </div>
      </div>
    </LoadingComponent>
  );
};

export default AdminRecipesPage;
