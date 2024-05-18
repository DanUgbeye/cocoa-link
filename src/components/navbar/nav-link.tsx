import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import { HTMLAttributes } from "react";

interface NavLinkProps extends LinkProps, HTMLAttributes<HTMLAnchorElement> {}

export default function NavLink(props: NavLinkProps) {
  const { children, className, ...rest } = props;

  return (
    <Link
      {...rest}
      className={cn(
        " text-white underline-offset-4 hover:underline ",
        className
      )}
    >
      {children}
    </Link>
  );
}
