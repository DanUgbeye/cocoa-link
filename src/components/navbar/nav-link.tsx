import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import { HTMLAttributes } from "react";

interface NavLinkProps extends LinkProps, HTMLAttributes<HTMLAnchorElement> {}

export default function NavLink(props: NavLinkProps) {
  const { children, className, ...rest } = props;

  return (
    <Link
      {...rest}
      className={cn("text-white/70 duration-300 hover:text-white", className)}
    >
      {children}
    </Link>
  );
}
