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
import { Label } from "@radix-ui/react-label";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { IFeedCreate } from "../types/feed";
import { useMutation } from "@tanstack/react-query";
import { mutateFeed } from "../services/api";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { GenericResponse, GenericSuccessResponse } from "@/types/api";
import { AxiosError } from "axios";
import { IoIosAdd } from "react-icons/io";
import { cn } from "@/lib/utils";
import { useState } from "react";

const validationSchema = Yup.object<IFeedCreate>({
  content: Yup.string()
    .required("Content is required")
    .max(200, "Max 200 characters"),
});

interface Props {
  onSuccessPost?: () => void;
}

const FeedCreate = (props: Props) => {
  const [open, setOpen] = useState(false);
  const mutate = useMutation<
    GenericSuccessResponse,
    AxiosError<GenericResponse>,
    IFeedCreate
  >({
    mutationFn: mutateFeed,
    onSuccess: () => {
      toast.success("Feed created successfully");
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
        <Button variant="outline" className="rounded-full h-14 w-14 p-0">
          <IoIosAdd className="!w-12 !h-12" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Formik
          initialValues={{ content: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            mutate.mutate(values, {
              onSuccess: () => {
                resetForm();
              },
            });
          }}
        >
          {({ values }) => (
            <Form>
              <DialogHeader>
                <DialogTitle>Create Feed</DialogTitle>
                <DialogDescription>
                  Write something and save to post.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-3">
                  <Label htmlFor="content">Content</Label>
                  <Textarea name="content" />
                  <span
                    className={cn(
                      "text-xs",
                      values.content.length > 200 ? "text-red-500" : ""
                    )}
                  >
                    {values.content.length}/200
                  </span>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={mutate.isPending}>
                  {mutate.isPending ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default FeedCreate;
