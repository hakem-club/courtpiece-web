import React from "react";

export function createRequiredContext<T>(displayName: string, overrideGetter?: (() => T | null)) {
  const context = React.createContext<T | null>(null);
  context.displayName = displayName;

  const useContext = () => {
    const ctx = React.useContext(context);
    if (ctx === undefined) {
      throw new Error(
        `use${displayName} must be used inside ${displayName}Provider`
      );
    }
    const override = overrideGetter == null ? null : overrideGetter();
    const result = override ?? ctx;
    if (result == null) {
      throw new Error(
        `could not resolve a value for use${displayName}`
      );
    }

    return result;
  };

  return [context.Provider, useContext] as const;
}
