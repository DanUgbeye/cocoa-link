import React from "react";
import { cn } from "@/lib/utils";

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-2", className)} {...props} />;
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { error?: boolean }
>(({ className, error, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        error && "text-red-500 dark:text-red-900",
        className
      )}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        "text-sm text-neutral-500 dark:text-neutral-400",
        className
      )}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { message?: string }
>(({ className, children, message, ...props }, ref) => {
  const body = message || children;

  return (
    body && (
      <p
        ref={ref}
        className={cn(
          "text-xs font-medium text-red-500 dark:text-red-900",
          className
        )}
        {...props}
      >
        {body}
      </p>
    )
  );
});
FormMessage.displayName = "FormMessage";

export { FormItem, FormLabel, FormDescription, FormMessage };
