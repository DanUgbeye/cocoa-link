"use client";

import React, { useEffect } from "react";
import { Button, ButtonProps } from "./ui/button";
import { useFormStatus } from "react-dom";
import Spinner from "./spinner";

interface FormButtonProps extends Omit<ButtonProps, "children"> {
  children?: React.ElementType<{ loading: boolean }> | React.ReactNode;
}

export default function FormButton(props: FormButtonProps) {
  const { children: Element, disabled, ...rest } = props;
  const { pending } = useFormStatus();

  return (
    <Button disabled={disabled || pending} {...rest}>
      {typeof Element === "function" ? <Element loading={pending} /> : Element}
    </Button>
  );
}
