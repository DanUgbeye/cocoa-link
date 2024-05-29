import RoundProgressBar from "@/components/round-progress-bar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
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
import { Asset } from "@/types/asset.types";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AssetsTable(props: { assets: Asset[] }) {
  const { assets } = props;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>

          <TableHead className="hidden text-center sm:table-cell">
            Location
          </TableHead>

          <TableHead className="hidden text-center sm:table-cell">
            Status
          </TableHead>

          <TableHead className="hidden text-center md:table-cell">
            Acquisition Date
          </TableHead>

          <TableHead className="hidden text-right md:table-cell">
            Initial Cost
          </TableHead>

          <TableHead className="text-center">Current Value</TableHead>

          <TableHead className="text-center"></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {assets.map((asset, index) => {
          return (
            <TableRow
              key={asset._id}
              className={cn("bg-accent", {
                " pointer-events-none opacity-50 ": asset.status === "Sold",
              })}
            >
              <TableCell>
                <div className="font-medium">{asset.name}</div>

                <div className="text-muted-foreground line-clamp-3 hidden text-xs text-neutral-500 md:inline">
                  {asset.description}
                </div>
              </TableCell>

              <TableCell className="hidden text-center sm:table-cell">
                {asset.currentLocation}
              </TableCell>

              <TableCell className="hidden text-center sm:table-cell">
                <Badge
                  className={cn("w-[5rem] justify-center py-1 text-xs", {
                    " bg-green-200 text-green-600 hover:bg-green-200 ":
                      asset.status === "Active",
                    " bg-red-200 text-red-600 hover:bg-red-200 ":
                      asset.status === "Damaged",
                    " bg-sky-200 text-sky-600 hover:bg-sky-200 ":
                      asset.status === "Sold",
                  })}
                  variant="secondary"
                >
                  {asset.status}
                </Badge>
              </TableCell>

              <TableCell className="hidden text-center md:table-cell">
                {new Date(asset.acquisitionDate).toLocaleDateString()}
              </TableCell>

              <TableCell className="hidden text-right md:table-cell">
                {asset.purchaseCost.toLocaleString(undefined, {
                  style: "currency",
                  currency: "NGN",
                  notation: "compact",
                })}
              </TableCell>

              <TableCell className="text-right">
                <div className=" flex items-center gap-x-2 ">
                  <div className=" mx-auto size-10 ">
                    <RoundProgressBar
                      value={Number(
                        asset.currentValuePercentage.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })
                      )}
                      text={`${Number(
                        asset.currentValuePercentage.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })
                      )}%`}
                    />
                  </div>

                  <div className=" ">
                    {asset.currentValue.toLocaleString(undefined, {
                      style: "currency",
                      currency: "NGN",
                      notation: "compact",
                    })}
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-right">
                <Link
                  href={`${PAGES.ASSETS}/${asset._id}`}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    " size-8 p-0"
                  )}
                >
                  <ChevronRight className=" size-5 " />
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
