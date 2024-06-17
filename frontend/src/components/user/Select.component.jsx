import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

const SelectComponent = ({ selectHandler, changeHandler, userInfo }) => {
  return (
    <div className="flex flex-col w-[200px] space-y-6 ">
      <Label htmlFor="role">Role</Label>
      <Select
        onValueChange={selectHandler}
        onChange={changeHandler}
        value={userInfo.role}
        name="role"
      >
        <SelectTrigger
          id="role"
          name="role"
          className="rounded border-slate-200"
        >
          <SelectValue placeholder="select your role" />
        </SelectTrigger>
        <SelectContent position="popper" className=" bg-white ">
          <SelectItem value="user" name="user" className=" border">
            User
          </SelectItem>
          <SelectItem value="chef" name="chef" className=" border">
            Chef
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectComponent;
