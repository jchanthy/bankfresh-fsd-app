import React, { createContext, useState } from 'react';

// Create a context
export const UserContext = createContext({});

// Create a provider
export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return <UserContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated }}>{children}</UserContext.Provider>;
}
