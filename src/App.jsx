import Dashboard from './pages/dashboard/Dashboard';
import SocketProvider from './contexts/socket';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider, { useAuth } from './contexts/auth';

const App = () => {
  return (
    <>
      <Router>
        <AuthProvider>
          <SocketProvider>
            <Dashboard />
            <ToastContainer position="bottom-right" />
          </SocketProvider>
        </AuthProvider>
      </Router>
    </>
  );
};

export default App;
