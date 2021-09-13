const ResultPopup = ({
  output: { output, statusCode, memory = null, cpuTime = null, stdin = 'NA' },
  showPopup,
}) => {
  return (
    <div>
      <div className="animate-fade transition-all z-50 fixed inset-0 flex justify-center h-screen items-center bg-gray-300  bg-opacity-50">
        <div className="max-w-md m-10 w-full animate-slide-up p-6 bg-white rounded">
          <div>
            <p className={`text-blue-800 font-bold text-lg mb-2`}>
              Submission result
            </p>
            <p className="font-semibold mt-2">STDIN</p>
            <div className="overflow-auto max-h-20 nice-scrollbar bg-gray-300 rounded p-2 text-sm">
              <pre>{stdin || ' '}</pre>
            </div>
            <p className="font-semibold mt-2">Output</p>
            <div className="overflow-auto max-h-60 nice-scrollbar bg-gray-300 rounded p-2 text-sm">
              <pre>{output === null ? 'null' : output?.trim()}</pre>
            </div>
            <p className="font-semibold mt-2">CPU Time</p>
            <div className="overflow-auto nice-scrollbar bg-gray-300 rounded p-2 text-sm">
              <pre>{cpuTime === null ? 'null' : cpuTime}</pre>
            </div>
            <p className="font-semibold mt-2">Memory</p>
            <div className="overflow-auto nice-scrollbar bg-gray-300 rounded p-2 text-sm">
              <pre>{memory === null ? 'null' : memory}</pre>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="relative inline-flex items-center bg-blue-500 border-0 py-2 px-4 focus:bg-blue-600 hover:bg-blue-600 rounded text-white  mx-2
              cursor-pointer"
              onClick={(e) => showPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPopup;
