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
const AlertComponent = ({ password, setPassword }) => {
  return (
    <div className=" space-x-2.5">
      <DialogContent className="sm:max-w-[425px] bg-white rounded-xl">
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
            <DialogClose>
              <Button className=" bg-black text-white rounded-xl hover:bg-slate-700 active:scale-105">
                Done
              </Button>
            </DialogClose>
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

      <Button className=" border rounded-xl">Cancel</Button>
    </div>
  );
};

export default AlertComponent;
