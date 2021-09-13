import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

const Invitation = ({ setShowInvitation, interview }) => {
  console.log(interview);
  const [consentAgree, setConsentAgree] = useState(false);
  const [showCam, setShowCam] = useState(false);

  const videoRef = useRef(null);

  const openCameraPopup = async () => {
    try {
      if (!consentAgree)
        return toast.error("Sorry! Can't allow without giving consent.");
      setShowCam(true);
      let stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const stopMedia = (stream) => {
    stream?.getTracks().forEach((track) => track.stop());
  };
  const proceedToInterview = async () => {
    try {
      stopMedia(videoRef.current.srcObject);
      setShowCam(false);
      setShowInvitation(false);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
    // setShowInvitation(false);
  };

  return (
    <>
      <div className="p-6 mx-auto w-5/6 max-w-3xl">
        <p className="text-blue-500 mb-2 font-semibold text-xl">
          Interview Invitation
        </p>
        <p className="mb-4">
          You are invited to join an interview. Check out interview details
          below. All the best.
        </p>

        <div>
          <table className="rounded-t-lg w-full bg-gray-200 text-gray-800">
            <thead className="text-left border-b-2 border-gray-300">
              <tr>
                <th className="px-4 py-3 text-center" colSpan="2">
                  Interview Details
                </th>
              </tr>
            </thead>

            <tbody>
              <tr className="bg-gray-100 border-b border-gray-200">
                <td className="px-4 py-3 font-semibold">Interview </td>
                <td className="px-4 py-3">{interview?.title}</td>
              </tr>
              <tr className="bg-gray-100 border-b border-gray-200">
                <td className="px-4 py-3 font-semibold">Candidate Name</td>
                <td className="px-4 py-3">{interview?.candidateName}</td>
              </tr>
              <tr className="bg-gray-100 border-b border-gray-200">
                <td className="px-4 py-3 font-semibold">Interviewer Name</td>
                <td className="px-4 py-3">{interview?.interviewerName}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="m-2">
          <input
            id="candidateConsent"
            type="checkbox"
            onChange={(e) => {
              setConsentAgree(!consentAgree);
            }}
            checked={consentAgree ? true : false}
          />
          <label htmlFor="candidateConsent" className="mx-2">
            I won't sue for not having{' '}
            <span className="underline text-blue-500">privacy policy</span> &{' '}
            <span className="underline text-blue-500">terms of service</span>.
          </label>
        </div>

        <button
          // disabled={consentAgree ? false : true}
          onClick={openCameraPopup}
          className={`${
            consentAgree ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-500'
          } p-2 text-white rounded my-2`}
        >
          AGREE AND JOIN INTERVIEW
        </button>

        <p className="text-sm text">
          By proceeding, you agree to provide camera and microphone permissions.
          You cannnot proceed without giving camera and microphone permissions.
        </p>
      </div>

      {showCam && (
        <div className="transition-all z-50 fixed inset-0 flex justify-center h-screen items-center bg-gray-300  bg-opacity-50">
          <div className="max-w-md m-10 w-full p-6 bg-white rounded">
            <p className={`text-blue-800 font-bold text-lg mb-2`}>
              This is how you are gonna look.
            </p>

            <div className="bg-blue-500 flex justify-center">
              <div className="h-40 w-40 bg-black">
                <video
                  className="h-40 w-40 object-cover mx-auto"
                  muted
                  ref={videoRef}
                  autoPlay
                  src=""
                ></video>
              </div>
            </div>
            <div className="flex flex-row-reverse justify-between my-4">
              <button
                className="relative inline-flex items-center bg-blue-500 border-0 py-1 px-3 focus:bg-blue-600 hover:bg-blue-600 rounded text-white  mx-2
              cursor-pointer"
                onClick={proceedToInterview}
              >
                Looks good! Proceed
              </button>
              <button
                onClick={() => {
                  stopMedia(videoRef.current.srcObject);
                  setShowCam(false);
                }}
                className="px-4 py-2 font-semibold text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Invitation;
