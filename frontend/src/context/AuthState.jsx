import { useState } from 'react';
import AuthContext from './AuthContext';

const AuthState = (props) => {
  // Check whether a token already exists
  const [token, setToken] = useState(
    localStorage.getItem('token')
  );

  // Call this after successful login or signup
  const login = (authToken) => {
    localStorage.setItem('token', authToken);
    setToken(authToken);
  };

  // Call this when the user logs out
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoggedIn: Boolean(token),
        login,
        logout
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;