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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!initialised) {
    return (
      <Container className="pt-20">
        <center>
          <Spinner className="text-amber-900/40" />
        </center>
      </Container>
    );
  }

  return <>{children}</>;
}
