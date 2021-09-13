import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import Header from '../../components/Header';
import LoadingSkelton from '../../components/LoadingSkelton';
import { useSocket } from '../../contexts/socket';
import useFetch from '../../hooks/useFetch';
import InterviewScreen from './InterviewScreen';
import Invitation from './Invitation';

const Interview = () => {
  const [showInvitation, setShowInvitation] = useState(true);
  const [role, setRole] = useState(null);
  const history = useHistory();
  const token = useParams().token;

  const socket = useSocket();

  const {
    data: interviewDetails,
    loading: fetchLoading,
    error: fetchErr,
  } = useFetch(
    'GET',
    process.env.REACT_APP_BACKEND_URL + '/interviews/validate/' + token
  );

  useEffect(() => {
    if (interviewDetails?.role) setRole(interviewDetails.role);
    console.log('setting role', interviewDetails?.role);
  }, [interviewDetails?.role]);

  const roleConnection =
    role === 'c'
      ? 'candidateConnection'
      : role === 'i'
      ? 'interviewerConnection'
      : null;

  if (interviewDetails?.interview?.[roleConnection] !== socket.id)
    console.log('FFFFFFFFFFFFFFFFFFFFFFF');
  return (
    <>
      <Header />
      {fetchLoading ? (
        <>
          <LoadingSkelton noborder={true} />
          <LoadingSkelton noborder={true} />
          <LoadingSkelton noborder={true} />
        </>
      ) : fetchErr ||
        interviewDetails?.interview?.isEnded ||
        (interviewDetails?.interview?.[roleConnection] &&
          interviewDetails?.interview?.[roleConnection] !== socket.id) ? (
        <div className="p-6 text-center">
          <p className="text-red-500 mb-4 font-semibold text-xl">
            {interviewDetails?.interview?.isEnded
              ? 'Interview ended '
              : interviewDetails?.interview?.[roleConnection]
              ? 'Already joined '
              : 'Invalid link '}
          </p>
          <div className="mb-2 max-w-md m-auto">
            {interviewDetails?.interview?.isEnded
              ? 'Interview ended. '
              : interviewDetails?.interview?.[roleConnection]
              ? 'Already joined. '
              : 'This invitation link is not valid. '}
            Please talk to the interviewer.{' '}
            <div className="text-sm text-gray-700 mt-2">
              If you think, you shouldn't be seeing this.{' '}
              <a
                className="underline text-blue-500"
                href={`mailto:hi@deepakjangra.com?subject=I shouldn't be seeing this error&body=This link is not valid. Here are rerror details.\nWindow Location Object: ${JSON.stringify(
                  window.location
                )}\nError: Invalid invitation link`}
              >
                Click here
              </a>{' '}
              to notify me. I will try my best to resolve this.
            </div>
          </div>
          <button
            onClick={(e) => history.go(0)}
            className="bg-blue-500 hover:bg-blue-700 p-2 text-white rounded"
          >
            Try again
          </button>
          <button
            onClick={(e) => history.goBack()}
            className="bg-white p-2 text-blue-500 rounded border ml-2 hover:bg-blue-100"
          >
            Go back
          </button>
          <p className="m-2">
            <button
              onClick={(e) => history.push('/dashboard')}
              className="text-black hover:text-gray-500"
            >
              Go to home
            </button>
          </p>
        </div>
      ) : !showInvitation ? (
        <>
          {/* DEV  MODE -> ! */}
          <Invitation
            setShowInvitation={setShowInvitation}
            interview={interviewDetails?.interview}
          />
        </>
      ) : (
        <>
          <InterviewScreen role={role} />
        </>
      )}
    </>
  );
};

export default Interview;
