import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { default as LoadingIcon } from '../../components/icons/Loading';
import { useAuth } from '../../contexts/auth';

const CreateInterview = ({
  showPopup,
  createdInterviews,
  setCreatedInterviews,
}) => {
  const [err, setErr] = useState({
    title: false,
    candidateName: false,
    interviewerName: false,
  });
  const [creatingInterview, setCreatingInterview] = useState(false);

  const { currentUser, softLogout } = useAuth();

  const controller = useMemo(() => new AbortController(), []);
  let titleRef = useRef(null);
  let candidateNameRef = useRef(null);
  let interviewerNameRef = useRef(null);
  useEffect(() => {
    console.log('ABORT READY');
    return () => {
      console.log('UMOUNTING');
      controller.abort();
    };
  }, [controller]);

  console.log('re-rendering');
  const createInterview = async () => {
    try {
      let errors = {};
      if (!titleRef.current.value.trim()) errors.title = true;
      if (!candidateNameRef.current.value.trim()) errors.candidateName = true;
      if (!interviewerNameRef.current.value.trim())
        errors.interviewerName = true;
      setErr({ ...err, ...errors });

      console.log('errors', errors);
      for (let i in errors) {
        console.log('aaai', err[i]);
        if (errors[i]) return toast.error('Some fields are missing');
      }
      if (creatingInterview) return;
      setCreatingInterview(true);

      let payload = {
        title: titleRef.current.value.trim(),
        candidateName: candidateNameRef.current.value.trim(),
        interviewerName: interviewerNameRef.current.value.trim(),
      };
      console.log(payload);
      let res = await fetch(
        process.env.REACT_APP_BACKEND_URL + '/interviews/create',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          signal: controller.signal,
          body: JSON.stringify(payload),
        }
      );
      res = await res.json();
      if (res.authenticated === false) softLogout();
      if (res.type !== 'success') throw Error(res.msg);
      setCreatedInterviews([...createdInterviews, res.interview]);
      showPopup(false);
      setCreatingInterview(false);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setCreatingInterview(false);
      console.log('ERR :( ', err);
      toast.error(err.message);
    }
  };
  return (
    <div className="animate-fade transition-all z-50 fixed inset-0 flex justify-center h-screen items-center bg-gray-300  bg-opacity-50">
      <div className="max-w-md m-10 w-full animate-slide-up p-6 bg-white rounded">
        <p className={`text-blue-800 font-bold text-lg mb-2`}>Create new </p>

        <div className="mb-2">
          <label
            className={`block ${
              err.title ? 'text-red-700' : 'text-gray-700'
            } text-sm font-bold mb-1`}
            htmlFor="interview-name"
          >
            Interview title
          </label>
          <input
            ref={titleRef}
            onChange={(e) => {
              if (!e.target.value) setErr({ ...err, title: true });
              else setErr({ ...err, title: false });
            }}
            autoComplete="off"
            autoFocus
            className={`${
              err.title ? 'border-red-500' : ''
            } appearance-none rounded w-full py-2 px-3 border-2 text-gray-700 leading-tight focus:border-blue-500 focus:outline-none focus:shadow-outline`}
            id="interview-name"
            type="text"
            placeholder="Eg: Technical Round II"
          />
        </div>

        <div className="mb-2">
          <label
            className={`block ${
              err.candidateName ? 'text-red-700' : 'text-gray-700'
            } text-sm font-bold mb-1`}
            htmlFor="candidate-name"
          >
            Candidate's name
          </label>
          <input
            ref={candidateNameRef}
            onChange={(e) => {
              if (!e.target.value) setErr({ ...err, candidateName: true });
              else setErr({ ...err, candidateName: false });
            }}
            className={`${err.candidateName ? 'border-red-500' : ''}
              appearance-none rounded w-full py-2 px-3 border-2 text-gray-700 leading-tight focus:border-blue-500 focus:outline-none focus:shadow-outline`}
            id="candidate-name"
            type="text"
            placeholder="Eg: Stefan"
          />
        </div>
        <div className="mb-2">
          <label
            className={`block ${
              err.interviewerName ? 'text-red-700' : 'text-gray-700'
            } text-sm font-bold mb-1`}
            htmlFor="interviewer-name"
          >
            Interviewer's name
          </label>
          <input
            ref={interviewerNameRef}
            onChange={(e) => {
              if (!e.target.value) setErr({ ...err, interviewerName: true });
              else setErr({ ...err, interviewerName: false });
            }}
            className={`
            ${err.interviewerName ? 'border-red-500' : ''}
            appearance-none rounded w-full py-2 px-3 border-2 text-gray-700 leading-tight focus:border-blue-500 focus:outline-none focus:shadow-outline`}
            id="interviewer-name"
            type="text"
            placeholder="Eg: Katherine"
          />
        </div>

        <div className="flex flex-row-reverse justify-between my-4">
          <button
            className="relative inline-flex items-center bg-blue-500 border-0 py-1 px-3 focus:bg-blue-600 hover:bg-blue-600 rounded text-white  mx-2
              cursor-pointer"
            onClick={createInterview}
          >
            <span className="absolute p-2 right-full">
              {creatingInterview && <LoadingIcon height="20" width="20" />}
            </span>
            Create interview
          </button>
          <button
            onClick={() => {
              showPopup(false);
            }}
            className="px-4 py-2 font-semibold text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInterview;
