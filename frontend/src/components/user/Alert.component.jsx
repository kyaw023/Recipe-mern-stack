import React from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";
const AlertComponent = ({ password, setPassword }) => {
  return (
    <div className=" space-x-2.5">
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl">
        <DialogHeader>
          <DialogDescription>
            <div className=" space-y-3 mb-3">
              <Label htmlFor="confirm-password" className="text-right">
                confirm-password
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="confirm-password"
                className="text-xs md:text-sm rounded"
              />
            </div>
            <div>
              <DialogClose>
                <Button
                  size={"lg"}
                  className=" bg-black text-white rounded-xl hover:bg-slate-700 active:scale-105"
                >
                  Done
                </Button>
              </DialogClose>
              <p className=" text-xs  text-red-400 mt-3">
                If you saved password, click again save button
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
      {!!password ? (
        <Button
          type="submit"
          className=" cursor-pointer active:scale-105 duration-100 border rounded-xl hover:bg-blue-400 bg-blue-600 text-white"
        >
          Save
        </Button>
      ) : (
        <DialogTrigger asChild>
          <Button
            type="button"
            className=" cursor-pointer active:scale-105 duration-100 border rounded-xl hover:bg-blue-400 bg-blue-600 text-white"
          >
            Save
          </Button>
        </DialogTrigger>
      )}

      <Link to={"/"}>
        <Button className=" border rounded-xl">Cancel</Button>
      </Link>
    </div>
  );
};

export default AlertComponent;
