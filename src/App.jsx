import Dashboard from './pages/dashboard/Dashboard';
import SocketProvider from './contexts/socket';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider, { useAuth } from './contexts/auth';
import PublicRoute from './components/routes/PublicRoute';
import PrivateRoute from './components/routes/PrivateRoute';
import Login from './pages/login/Login';
import Header from './components/Header';

const App = () => {
  return (
    <>
      <Router>
        <AuthProvider>
          <SocketProvider>
            <Switch>
              <Route path="/" exact>
                <Header />
                HOME
              </Route>
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <PublicRoute path="/login" component={Login} />
              <Route>THis is 404 not found page</Route>
            </Switch>
            <ToastContainer position="bottom-right" />
          </SocketProvider>
        </AuthProvider>
      </Router>
    </>
  );
};

export default App;
