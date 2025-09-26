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

function Register() {
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
            <CardTitle>Register your account</CardTitle>
            <CardDescription>
              Enter your username below to register your account
            </CardDescription>
            <CardAction>
              <Button variant="link">
                <Link href="/login">Login</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input id="password" type="password" required />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default Register;
