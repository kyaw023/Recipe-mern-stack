import { Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Loader2 } from "lucide-react";
import FormComponent from "../components/Form.component";
import axios from "../helpers/axois";
import { toast } from "sonner";

const ResetPasswordPage = () => {
  const nav = useNavigate();
  const initialValue = {
    email: "",
    password: "",
  };
  const validationSchema = yup.object({
    email: yup
      .string()
      .required("Email is required!")
      .email("Invalid email format!"),

    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be 8 letters"),
  });

  const handleSubmit = async (values) => {
    try {
      if (values) {
        const user = await axios.post("/api/users/reset-password", values);
        if (user.status === 200) {
          nav("/");
          toast.success(`your `);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" md:space-x-10 md:h-screen mt-16 md:mt-0">
      <Card className="w-[400px] mx-auto">
        <CardHeader className="">
          <CardTitle>Forget Password</CardTitle>
          <CardDescription className=" text-xs text-slate-400">
            Your new password must be different from previous used passwords
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            initialValues={initialValue}
          >
            {({ handleBlur, handleChange, values, isSubmitting }) => (
              <>
                {
                  <Form className=" flex flex-col gap-4">
                    <div className="grid w-full items-center gap-4">
                      <FormComponent
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        values={values.email}
                        name={"email"}
                        type={"email"}
                        id={"email"}
                        lableName={"Email Address"}
                        placeholder={"Enter your email address"}
                      />

                      <FormComponent
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        values={values.password}
                        id={"password"}
                        type={"password"}
                        name={"password"}
                        lableName={"New Password"}
                        placeholder={"Enter your password"}
                      />
                    </div>

                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      className=" bg-black hover:bg-slate-900 rounded w-full mt-3 text-white"
                    >
                      Reset Password{" "}
                      {isSubmitting && (
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      )}
                    </Button>
                  </Form>
                }
              </>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
