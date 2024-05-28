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
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import { FullApplication } from "@/types/application.types";

export default function ApplicationsTable(props: {
  applications: FullApplication[];
  role?: UserRole;
}) {
  const { applications, role = "user" } = props;

  function handleAcceptTransfer() {}

  function handleRejectTransfer() {}

  function handleDeleteTransfer() {}

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset Name</TableHead>

          {role === "admin" && (
            <TableHead className="hidden text-center sm:table-cell">
              From
            </TableHead>
          )}

          <TableHead className="hidden text-center sm:table-cell">To</TableHead>

          <TableHead className="hidden text-center md:table-cell">
            Status
          </TableHead>

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
                  application.status === "Cancelled" ||
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
                <TableCell className="hidden text-center sm:table-cell">
                  {application.from.name}
                </TableCell>
              )}

              <TableCell className="hidden text-center sm:table-cell">
                {application.to.name}
              </TableCell>

              <TableCell className="hidden text-center sm:table-cell">
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
                    <Button
                      className=" bg-green-600 hover:bg-green-500"
                      onClick={() => handleAcceptTransfer()}
                    >
                      Approve
                    </Button>

                    <Button
                      variant={"destructive"}
                      onClick={() => handleRejectTransfer()}
                    >
                      Reject
                    </Button>
                  </div>
                )}

                {role === "user" && (
                  <div className=" mx-auto flex items-center justify-end gap-2 ">
                    <Button
                      variant={"destructive"}
                      onClick={() => handleDeleteTransfer()}
                    >
                      Delete
                    </Button>
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
