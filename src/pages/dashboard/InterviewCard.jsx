const InterviewCard = ({
  interview: {
    title,
    candidateName,
    interviewerName,
    createdAt,
    candidateUrl,
    interviewerUrl,
  },
}) => {
  return (
    <div className="border border-gray-200 shadow rounded-md p-4 w-full cursor-pointer group hover:bg-blue-50 hover:border-blue-500">
      <div className="flex-1 space-x-4">
        <div className="flex flex-col space-y-2 py-1">
          <div className="flex">
            <div className="flex flex-row">
              <div className="relative border-2 border-red-200 rounded-full bg-blue-400 h-8 w-8 flex items-center justify-center">
                <span className="font-bold text-white">
                  {interviewerName[0].toUpperCase()}
                </span>
              </div>
              <div className="border-2 border-red-200 -ml-2 rounded-full bg-blue-400 h-8 w-8 leading-8 flex items-center justify-center">
                <span className="font-bold text-white">
                  {candidateName[0].toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-2 text-lg font-semibold group-hover:text-blue-500">
              {title}
            </div>
          </div>
          <div className="space-y-2">
            <div className="leading-4">
              <span className="semibold">Candidate : </span>
              <span>{candidateName}</span>
            </div>
            <div className="leading-4">
              <span className="semibold">Interviewer : </span>
              <span>{interviewerName}</span>
            </div>
            <div className="leading-4 text-xs">Created at July 2, 2021</div>
          </div>
          <div className="self-end">
            <button className="pr-4 py-2 text-gray-600 hover:text-gray-900">
              More details
            </button>
            <button className="inline-flex items-center bg-blue-500 border-0 py-1 px-3 focus:bg-blue-600 hover:bg-blue-600 text-white rounded-full">
              Start interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
