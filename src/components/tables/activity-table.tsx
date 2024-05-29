"use client";

import { Badge } from "@/components/ui/badge";
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
import { Activity } from "@/types/activity.types";

export default function ActivityTable(props: {
  activities: Activity[];
  role?: UserRole;
}) {
  const { activities, role = "user" } = props;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="">Date</TableHead>

          <TableHead className="text-center">Activity</TableHead>

          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {activities.map((activity, index) => {
          return (
            <TableRow key={activity._id} className={cn("bg-accent", {})}>
              <TableCell>
                <div className="font-medium">
                  {new Date(activity.date).toLocaleDateString()}
                </div>
              </TableCell>

              <TableCell className="text-center">
                <Badge
                  className={cn("w-[7rem] justify-center py-1.5 text-xs", {
                    " bg-sky-200 text-sky-600 hover:bg-sky-200 ":
                      activity.type === "Transfer" ||
                      activity.type === "Purchase" ||
                      activity.type === "Inspection",
                    " bg-green-200 text-green-600 hover:bg-green-200 ":
                      activity.type === "Repair" ||
                      activity.type === "Upgrade" ||
                      activity.type === "Maintenance",
                    " bg-amber-200 text-amber-600 hover:bg-amber-200 ":
                      activity.type === "Damage",
                    " bg-red-200 text-red-600 hover:bg-red-200 ":
                      activity.type === "Sale",
                  })}
                  variant="secondary"
                >
                  {activity.type}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <div
                  className={cn({
                    " text-green-500 ": activity.amount > 0,
                    " text-red-500 ": activity.amount < 0,
                  })}
                >
                  {activity.amount !== 0
                    ? activity.amount.toLocaleString(undefined, {
                        style: "currency",
                        currency: "NGN",
                        maximumFractionDigits: 0,
                      })
                    : "-"}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
