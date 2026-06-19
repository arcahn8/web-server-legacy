import React, { createContext, useState, useCallback, useRef } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isSigned, setIsSigned] = useState({ status: false, id: "" });
  const isSignedRef = useRef();

  const handleSigned = useCallback((value) => {
    if (isSignedRef.current !== value.id) {
      setIsSigned(value);
    }
    isSignedRef.current = value.id;
  }, []);

  return (
    <AuthContext.Provider value={{ isSigned, handleSigned }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
