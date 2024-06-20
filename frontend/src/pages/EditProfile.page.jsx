import React, { useContext, useEffect, useState } from "react";
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
import { AuthContext } from "../contexts/AuthContext";

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
  const [file, setFile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  const { updateUser } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      const res = await axios.get("/api/users/me");
      setProfilePicture(
        import.meta.env.VITE_BACKEND_ASSET_URL + res.data.photo
      );
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

      let formData = new FormData();

      formData.set("photo", file);
      const updateUserDataFun = await axios.post(
        `/api/users/${id}/upload`,
        formData,
        {
          headers: {
            Accept: "multipart/form-data",
          },
        }
      );

      updateUser(updateUserDataFun?.data?.photo);
      setPassword(null);
    } catch (error) {
      setIsError(error);
      toast.error(error.response.data.msg);
      setPassword(null);
    }
    setEmailEdit(false);
    setNameEdit(false);
  };

  const uploadPicture = (e) => {
    let file = e.target.files[0];
    setFile(file);

    let fileReader = new FileReader();

    fileReader.onload = (e) => {
      setProfilePicture(e.target.result);
    };

    fileReader.readAsDataURL(file);
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
                {profilePicture && (
                  <img
                    className=" w-[100px] h-[100px] rounded-2xl border object-cover"
                    src={profilePicture}
                    alt=""
                  />
                )}
                <div className=" space-y-1">
                  <h1 className=" font-semibold text-lg">Your Photo</h1>
                  <p className=" text-sm text-slate-500">
                    This will be displayed on your profile
                  </p>
                </div>
                <div className=" space-x-3 flex items-center">
                  <div className="grid w-full max-w-sm items-center gap-1.5 rounded-xl">
                    <Input
                      onChange={uploadPicture}
                      id="picture"
                      type="file"
                      className=" rounded-xl"
                    />
                  </div>
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
