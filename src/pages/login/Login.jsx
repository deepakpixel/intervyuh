import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import useTitle from '../../hooks/useTitle';

const Login = () => {
  const { login } = useAuth();
  const history = useHistory();
  const ref1 = useRef(null);
  const ref2 = useRef(null);

  useTitle('Login | InterVyuh');

  const logMeIn = async (e) => {
    try {
      e.preventDefault();
      let msg = await login(ref1.current.value, ref2.current.value);
      toast.success(msg);
      history.push('/dashboard');
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div>
      <form onSubmit={logMeIn}>
        <input ref={ref1} type="text" />
        <input ref={ref2} type="password" />
        <button type="submit">logn</button>
      </form>
    </div>
  );
};

export default Login;
