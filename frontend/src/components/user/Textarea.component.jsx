import React from "react";
import { Textarea } from "../ui/textarea";

const TextareaComponent = ({ userInfo, changeHandler }) => {
  return (
    <div className="space-y-3">
      <h1 className=" text-md ">Bio</h1>
      <div className="w-[280px] space-y-6">
        <Textarea
          name="bio"
          id="bio"
          value={userInfo.bio}
          onChange={changeHandler}
          placeholder="Edit your bio here"
          className="resize-none border-slate-300 h-[120px] rounded-xl"
        />
      </div>
    </div>
  );
};

export default TextareaComponent;
