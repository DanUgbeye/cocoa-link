"use client";

import { Container } from "@/components/container";
import Spinner from "@/components/spinner";
import { PropsWithChildren, useEffect } from "react";
import { StoreInitialState, useAppStore } from ".";

interface Props extends PropsWithChildren {
  initialState: StoreInitialState;
}

export default function ClientStoreProvider(props: Props) {
  const { children, initialState } = props;
  const initialised = useAppStore(({ initialised }) => initialised);
  const { initialiseStore } = useAppStore();

  useEffect(() => {
    initialiseStore(initialState);
  }, []);

  if (!initialised) {
    return (
      <Container className=" py-10 ">
        <center>
          <Spinner />
        </center>
      </Container>
    );
  }

  return <>{children}</>;
}
