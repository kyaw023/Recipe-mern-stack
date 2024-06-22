import { LockKeyholeOpen, LogOut, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";
import LoadingComponent from "../Loading/Loading.component";
import { Copy } from "lucide-react";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const ProfileComponent = ({ logoutHandler, id, isLoading, photo }) => {
  const [email, setEmail] = useState(null);

  const resetPasswordHandler = async () => {
    const res = await axios.post("/api/users/request-reset", {
      email,
    });

    if (res.status === 200) {
      toast.success(res.data.msg);
    }
  };
  return (
    <LoadingComponent isLoading={isLoading}>
      <Dialog>
        <DialogContent className="sm:max-w-md bg-slate-100 rounded">
          <DialogHeader>
            <DialogTitle className=" mb-3">Forget Password</DialogTitle>
            <DialogDescription className=" mb-3">
              Enter your email and we will sent you instructions to reset your
              password
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="email" className="sr-only">
                Enter your email
              </Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                className=" rounded border-green-500"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                onClick={resetPasswordHandler}
                type="button"
                className=" hover:bg-green-400 bg-green-500 rounded-xl w-full focus:border-green-500 text-slate-100"
              >
                Saved
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
        <DropdownMenu className="">
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage
                className=""
                src={import.meta.env.VITE_BACKEND_ASSET_URL + photo}
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white rounded-xl">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link to={`/editProfile/${id}`}>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span> Profile</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="mr-2 h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="white"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              <Link to={`${id}/favorite`}>Favorite recipes</Link>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logoutHandler}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <DialogTrigger className=" flex items-center space-x-1">
                <LockKeyholeOpen className="mr-2 h-4 w-4" />
                <span className=" text-red-500">Forget Password</span>
              </DialogTrigger>

              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Dialog>
    </LoadingComponent>
  );
};

export default ProfileComponent;
