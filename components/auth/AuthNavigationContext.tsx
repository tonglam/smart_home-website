"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface AuthNavigationContextType {
  showConnectHome: boolean;
  openConnectHome: () => void;
  closeConnectHome: () => void;
}

const AuthNavigationContext = createContext<
  AuthNavigationContextType | undefined
>(undefined);

export const AuthNavigationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [showConnectHome, setShowConnectHome] = useState(false);

  const openConnectHome = () => setShowConnectHome(true);
  const closeConnectHome = () => setShowConnectHome(false);

  return (
    <AuthNavigationContext.Provider
      value={{ showConnectHome, openConnectHome, closeConnectHome }}
    >
      {children}
    </AuthNavigationContext.Provider>
  );
};

export const useAuthNavigation = (): AuthNavigationContextType => {
  const context = useContext(AuthNavigationContext);
  if (context === undefined) {
    throw new Error(
      "useAuthNavigation must be used within an AuthNavigationProvider"
    );
  }
  return context;
};
