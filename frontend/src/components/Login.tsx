import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Controller, useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { useEffect } from "react";

const formSchema = z.object({
  email: z
    .string()
    .min(2, "Email must be at least 2 characters.")
    .max(100, "Email must be at most 100 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const Login = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  if (token) {
    return;
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth`,
        data
      );

      if (response && response.status === 200) {
        localStorage.setItem("accessToken", response.data?.accessToken);
        navigate("/");
      } else {
        toast.error("Error", {
          description: "Some error occured",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: `Some error occured: ${error}`,
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-6 md:px-0">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Sign In - HubCredo</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="sign-in-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      placeholder="farhan@email.com"
                      aria-invalid={fieldState.invalid}
                      type="email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      aria-invalid={fieldState.invalid}
                      type="password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button type="submit" form="sign-in-form">
              Sign In
            </Button>
          </Field>
        </CardFooter>
      </Card>
      <div className="flex text-xs">
        <div className="">Don't have account</div>
        <Link to={"/sign-up"} className="underline px-1">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
