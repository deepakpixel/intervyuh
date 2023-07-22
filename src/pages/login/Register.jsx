import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import useTitle from '../../hooks/useTitle';

const Register = () => {
  const { register } = useAuth();
  const history = useHistory();
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  useTitle('Register | InterVyuh');

  const registerMe = async (e) => {
    try {
      e.preventDefault();
      let msg = await register(ref1.current.value, ref2.current.value, ref3.current.value);
      toast.success(msg);
      history.push('/dashboard');
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div>
      <form onSubmit={registerMe}>
        <input ref={ref1} type="text" />
        <input ref={ref2} type="text" />
        <input ref={ref3} type="password" />
        <button type="submit">register</button>
      </form>
    </div>
  );
};

export default Register;
