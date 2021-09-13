import React, { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

const AuthContext = React.createContext();

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem('currentuser') === 'null'
      ? null
      : localStorage.getItem('currentuser')
  );

  const login = (username, password) => {
    return new Promise(async (resolve, reject) => {
      // console.log('hi');

      try {
        let res = await fetch(
          process.env.REACT_APP_BACKEND_URL + '/auth/login',
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          }
        );
        res = await res.json();
        if (res.type === 'success') {
          localStorage.setItem('currentuser', res.user._id);
          setCurrentUser(res.user._id);
          resolve(res.msg);
        } else {
          throw Error(res.msg);
        }
      } catch (error) {
        reject(Error(error.message));
      }
    });
  };

  const softLogout = () => {
    return new Promise(async (resolve, reject) => {
      try {
        localStorage.removeItem('currentuser');
        setCurrentUser(null);
      } catch (error) {
        reject(Error(error.message));
      }
    });
  };
  const logout = () => {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await fetch(
          process.env.REACT_APP_BACKEND_URL + '/auth/logout',
          {
            method: 'DELETE',
            credentials: 'include',
          }
        );
        res = await res.json();
        if (res.type === 'success') {
          localStorage.setItem('currentuser', null);
          setCurrentUser(null);
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
    softLogout,
    logout,
  };

  // useEffect(() => {
  //   let user = localStorage.getItem('currentuser');
  //   user === 'null' ? setCurrentUser(null) : setCurrentUser(user);
  // }, [setCurrentUser]);

  return (
    <AuthContext.Provider value={value}>
      {loading && <Loading />} {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export { useAuth };
