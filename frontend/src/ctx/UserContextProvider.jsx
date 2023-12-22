import React, { createContext, useState, useEffect } from 'react';

// Create a context
export const UserContext = createContext({});

// Create a provider
export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Load the user from localStorage
    const user = JSON.parse(localStorage.getItem('bankfresh-user'));
    // Load the token from localStorage
    const token = localStorage.getItem('bankfresh-token');
    if (user) {
      setUser(user);
      setIsAuthenticated(true);
      setToken(token);
    }
  }, []);

  function login(user, token) {
    // Save the user to localStorage
    localStorage.setItem('bankfresh-user', JSON.stringify(user));
    // Save the token to localStorage
    localStorage.setItem('bankfresh-token', token);
    // Set the user and token in state
    setUser(user);
    setIsAuthenticated(true);
    setToken(token);
  }

  function logout() {
    // Remove the user and token from localStorage
    localStorage.removeItem('bankfresh-user');
    localStorage.removeItem('bankfresh-token');
    // Remove the user and token from state
    setUser(null);
    setIsAuthenticated(false);
    setToken(null);
  }
  return <UserContext.Provider value={{ user, login, isAuthenticated, token, logout }}>{children}</UserContext.Provider>;
}
