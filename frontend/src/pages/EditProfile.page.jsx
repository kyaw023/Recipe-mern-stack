import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

import { Textarea } from "../components/ui/textarea";
import axios from "axios";
import { BsPencilSquare } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";

import { Dialog } from "../components/ui/dialog";
import { toast } from "sonner";
import {
  AlertComponent,
  InputComponent,
  SelectComponent,
  TextareaComponent,
} from "../components";

const EditProfilePage = () => {
  const { id } = useParams();

  const nav = useNavigate();

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    bio: "",
    role: null,
  });

  const [nameEdit, setNameEdit] = useState(false);
  const [emailEdit, setEmailEdit] = useState(false);
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await axios.get("/api/users/me");
      setUserInfo({
        name: res.data.name,
        email: res.data.email,
        bio: res.data.bio,
        role: res.data.role,
      });
    })();
  }, []);

  const changeHandler = (e) => {
    setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const selectHandler = (value) => {
    setUserInfo((prev) => ({ ...prev, role: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const newProfile = {
      id,
      name: userInfo?.name,
      email: userInfo?.email,
      bio: userInfo?.bio,
      role: userInfo?.role,
      password,
    };
    try {
      const res = await axios.patch(`/api/users/edit/${id}`, newProfile);
      if (res.status === 200) {
        nav("/");
        toast.success(`Your profile have been updated successfully`);
      }
      setPassword(null);
    } catch (error) {
      setIsError(error);
      toast.error(error.response.data.msg);
      setPassword(null);
    }
  };
  return (
    <div>
      <div>
        <h1 className=" text-lg font-semibold mb-3">Edit User Profile</h1>
      </div>
      <div className=" flex gap-5">
        <Dialog>
          <Card className="w-[350px] h-[250px] rounded-xl py-2">
            <CardContent className=" px-8 py-2">
              <div className=" mb-2 space-y-3">
                <img
                  className=" w-[100px] h-[100px] rounded-2xl border "
                  src={
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvvTNp33bnN4rL1z48GRpWNgAL22_6VY2Iqw&s"
                  }
                  alt=""
                />
                <div className=" space-y-1">
                  <h1 className=" font-semibold text-lg">Your Photo</h1>
                  <p className=" text-sm text-slate-500">
                    This will be displayed on your profile
                  </p>
                </div>
                <div className=" space-x-3">
                  <Button size="sm" className=" border rounded-xl">
                    Upload New
                  </Button>
                  <Button
                    size="sm"
                    className=" border rounded-xl bg-blue-500 text-white"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className=" rounded-xl py-2">
            <CardHeader>
              <CardTitle className=" text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className=" px-8 py-2">
              <form
                onSubmit={submitHandler}
                className="grid w-full items-center gap-4"
              >
                <div className=" space-y-3">
                  <InputComponent
                    labelName={"Name"}
                    id={"name"}
                    name={"name"}
                    changeHandler={changeHandler}
                    nameEdit={nameEdit}
                    userInfo={userInfo}
                    setNameEdit={setNameEdit}
                  />

                  <InputComponent
                    labelName={"Email"}
                    id={"email"}
                    name={"email"}
                    changeHandler={changeHandler}
                    nameEdit={emailEdit}
                    userInfo={userInfo}
                    setNameEdit={setEmailEdit}
                  />
                </div>

                <div className=" mb-2 flex items-start gap-4 w-full">
                  <TextareaComponent
                    userInfo={userInfo}
                    changeHandler={changeHandler}
                  />
                  <SelectComponent
                    selectHandler={selectHandler}
                    changeHandler={changeHandler}
                    userInfo={userInfo}
                  />
                </div>

                <AlertComponent password={password} setPassword={setPassword} />
              </form>
            </CardContent>
          </Card>
        </Dialog>
      </div>

      <div className=" mt-3"></div>
    </div>
  );
};

export default EditProfilePage;
