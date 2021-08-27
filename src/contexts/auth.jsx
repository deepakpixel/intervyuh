import React, { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

const AuthContext = React.createContext();

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const login = (username, password) => {
    return new Promise(async (resolve, reject) => {
      // console.log('hi');

      try {
        let res = await fetch(
          process.env.REACT_APP_BACKEND_URL + '/auth/login',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          }
        );
        res = await res.json();
        if (res.type === 'success') {
          localStorage.setItem('currentuser', res.user.id);
          resolve(res.msg);
        } else {
          throw Error(res.msg);
        }
      } catch (error) {
        reject(Error(error.message));
      }
    });
  };

  const value = {
    currentUser,
    login,
    // signup,
    // logout,
  };

  useEffect(() => {
    let user = localStorage.getItem('currentuser');
    setCurrentUser(user);
  }, [setCurrentUser]);

  return (
    <AuthContext.Provider value={value}>
      {loading && <Loading />} {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export { useAuth };
