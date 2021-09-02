import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Telephone from '../../components/Telephone';
import IDE from '../../components/IDE';

import { useSocket } from '../../contexts/socket';
import Whiteboard from '../../components/Whiteboard';
import { useAuth } from '../../contexts/auth';
import Login from '../login/Login';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import CreateInterview from './CreateInterview';
import InterviewCard from './InterviewCard';
import LoadingCard from '../../components/LoadingCard';
import UpcomingInterviews from './UpcomingInterviews';
import useFetch from '../../hooks/useFetch';
import PastInterviews from './PastInterviews';

const Dashboard = () => {
  const history = useHistory();
  const { currentUser, logout, softLogout } = useAuth();
  console.log(currentUser);

  const {
    data: allInterviews,
    loading: fetchLoading,
    error: fetchErr,
  } = useFetch(
    'GET',
    process.env.REACT_APP_BACKEND_URL + '/interviews?type=upcoming'
  );

  let localCodeContent = JSON.parse(localStorage.getItem('codeContent'));
  const [codeContent, setCodeContent] = useState(
    localCodeContent || {
      clike: '//Write your C code here\n',
      javascript: '//Write your JS code here\n',
    }
  );
  const [codeLanguage, setCodeLanguage] = useState('clike');
  const [showCreateInterview, setShowCreateInterview] = useState(false);

  const socket = useSocket();

  useEffect(() => {
    localStorage.setItem('codeContent', JSON.stringify(codeContent));
    console.log('emitting');
    socket.emit(
      'code',
      JSON.stringify({
        language: codeLanguage,
        codeContent: codeContent[codeLanguage],
      })
    );
  }, [codeContent, socket, codeLanguage]);

  // console.log(fetchLoading, fetchErr);
  return (
    <>
      <Header />
      <section className="container px-6 mx-auto">
        <p className="my-2 text-base bg-green-500 rounded-md p-2 text-white">
          <span className="font-semibold">From Creator:</span> Hey there! 👋
          Welcome to InterVyuh, coding interview platform from future. App demo
          is available{' '}
          <a
            rel="noopener noreferrer"
            className="underline"
            href="youtube.com/channel/UC8YfuH1bkqPoG5H0eNiQ00Q"
            target="_blank"
          >
            here
          </a>
          . Also if possible please share your feedback at{' '}
          <a
            className="underline"
            href="mailto:hi@deepakjangra.com?subject=InterVyuh Feedback&body=InterVyuh Feedback"
          >
            hi@deepakjangra.com
          </a>
          , I would love to hear.
        </p>

        <UpcomingInterviews
          setShowCreateInterview={setShowCreateInterview}
          interviewsData={{ allInterviews, fetchErr, fetchLoading }}
        />

        <PastInterviews
          interviewsData={{ allInterviews, fetchErr, fetchLoading }}
        />

        {showCreateInterview && (
          <CreateInterview showPopup={setShowCreateInterview} />
        )}

        {/* <Whiteboard />
      <Telephone />
      <IDE
      options={{
        language: codeLanguage,
        value: codeContent[codeLanguage],
        onChange: (val) => {
          setCodeContent({ ...codeContent, [codeLanguage]: val });
        },
      }}
    /> */}
      </section>
    </>
  );
};

export default Dashboard;
