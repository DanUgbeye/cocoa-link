"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  approveApplication,
  deleteApplication,
  rejectApplication,
} from "@/server/modules/applications/application.actions";
import { UserRole } from "@/types";
import { FullApplication } from "@/types/application.types";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import FormButton from "../form-button";
import Spinner from "../spinner";

export default function ApplicationsTable(props: {
  applications: FullApplication[];
  role?: UserRole;
}) {
  const { applications, role = "user" } = props;

  const [approveState, approveAction] = useFormState(approveApplication, {
    status: "UNSET",
    message: "",
    timestamp: Date.now(),
  });

  useFormEffect(approveState, (changedState) => {
    if (changedState.status === "ERROR") {
      toast.error(changedState.message);
    }
    if (changedState.status === "SUCCESS") {
      toast.success(changedState.message);
    }
  });

  const [rejectState, rejectAction] = useFormState(rejectApplication, {
    status: "UNSET",
    message: "",
    timestamp: Date.now(),
  });

  useFormEffect(rejectState, (changedState) => {
    if (changedState.status === "ERROR") {
      toast.error(changedState.message);
    }
    if (changedState.status === "SUCCESS") {
      toast.success(changedState.message);
    }
  });

  const [deleteState, deleteAction] = useFormState(deleteApplication, {
    status: "UNSET",
    message: "",
    timestamp: Date.now(),
  });

  useFormEffect(deleteState, (changedState) => {
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
          <TableHead>Asset Name</TableHead>

          {role === "admin" && (
            <TableHead className="hidden text-center md:table-cell">
              From
            </TableHead>
          )}

          <TableHead className="hidden text-center lg:table-cell">To</TableHead>

          <TableHead className="text-center">Status</TableHead>

          <TableHead className="text-center"></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {applications.map((application, index) => {
          return (
            <TableRow
              key={application._id}
              className={cn("bg-accent", {
                " pointer-events-none opacity-50 ":
                  application.status === "Rejected" ||
                  application.status === "Approved",
              })}
            >
              <TableCell>
                <div className="font-medium">{application.asset.name}</div>

                <div className="text-muted-foreground line-clamp-3 hidden text-xs text-neutral-500 md:inline">
                  {application.asset.description}
                </div>
              </TableCell>

              {role === "admin" && (
                <TableCell className="hidden text-center md:table-cell">
                  {application.from.name}
                </TableCell>
              )}

              <TableCell className="hidden text-center lg:table-cell">
                {application.to.name}
              </TableCell>

              <TableCell className="text-center">
                <Badge
                  className={cn("w-[5rem] justify-center py-1 text-xs", {
                    " bg-green-200 text-green-600 hover:bg-green-200 ":
                      application.status === "Approved",
                    " bg-amber-200 text-amber-600 hover:bg-amber-200 ":
                      application.status === "Pending",
                  })}
                  variant="secondary"
                >
                  {application.status}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                {role === "admin" && (
                  <div className=" mx-auto flex items-center justify-end gap-2 ">
                    <form action={approveAction}>
                      <input
                        id={"applicationId"}
                        name={"applicationId"}
                        defaultValue={application._id}
                        className=" hidden"
                      />

                      <FormButton className="h-8 w-[5rem] bg-green-600 text-xs hover:bg-green-500 md:w-[7rem]">
                        {({ loading }) =>
                          loading ? <Spinner className=" size-4 " /> : "Approve"
                        }
                      </FormButton>
                    </form>

                    <form action={rejectAction}>
                      <input
                        id={"applicationId"}
                        name={"applicationId"}
                        defaultValue={application._id}
                        className=" hidden"
                      />

                      <FormButton
                        variant={"destructive"}
                        className=" h-8 w-[5rem] text-xs md:w-[7rem] "
                      >
                        {({ loading }) =>
                          loading ? <Spinner className=" size-4 " /> : "Reject"
                        }
                      </FormButton>
                    </form>
                  </div>
                )}

                {role === "user" && (
                  <div className=" mx-auto flex items-center justify-end gap-2 ">
                    <form action={deleteAction}>
                      <input
                        id={"applicationId"}
                        name={"applicationId"}
                        defaultValue={application._id}
                        className=" hidden"
                      />

                      <FormButton
                        variant={"destructive"}
                        className=" h-8 w-[5rem] text-xs md:w-[7rem] "
                      >
                        {({ loading }) =>
                          loading ? <Spinner className=" size-4 " /> : "Delete"
                        }
                      </FormButton>
                    </form>
                  </div>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
