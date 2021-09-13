import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import Header from '../../components/Header';
import LoadingSkelton from '../../components/LoadingSkelton';
import useFetch from '../../hooks/useFetch';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useTitle from '../../hooks/useTitle';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/auth';
import { default as LoadingIcon } from '../../components/icons/Loading';

const InterviewInfo = () => {
  useTitle('Interview details | InterVyuh');

  const [updatingInterview, setUpdatingInterview] = useState(false);
  const { softLogout } = useAuth();
  const match = useRouteMatch();
  const interviewId = match.params.id;

  const quillFormats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
  ];
  const quillModules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image', 'video'],
      ['clean'],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };

  const controller = useMemo(() => new AbortController(), []);

  const {
    data: interviewData,
    loading: fetchLoading,
    error: fetchErr,
  } = useFetch(
    'GET',
    process.env.REACT_APP_BACKEND_URL + '/interviews/' + interviewId
  );

  const debounce = useCallback((func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = null;
      timer = setTimeout(() => {
        func.apply(context, args);
      }, 1000);
    };
  }, []);

  const [interview, setInterview] = useState({});

  useEffect(() => {
    if (!interviewData?.interview) return;
    setInterview(interviewData.interview);
    console.log('interviewData', interviewData);
    return () => controller.abort();
  }, [interviewData, controller]);

  // const interview = interviewData?.interview;

  const saveNote = useCallback(
    async (e) => {
      try {
        if (!interview?._id) return;
        let res = await fetch(
          process.env.REACT_APP_BACKEND_URL + '/interviews/update-note',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({ note: e, interviewId: interview._id }),
            credentials: 'include',
          }
        );

        res = await res.json();
        console.log(res);
        if (res.authenticated === false) softLogout();
        showSavedStatus(true);
      } catch (err) {
        toast.error(err.message);
      }
    },
    [interview, softLogout]
  );

  const showSavedStatus = (e) => {
    const el = document.getElementById('saved-note-status');
    if (!el) return;
    el.innerHTML = e ? 'Saved' : 'Saving...';
  };

  const debounceSaveNote = useMemo(
    () => debounce(saveNote),
    [debounce, saveNote]
  );

  const history = useHistory();

  const updateStatus = async () => {
    try {
      if (!interview?._id) return;
      if (updatingInterview) return;
      setUpdatingInterview(true);
      let payload = {
        isEnded: !interview.isEnded,
        interviewId: interview?._id,
      };
      let res = await fetch(
        process.env.REACT_APP_BACKEND_URL + '/interviews/mark',
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
      setInterview({
        ...interview,
        isEnded: res.isEnded,
        endTime: res.endTime,
      });
      if (res.authenticated === false) softLogout();
      if (res.type !== 'success') throw Error(res.msg);
      setUpdatingInterview(false);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setUpdatingInterview(false);
      console.log('ERR :( ', err);
      toast.error(err.message);
    }
  };
  return (
    <>
      <Header />
      {fetchErr && (
        <div className="p-6 text-center">
          <p className="text-red-500 mb-4 font-semibold text-xl">{fetchErr}</p>
          <p className="mb-2 max-w-md m-auto">
            Something isn't right! You think you shouldn't be seeing this?{' '}
            <a
              className="underline text-blue-500"
              href={`mailto:hi@deepakjangra.com?subject=I shouldn't be seeing this error&body=Here are rerror details.\nWindow Location Object: ${JSON.stringify(
                window.location
              )}\nError:${fetchErr}`}
            >
              Click here
            </a>{' '}
            to notify me. I will try my best to resolve this.
          </p>
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
      )}
      {!fetchLoading ? (
        interview._id && (
          <section className="">
            <div className="px-6 p-2 border-b">
              <p className="text-sm">
                <Link
                  to="/dashboard"
                  className="hover:bg-gray-400 hover:text-white rounded p-1 cursor-pointer"
                >
                  Dashboard
                </Link>
                <span>{'>'} Interview details</span>
              </p>
              <p className="font-semibold text-2xl text-blue-500">
                {interview.title}
              </p>
              {interview.isEnded && (
                <span className="text-red-500 font-semibold">
                  NOTE: This interview is marked as ended
                </span>
              )}
            </div>

            <div className="px-6 mt-2">
              <p>
                <span className="font-semibold">Candidate Name : </span>
                <span>{interview.candidateName}</span>
              </p>
              <p>
                <span className="font-semibold">Interviewer Name : </span>
                <span>{interview.interviewerName}</span>
              </p>
              <p>
                <span className="font-semibold">Candidate link : </span>
                {interview.candidateLink ? (
                  <>
                    <button
                      className="underline text-sm text-blue-500 hover:text-blue-900"
                      onClick={async (e) => {
                        try {
                          await navigator.clipboard.writeText(
                            window.location.origin +
                              '/join/i/' +
                              interview.candidateLink
                          );
                          toast.success('Candidate link copied to clipboard');
                        } catch (err) {
                          toast.error(err.message);
                        }
                      }}
                    >
                      Click here to copy candidate link
                    </button>
                  </>
                ) : (
                  <span>NA</span>
                )}
              </p>
              <p>
                <span className="font-semibold">Interviewer link : </span>
                {interview.interviewerLink ? (
                  <>
                    <button
                      onClick={(e) =>
                        window.open('/join/i/' + interview.interviewerLink)
                      }
                      className="font-semibold mr-2 rounded-full px-2 bg-blue-500 hover:bg-blue-700 text-white"
                    >
                      Join interview{' '}
                    </button>
                    <button
                      className="underline text-sm text-blue-500 hover:text-blue-900"
                      onClick={async (e) => {
                        try {
                          await navigator.clipboard.writeText(
                            window.location.origin +
                              '/join/i/' +
                              interview.interviewerLink
                          );
                          toast.success('Interviewer link copied to clipboard');
                        } catch (err) {
                          toast.error(err.message);
                        }
                      }}
                    >
                      Click link (Keep secret)
                    </button>
                  </>
                ) : (
                  <span>NA</span>
                )}
              </p>
              <p className="font-semibold text-2xl my-2">
                📝 Notes{' '}
                <span
                  className="text-gray-500 font-normal text-sm"
                  id="saved-note-status"
                ></span>{' '}
              </p>
              <ReactQuill
                theme="snow"
                // onChange={saveNote}
                onChange={(e) => {
                  showSavedStatus(false);
                  debounceSaveNote(e);
                }}
                value={interview.note}
                modules={quillModules}
                formats={quillFormats}
                // bounds={'.app'}
                placeholder="Your interview notes here..."
              />
            </div>
            <div className="px-6 mt-4">
              <div>
                <button
                  onClick={(e) => history.goBack()}
                  className="bg-white p-2 text-blue-500 rounded border hover:bg-blue-100"
                >
                  Back to dashboard
                </button>
              </div>
              <div className="mt-4">
                <span className="relative">
                  <span> Change status?</span>{' '}
                  <span
                    onClick={updateStatus}
                    className={`font-semibold  hover:underline cursor-pointer ${
                      interview.isEnded ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    Mark as{interview.isEnded ? ' ongoing' : ' ended'}
                  </span>
                  <span className="absolute ml-2 left-full transform top-1/2 -translate-y-1/2">
                    {updatingInterview && (
                      <LoadingIcon height="20" width="20" />
                    )}
                  </span>
                </span>
                <p className="mt-1 text-sm">
                  Don't worry. You can mark an interview as 'ongoing' or 'ended'
                  anytime.
                </p>
              </div>
            </div>
          </section>
        )
      ) : (
        <>
          <LoadingSkelton noborder="y" />
          <LoadingSkelton noborder="y" />
          <LoadingSkelton noborder="y" />
        </>
      )}
    </>
  );
};

export default InterviewInfo;
