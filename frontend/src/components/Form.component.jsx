import { ErrorMessage } from "formik";
import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";


const FormComponent = ({
  lableName,
  placeholder,
  handleBlur,
  handleChange,
  values,
  id,
  type,
  name,
}) => {
  return (
    <div>
      <div className="flex flex-col space-y-1.5 ">
        <Label className=" text-xs md:text-sm" htmlFor={name}>
          {lableName}
        </Label>
        <Input
          className="text-xs md:text-sm rounded"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values}
          id={id}
          type={type}
          name={name}
          placeholder={placeholder}
        />
        <ErrorMessage
          className="  text-red-600 text-xs md:text-sm"
          component={"p"}
          name={name}
        />
      </div>
    </div>
  );
};

export default FormComponent;
