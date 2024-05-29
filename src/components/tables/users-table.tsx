"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFormEffect } from "@/hooks/use-form-effect";
import { cn } from "@/lib/utils";
import { deleteUser } from "@/server/modules/user/user.actions";
import { User } from "@/types";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import FormButton from "../form-button";
import Spinner from "../spinner";

export default function UsersTable(props: { users: User[] }) {
  const { users } = props;
  const [state, action] = useFormState(deleteUser, {
    status: "UNSET",
    message: "",
    timestamp: Date.now(),
  });

  useFormEffect(state, (changedState) => {
    if (changedState.status === "ERROR") {
      toast.error(changedState.message);
    }
    if (changedState.status === "SUCCESS") {
      toast.success(changedState.message);
    }
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>

          <TableHead className="hidden sm:table-cell">Email</TableHead>

          <TableHead className="hidden text-center sm:table-cell">
            Join Date
          </TableHead>

          <TableHead className="text-center"></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.map((user, index) => {
          return (
            <TableRow key={user._id} className={cn("bg-accent")}>
              <TableCell>
                <div className="font-medium">{user.name}</div>
              </TableCell>

              <TableCell className="hidden sm:table-cell">
                {user.email}
              </TableCell>

              <TableCell className="hidden text-center md:table-cell">
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>

              <TableCell className="text-right">
                <form action={action}>
                  <input
                    id={"userId"}
                    name={"userId"}
                    defaultValue={user._id}
                    className=" hidden"
                  />

                  <FormButton
                    variant={"destructive"}
                    className=" w-full max-w-[7rem] "
                  >
                    {({ loading }) =>
                      loading ? <Spinner className=" size-5 " /> : "Delete"
                    }
                  </FormButton>
                </form>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
