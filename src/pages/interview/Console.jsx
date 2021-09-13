import { useState } from 'react';
import { default as LoadingIcon } from '../../components/icons/Loading';
import { default as PlayIcon } from '../../components/icons/Play';
import ResultPopup from './ResultPopup';

const Console = ({ runCode, stopCode, codeRunning, stdinRef, output }) => {
  const [showResultPopup, setShowResultPopup] = useState(false);
  return (
    <>
      {showResultPopup && (
        <ResultPopup showPopup={setShowResultPopup} output={output} />
      )}
      <div className="px-4 pt-2 text-sm bg-gray-200 flex flex-1 flex-col md:flex-row overflow-y-auto">
        <div className="w-full p-2">
          <div className="flex justify-between items-center">
            <label htmlFor="stdin">Provide your input</label>
            <span className="flex items-center">
              <button
                className={`h-5 w-5 ${
                  codeRunning ? 'bg-red-500 hover:bg-red-700' : 'bg-red-300'
                }`}
                disabled={!codeRunning}
                onClick={stopCode}
              ></button>
              <button
                onClick={runCode}
                className="mx-1 flex items-center hover:bg-green-500 bg-green-700 py-1 px-2 rounded-t text-white"
              >
                <span className="mr-2">Run</span>{' '}
                {codeRunning ? (
                  <LoadingIcon height="14" width="14" />
                ) : (
                  <PlayIcon height="14" width="14" />
                )}
              </button>
            </span>
          </div>
          <textarea
            id="stdin"
            ref={stdinRef}
            className="p-1 w-full border-2 nice-scrollbar resize-none text-sm whitespace-nowrap ring-1"
            rows="3"
            placeholder="Your custom input"
          ></textarea>
        </div>
        <div className="w-full p-2">
          <div className="p-1">
            <label htmlFor="stdin">
              Result{' '}
              {output?.output !== null && (
                <span
                  className="font-semibold underline cursor-pointer text-blue-500"
                  onClick={(e) => setShowResultPopup(true)}
                >
                  Detailed Result
                </span>
              )}
            </label>
          </div>
          <textarea
            id="stdin"
            className="p-1 w-full border-2 nice-scrollbar resize-none text-sm whitespace-pre ring-1"
            rows="3"
            placeholder="Result will show here"
            value={output?.output?.trim() || ''}
            disabled={true}
          ></textarea>
        </div>
      </div>
    </>
  );
};

export default Console;
