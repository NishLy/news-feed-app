import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { mutateFollow } from "../services/follow-api";
import { toast } from "sonner";
import { GenericResponse, GenericSuccessResponse } from "@/types/api";
import { AxiosError } from "axios";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // use shadcn/ui tabs
import { IFollowCreate } from "../types/follow";

const validationSchema = Yup.object<IFollowCreate>({
  followeeId: Yup.number()
    .typeError("User ID must be a number")
    .required("User ID is required"),
});

interface Props {
  onSuccessPost?: () => void;
}

const FollowCreate = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [isFollow, setIsFollow] = useState(true);

  const mutateFollowUser = useMutation<
    GenericSuccessResponse,
    AxiosError<GenericResponse>,
    IFollowCreate
  >({
    mutationFn: mutateFollow,
    onSuccess: () => {
      toast.success(isFollow ? "Follow created" : "Unfollow success");
      setOpen(false);
      props.onSuccessPost?.();
    },
    onError: (data) => {
      toast.error(data.response?.data.message || "Something went wrong");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Follow</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Formik
          initialValues={{ followeeId: null }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            mutateFollowUser.mutate(
              { followeId: values.followeeId!, isFollow },
              {
                onSuccess: () => {
                  resetForm();
                },
              }
            );
          }}
        >
          {({}) => (
            <Form className="space-y-6 py-6">
              <Tabs
                defaultValue={isFollow ? "follow" : "unfollow"}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="follow" onClick={() => setIsFollow(true)}>
                    Follow
                  </TabsTrigger>
                  <TabsTrigger
                    value="unfollow"
                    onClick={() => setIsFollow(false)}
                  >
                    Unfollow
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="follow">
                  <DialogHeader>
                    <DialogTitle>Follow User</DialogTitle>
                    <DialogDescription>
                      Enter the user ID to follow.
                    </DialogDescription>
                  </DialogHeader>
                </TabsContent>

                <TabsContent value="unfollow">
                  <DialogHeader>
                    <DialogTitle>Unfollow User</DialogTitle>
                    <DialogDescription>
                      Enter the user ID to unfollow.
                    </DialogDescription>
                  </DialogHeader>
                </TabsContent>
              </Tabs>

              <div className="grid gap-2">
                <Label htmlFor="followeeId">User ID</Label>
                <Input
                  id="followeeId"
                  name="followeeId"
                  type="number"
                  placeholder="Enter user ID"
                />
              </div>

              <DialogFooter className="flex gap-2">
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={mutateFollowUser.isPending}>
                  {mutateFollowUser.isPending ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default FollowCreate;
