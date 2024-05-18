"use client";

import React, { useEffect, useState } from "react";
import { Input, InputProps } from "./input";
import { Button } from "./button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordInputProps extends Omit<InputProps, "type"> {
  classNames?: { showButton?: string };
  showPassword?: boolean;
  onShowPasswordClick?: (state: boolean) => void;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(
  (
    { className, classNames, showPassword, onShowPasswordClick, ...props },
    ref
  ) => {
    const [showPwd, setShowPwd] = useState(showPassword);

    function handleShowPassword() {
      if (onShowPasswordClick) onShowPasswordClick(showPassword || false);
      else setShowPwd(!showPwd);
    }

    useEffect(() => {
      setShowPwd(showPassword);
    }, [showPassword]);

    return (
      <div className=" relative h-fit ">
        <Input
          type={showPwd ? "text" : "password"}
          className={cn(" pr-8 ", className)}
          ref={ref}
          {...props}
        />

        <Button
          type="button"
          variant={"ghost"}
          className={cn(
            " absolute right-1 top-[50%] aspect-square h-fit max-h-8 translate-y-[-50%] px-2 py-0 ",
            classNames?.showButton
          )}
          onClick={(e) => handleShowPassword()}
        >
          {showPwd ? (
            <Eye strokeWidth={1.5} className="h-5 w-5" />
          ) : (
            <EyeOff strokeWidth={1.5} className="h-5 w-5" />
          )}
        </Button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
