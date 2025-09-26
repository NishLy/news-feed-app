"use client";

import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoginRequest } from "./types/login";
import { LoginResponse, mutateLogin } from "./services/api";
import { authStore } from "@/store/auth";
import { AxiosError } from "axios";
import { GenericResponse } from "@/types/api";

const intialValue: LoginRequest = {
  username: "",
  password: "",
};

const validationSchema = Yup.object<LoginRequest>({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

function Register() {
  const router = useRouter();
  const { setAuth } = authStore();
  const mutate = useMutation<
    LoginResponse,
    AxiosError<GenericResponse>,
    LoginRequest
  >({
    mutationFn: mutateLogin,
    onSuccess(data) {
      toast.success("User logged in successfully");
      setAuth(data.accessToken);
      router.push("/feed");
    },
    onError(data) {
      toast.error(data.response?.data.message || "Something went wrong");
    },
  });

  return (
    <>
      <Navbar>
        {" "}
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          Ganapatih Feed
        </h1>
      </Navbar>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          {" "}
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your username below to Login to your account
            </CardDescription>
            <CardAction>
              <Button variant="link">
                <Link href="/register">Sign Up</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <Formik
            initialValues={intialValue}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              mutate.mutateAsync(values);
            }}
          >
            <Form>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input name="password" type="password" required />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2 mt-6">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={mutate.isPending}
                >
                  Sign Up
                </Button>
              </CardFooter>
            </Form>
          </Formik>
        </Card>
      </div>
    </>
  );
}

export default Register;
