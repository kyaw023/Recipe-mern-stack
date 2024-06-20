import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "..//ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const CommentComponent = ({ comments, state, recipe, setComments }) => {
  const [editComment, setEditComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const clickHandler = async (id) => {
    await axios.delete(
      `/api/comments/${state?.user?._id}/${recipe?._id}/${id}`
    );

    setComments((prev) =>
      prev.filter((cmt) => {
        return cmt?._id !== id;
      })
    );
  };

  const submitHandler = async (e, id) => {
    e.preventDefault();

    if (editComment) {
      const res = await axios.patch(
        `/api/comments/${state?.user?._id}/${recipe?._id}/${id}`,

        {
          newComment: editComment,
        }
      );

      setComments((prev) =>
        prev.map((prevCom) => {
          if (prevCom?._id === id) {
            return { ...prevCom, comment: editComment };
          } else {
            return prevCom;
          }
        })
      );

      if (res.status === 200) {
        setIsOpen(false);
        toast.success("your comment update successfully");
      } else {
        setIsOpen(true);
        toast.error(`${res.response.data.msg}`);
      }
    }
    setEditComment("");
  };

  return (
    <div className=" w-full">
      <ul className=" h-[400px]">
        {comments.length === 0 ? (
          <p className=" text-slate-600">No comments yet...</p>
        ) : (
          <ScrollArea className="h-96 w-[600px]  border rounded-xl">
            <div className=" space-y-3">
              {comments?.map((comment, index) => {
                return (
                  <div>
                    <li
                      className=" flex items-center justify-between px-3"
                      key={comment?.id ? comment?.id : index}
                    >
                      <div className="flex items-center space-x-6 p-4">
                        <Avatar>
                          <AvatarImage
                            src={
                              import.meta.env.VITE_BACKEND_ASSET_URL +
                              state?.user.photo
                            }
                            alt="@shadcn"
                          />
                          <AvatarFallback>{state?.user?.name}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h1 className=" text-lg font-semibold capitalize">
                            {comment?.user?._id === state?.user?._id
                              ? "You"
                              : comment?.user?.name}{" "}
                            <span className=" text-xs text-slate-600">
                              {/* {formatDistanceToNow(
                                new Date(comment?.createdAt),
                                {
                                  addSuffix: true,
                                }
                              )} */}
                            </span>
                          </h1>
                          <input
                            readOnly
                            value={comment?.comment}
                            className=" text-slate-600 border-none outline-none"
                          />
                        </div>
                      </div>

                      {/*  */}
                      <div className=" space-x-2">
                        {comment?.user?._id === state?.user?._id && (
                          <div className=" space-x-2">
                            <Dialog
                              open={isOpen}
                              onOpenChange={setIsOpen}
                              className=" "
                            >
                              <DialogTrigger asChild>
                                <Button
                                  className=" rounded-xl"
                                  variant="outline"
                                >
                                  Edit Comment
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px] bg-white rounded-xl">
                                <DialogHeader>
                                  <DialogTitle>Edit your comments</DialogTitle>
                                  <DialogDescription>
                                    Make changes to your comment here. Click
                                    save when you're done.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <form
                                    onSubmit={(e) =>
                                      submitHandler(e, comment?._id)
                                    }
                                    className=""
                                  >
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label
                                        htmlFor="name"
                                        className="text-right"
                                      >
                                        Comment
                                      </Label>
                                      <Input
                                        id="comment"
                                        value={editComment}
                                        onChange={(e) =>
                                          setEditComment(e.target.value)
                                        }
                                        className="col-span-3 rounded"
                                      />
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        className=" bg-green-400 rounded-xl text-white mt-3 hover:bg-green-500"
                                        type="submit"
                                      >
                                        Save changes
                                      </Button>
                                    </DialogFooter>
                                  </form>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              onClick={() => clickHandler(comment?._id)}
                              className=" bg-red-400 hover:bg-red-500 rounded-xl text-white"
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    </li>
                    <Separator className=" border" />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </ul>
    </div>
  );
};

export default CommentComponent;
