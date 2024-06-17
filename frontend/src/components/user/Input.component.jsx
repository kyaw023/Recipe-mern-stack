import React, { useRef } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { BsPencilSquare } from "react-icons/bs";

const InputComponent = ({
  labelName,
  id,
  name,
  changeHandler,
  nameEdit,
  setNameEdit,
  userInfo,
}) => {
  const inputRef = useRef(null);

  const handleBtn = () => {
    setNameEdit(true);
    inputRef.current.focus();
  };

  return (
    <div className=" space-y-1.5">
      <Label htmlFor={name}>{labelName}</Label>
      <div className=" flex space-x-1">
        <Input
          ref={inputRef}
          id={id}
          name={name}
          onChange={changeHandler}
          readOnly={!nameEdit}
          defaultValue={name === "email" ? userInfo.email : userInfo.name}
          value={name === "email" ? userInfo.email : userInfo.name}
          className=" rounded bg-slate-100 focus:border-none"
        />
        <Button
          type="button"
          onClick={handleBtn}
          className="border bg-black text-white rounded hover:bg-slate-800 active:scale-110"
        >
          <BsPencilSquare />
        </Button>
      </div>
    </div>
  );
};

export default InputComponent;
