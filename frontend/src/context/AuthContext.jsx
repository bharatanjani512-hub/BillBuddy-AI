import { createContext, useEffect, useState } from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
} from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      console.log("➡️ loadUser() started");

      const token = localStorage.getItem("access_token");

      console.log("Stored Token:", token);

      if (!token) {
        console.log("❌ No token found");
        setLoading(false);
        return;
      }

      const response = await getCurrentUser();

      console.log("✅ /users/me response:", response);

      setUser(response.payload);
    } catch (error) {
      console.log("❌ loadUser() failed");
      console.log(error);

      localStorage.removeItem("access_token");
      setUser(null);
    }

    setLoading(false);
  };

  const login = async (email, password) => {
    console.log("1️⃣ Calling Login API...");

    const response = await loginUser(email, password);

    console.log("2️⃣ Login Response:", response);

    localStorage.setItem(
      "access_token",
      response.access_token
    );

    console.log(
      "3️⃣ Token Saved:",
      localStorage.getItem("access_token")
    );

    console.log("4️⃣ Calling loadUser()...");

    await loadUser();

    console.log("5️⃣ loadUser() completed");
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}