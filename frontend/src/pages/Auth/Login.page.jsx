import { Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Button } from "../../components/ui/button";
import axios from "../../helpers/axois";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { CloudCog, Loader2 } from "lucide-react";
import FormComponent from "../../components/Form.component";
import { toast } from "sonner";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const LoginPage = () => {
  const nav = useNavigate();
  const [error, setIsError] = useState(null);
  const { dispatch } = useContext(AuthContext);
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
      const loginUser = await axios.post("/api/users/login", values, {
        withCredentials: true,
      });

      if (loginUser.status === 200) {
        dispatch({ type: "LOGIN", payload: loginUser.data.loginUser });
        nav("/");
        toast.success(`Login Successfully`);
      }
    } catch (e) {
      setIsError(e.response.data.error);
      if (error) {
        toast.success(`${error}`);
      }
    }
  };
  return (
    <div className=" md:space-x-10 md:h-screen mt-16 md:mt-0">
      <Card className="w-[400px] mx-auto">
        <CardHeader className=" flex flex-row items-center justify-between mb-3">
          <CardTitle>Login</CardTitle>
          <Link to={"/sign-up"}>
            <CardDescription className=" text-sky">
              Don't have an account
            </CardDescription>
          </Link>
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
                        lableName={"Password"}
                        placeholder={"Enter your password"}
                      />
                    </div>

                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      className=" bg-black hover:bg-slate-900 rounded w-full mt-3 text-white"
                    >
                      Login{" "}
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

export default LoginPage;
