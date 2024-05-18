import React from "react";

export default function useExecuteOnce() {
  const redirected = React.useRef(false);

  function executeOnce(fn: () => void) {
    if (redirected.current) {
      return;
    }
    redirected.current = true;
    fn();
  }

  function reset() {
    redirected.current = false;
  }

  return { executeOnce, reset };
}
