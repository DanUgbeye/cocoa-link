import RoundProgressBar from "@/components/round-progress-bar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PAGES } from "@/data/page-map";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import { FullApplication } from "@/types/application.types";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ApplicationsTable(props: {
  applications: FullApplication[];
  role?: UserRole;
}) {
  const { applications, role = "user" } = props;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset Name</TableHead>

          <TableHead className="hidden text-center sm:table-cell">
            From
          </TableHead>

          <TableHead className="hidden text-center sm:table-cell">To</TableHead>

          <TableHead className="hidden text-center md:table-cell">
            Status
          </TableHead>

          {role === "admin" && <TableHead className="text-center"></TableHead>}
        </TableRow>
      </TableHeader>

      <TableBody>
        {applications.map((application, index) => {
          return (
            <TableRow
              key={application._id}
              className={cn("bg-accent", {
                " pointer-events-none opacity-50 ": application.approved,
              })}
            >
              <TableCell>
                <div className="font-medium">{application.asset.name}</div>

                <div className="text-muted-foreground line-clamp-3 hidden text-xs text-neutral-500 md:inline">
                  {application.asset.description}
                </div>
              </TableCell>

              <TableCell className="hidden text-center sm:table-cell">
                {application.from.name}
              </TableCell>

              <TableCell className="hidden text-center sm:table-cell">
                <Badge
                  className={cn("w-[5rem] justify-center py-1 text-xs", {
                    " bg-green-200 text-green-600 hover:bg-green-200 ":
                      application.approved,
                    " bg-red-200 text-red-600 hover:bg-red-200 ":
                      application.approved,
                  })}
                  variant="secondary"
                >
                  {application.approved ? "Approved" : "Pending"}
                </Badge>
              </TableCell>

              {role === "admin" && (
                <TableCell className="text-right">
                  <div className=" mx-auto flex items-center gap-2 ">
                    <Button className=" bg-green-600 hover:bg-green-500">
                      Approve
                    </Button>

                    <Button variant={"destructive"}>Reject</Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
