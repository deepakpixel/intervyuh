import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import IDE from '../../components/IDE';
import Whiteboard from '../../components/Whiteboard';
import { useSocket } from '../../contexts/socket';
import Console from './Console';
import { default as PlayIcon } from '../../components/icons/Play';
import { default as LoadingIcon } from '../../components/icons/Loading';
import DefaultCodeSnippets from './../../config/DefaultCodeSnippets';
import { useParams, useHistory } from 'react-router-dom';
import Cams from '../../components/Cams';
import { usePeer } from '../../contexts/peer';

const InterviewScreen = ({ role }) => {
  const history = useHistory();
  const mainRef = useRef(null);
  const tabRef = useRef(null);
  const socket = useSocket();
  const token = useParams().token;
  const [displayMode, setDisplayMode] = useState('ide');
  const [codeRunning, setCodeRunning] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('cpp17');
  const [output, setOutput] = useState({ output: null });
  let localCodeContent = JSON.parse(localStorage.getItem('codeContent'));
  if (!localCodeContent?.token === token) {
    console.log('RESETING LOCALSTORAGE');
    localStorage.setItem(
      'codeContent',
      JSON.stringify({ ...DefaultCodeSnippets, token })
    );
  }

  const peer = usePeer();
  useEffect(() => {
    if (!peer.id) return;
    console.log(
      'PEERRRR sending to partner',
      peer.id,
      peer._id,
      peer.connected
    );
    socket.emit('joined-interview', { token, peerId: peer._id });
    console.log('sent', peer.id);
  }, [socket, token, peer]);

  const [codeContent, setCodeContent] = useState(
    localCodeContent || DefaultCodeSnippets
  );
  const stdinRef = useRef(null);

  const controller = useMemo(() => new AbortController(), []);

  const debounce = useCallback((func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = null;
      timer = setTimeout(() => {
        func.apply(context, args);
      }, 500);
    };
  }, []);

  const emitCodeContent = useCallback(
    async (e) => {
      try {
        console.log('emitting ', e);
        socket.emit('code', {
          language: codeLanguage,
          codeContent: e,
        });
      } catch (err) {
        toast.error(err.message);
      }
    },
    [codeLanguage, socket]
  );

  useEffect(() => {
    socket.emit('joined');
  });

  const debounceEmitCodeContent = useMemo(
    () => debounce(emitCodeContent),
    [debounce, emitCodeContent]
  );

  useEffect(
    () =>
      localStorage.setItem(
        'codeContent',
        JSON.stringify({ ...codeContent, token })
      ),
    [codeContent, token]
  );

  useEffect(() => {
    socket.on('code', (data) => {
      let codeContent = JSON.parse(localStorage.getItem('codeContent'));
      setCodeContent({
        ...codeContent,
        [data.language]: {
          ...codeContent[data.language],
          code: data.codeContent,
        },
      });
    });

    return () => {
      console.log('removing');
      socket.off('code');
    };
  }, [socket]);

  useEffect(() => {
    console.log('ABORT READY');
    return () => {
      console.log('***************ABORTING RUNSTOP CODE***************');
      controller.abort();
    };
  }, [controller]);

  const runCode = async () => {
    try {
      if (codeRunning) return;
      setCodeRunning(true);
      let payload = {
        token,
        codeInfo: {
          script: codeContent[codeLanguage].code,
          version: DefaultCodeSnippets[codeLanguage].version,
          stdin: stdinRef?.current?.value,
          language: codeLanguage,
        },
      };
      let res = await fetch(
        process.env.REACT_APP_BACKEND_URL + '/execute-code',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        }
      );
      res = await res.json();
      console.log(res);
      setOutput(res);

      payload = {
        type: 'result',
        timestamp: Date.now(),
        result:res,
        token,
      };
      socket.emit('chat', payload);
    } catch (err) {
      if (err.name === 'AbortError') return;
      toast.error(err.message);
      console.log(err, err.name);
    }
    setCodeRunning(false);
  };
  const stopCode = () => {
    console.log('STOP SHIT');
    controller.abort();
    setCodeRunning(false);
  };

  return (
    <>
      <section className="flex flex-grow">
        <main ref={mainRef} className="w-2/3 flex flex-col">
          <div ref={tabRef} className="bg-gray-100 flex">
            <nav
              onClick={() => setDisplayMode('whiteboard')}
              className={`${
                displayMode === 'whiteboard'
                  ? 'bg-gray-800 text-white rounded-t'
                  : 'hover:bg-gray-300 cursor-pointer'
              } p-2`}
            >
              Whiteboard
            </nav>
            <nav
              onClick={() => setDisplayMode('ide')}
              className={`${
                displayMode === 'ide'
                  ? 'bg-gray-800 text-white rounded-t'
                  : 'hover:bg-gray-300 cursor-pointer'
              } p-2`}
            >
              Code Editor
            </nav>
            <div className="flex flex-1 justify-end">
              <nav className="p-2">
                <label htmlFor="select-language" className="mr-2">
                  Language:
                </label>
                <select
                  id="select-language"
                  className="ring-2 outline-none rounded"
                  onChange={(e) => setCodeLanguage(e.target.value)}
                >
                  <option value="cpp17">C++ 17</option>
                  <option value="python3">Python 3</option>
                  <option value="nodejs">Javascript</option>
                  <option value="java">Java</option>
                  <option value="go">Go</option>
                  <option value="kotlin">Kotlin</option>
                </select>
              </nav>
              <nav className="flex items-center p-2">
                <button
                  className={`h-5 w-5 ${
                    codeRunning ? 'bg-red-500 hover:bg-red-700' : 'bg-red-300'
                  }`}
                  disabled={!codeRunning}
                  onClick={stopCode}
                ></button>
              </nav>
              <nav
                className="flex items-center p-2 text-green-700 cursor-pointer hover:text-green-500"
                onClick={runCode}
              >
                {codeRunning ? (
                  <LoadingIcon height="20" width="20" />
                ) : (
                  <PlayIcon height="20" width="20" />
                )}
              </nav>
            </div>
          </div>
          <div
            className={`${
              displayMode === 'whiteboard' ? 'hidden' : 'block'
            } h-full w-full flex flex-col`}
          >
            <IDE
              options={{
                language: codeContent[codeLanguage].style,
                value: codeContent[codeLanguage].code,
                onChange: (val) => {
                  setCodeContent({
                    ...codeContent,
                    [codeLanguage]: { ...codeContent[codeLanguage], code: val },
                  });
                  debounceEmitCodeContent(val);
                },
              }}
            />
            <Console
              runCode={runCode}
              stopCode={stopCode}
              codeRunning={codeRunning}
              stdinRef={stdinRef}
              output={output}
            />
          </div>
          {/* <div className={`${displayMode === 'ide' && 'hidden'} h-40 w-full`}> */}
          <div
            className={`${
              displayMode === 'ide' ? 'hidden' : 'block'
            } h-full w-full`}
          >
            <Whiteboard mainRef={mainRef} tabRef={tabRef} />
          </div>
          {/* </div> */}
        </main>

        <Cams role={role} />
      </section>
    </>
  );
};

export default InterviewScreen;
