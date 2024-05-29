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
          <TableHead className="hidden text-center md:table-cell">
            Date
          </TableHead>

          <TableHead className="hidden text-center lg:table-cell">
            Activity
          </TableHead>

          <TableHead className="text-center">Amount</TableHead>
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
                  className={cn("w-[5rem] justify-center py-1 text-xs", {
                    " bg-green-200 text-green-600 hover:bg-green-200 ":
                      activity.type === "Transfer",
                    " bg-amber-200 text-amber-600 hover:bg-amber-200 ":
                      activity.type === "Damage",
                  })}
                  variant="secondary"
                >
                  {activity.type}
                </Badge>
              </TableCell>

              <TableCell className="hidden text-center lg:table-cell">
                {activity.amount.toLocaleString(undefined, {
                  style: "currency",
                  currency: "NGN",
                  maximumFractionDigits: 0,
                })}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
