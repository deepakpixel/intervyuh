import { useRef, useEffect, useCallback, useMemo } from 'react';
import Peer from 'peerjs';
import { useSocket } from '../contexts/socket';
import { useHistory, useParams } from 'react-router';
import ReactDOM from 'react-dom';
import { usePeer } from '../contexts/peer';
import { toast } from 'react-toastify';

const Cams = ({ role }) => {
  const token = useParams().token;
  const socket = useSocket();

  const dateFormat = useMemo(
    () => ({
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }),
    []
  );

  const peer = usePeer();

  let video1Ref = useRef(null);
  let video2Ref = useRef(null);
  let chatContainerRef = useRef(null);
  let messageRef = useRef(null);

  const history = useHistory();
  const getUserMedia = async () => {
    try {
      console.log('peeeeeeeeeeeer', peer);
      let stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      video1Ref.current &&
        !video1Ref.current.srcObject &&
        (video1Ref.current.srcObject = stream);
      // window.video = video1Ref.current;
      // console.log('calling someone ');
      // let call = peer.call('34503e45-a95b-402d-acfd-b2f73a3581d4', stream);
      // call.on('stream', (stream) => {
      //   console.log('streem received of someone');
      //   video2.current.srcObject = stream;
      // });
      // setTimeout(() => {
      //   stream.getAudioTracks()[0].enabled = false;
      //   setTimeout(() => {
      //     stream.getVideoTracks()[0].enabled = false;
      //   }, 2000);
      // }, 3000);
    } catch (err) {
      console.log(err);
    }
  };
  getUserMedia();

  const textareaKeydown = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault();
      sendMessage();
      console.log('sending message');
    }
  };
  const sendMessage = () => {
    if (!messageRef.current.value.trim()) return;
    let payload = {
      type: 'message',
      timestamp: Date.now(),
      message: messageRef.current.value,
      token,
    };
    socket.emit('chat', payload);
    messageRef.current.value = '';
    appendChat(payload);
  };
  const appendChat = useCallback(
    (data) => {
      console.log(data);
      const div = document.createElement('div');
      let isMine = data.token === token;

      if (data.type === 'message') {
        let classNames = `flex ${isMine && 'justify-end'} m-1`.split(' ');
        div.classList.add(...classNames);
        div.innerHTML = `<div class="w-5/6">
      <div class="${isMine ? 'float-right' : 'float-left'} inline-block ${
          isMine ? 'bg-blue-500' : 'bg-green-500'
        } padding text-white py-1 px-2 rounded-2xl break-words">
      <span>
        ${data.message}
      </span>
      <span class="float-right opacity-70 text-xs pt-1 ml-1">
      ${new Date(data.timestamp)
        .toLocaleString('en-IN', dateFormat)
        .toUpperCase()}
      </span>
      </div>`;
      } else if (data.type === 'result') {
        let classNames = `flex ${isMine && 'justify-end'} m-1`.split(' ');
        div.classList.add(...classNames);
        div.innerHTML = `<div class="w-5/6">
      <div class="${
        isMine ? 'float-right' : 'float-left'
      } inline-block bg-white padding py-1 px-2 rounded-2xl break-words">
      <div>
        <p>Here are the results</p>
        <p class="font-semibold">STDIN</p>
        <div class="overflow-auto max-h-20 nice-scrollbar bg-gray-300 rounded p-2 text-sm">
          <pre>${data.result.stdin || ' '}</pre>
        </div>
        <p class="font-semibold">Output</p>
        <div class="overflow-auto max-h-60 nice-scrollbar bg-gray-300 rounded p-2 text-sm">
            <pre>${
              data.result.output === null ? 'null' : data.result.output?.trim()
            }</pre>
        </div>
        <p class="font-semibold">CPU Time</p>
        <div class="overflow-auto nice-scrollbar bg-gray-300 rounded p-2 text-sm">
            <pre>${
              data.result.cpuTime === null ? 'null' : data.result.cpuTime
            }</pre>
        </div>
        <p class="font-semibold">Memory</p>
        <div class="overflow-auto nice-scrollbar bg-gray-300 rounded p-2 text-sm">
            <pre>${
              data.result.memory === null ? 'null' : data.result.memory
            }</pre>
        </div>
      </div>
      </div>`;
      } else {
        let classNames = `text-center text-gray-700 text-sm`.split(' ');
        div.classList.add(...classNames);
        div.innerHTML = `<span>${data.message}</span>
                    <span class="ml-2 text-xs opacity-70">
                      ${new Date(data.timestamp)
                        .toLocaleString('en-IN', dateFormat)
                        .toUpperCase()}
                    </span>`;
      }

      console.log('APPENDING READY on chat container ref', chatContainerRef);
      chatContainerRef.current?.append(div);
      chatContainerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    },
    [dateFormat, token]
  );

  useEffect(() => {
    socket.on('chat', (data) => appendChat(data));
    return () => socket.off('chat');
  }, [socket, appendChat]);

  let stream = useRef(null);
  useEffect(() => {
    (async function () {
      stream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // return socket.off('joined-interview');
    })();

    peer.on('call', (call) => {
      console.log('someone calling', call);
      call.answer(stream.current);

      call.on('stream', (peerStream) => {
        console.log(
          'RECEIVED INTERVIEWER STREAM, PLAYING VIDEO',
          video1Ref,
          video2Ref
        );
        video2Ref.current && (video2Ref.current.srcObject = peerStream);
        // video1Ref.current && (video1Ref.current.srcObject = stream);
      });
    });

    socket.on('joined-interview', async (data) => {
      if (data.role !== 'c' && data.role !== 'i') return;
      console.log('Someone joined', data);
      if (data.role === role) {
        history.go(0);
        toast.error('Joined from another device');
      } else {
        if (data.role === 'c') {
          // make peer call
          console.log('candidate-connected, calling ', data.peerId);
          console.log('Call awaiting', Date.now());
          console.log('peer: INFO', peer);
          let call = peer.call(data.peerId, stream.current);
          console.log('CALL: INFO', call);
          console.log('Call awaited', Date.now());
          call &&
            call.on('stream', (peerStream) => {
              console.log('RECEIVED CANDIDATE STREAM, PLAYING VIDEO');
              video2Ref?.current && (video2Ref.current.srcObject = peerStream);
            });
        }

        if (data.role === 'i') {
          // setTimeout(() => {
          console.log('INTERVIEWER JOINED, LET HIM KNOW I AM JOINED');
          socket.emit('joined-interview', { token, peerId: peer._id });
          // }, 10000);
        }

        console.log('Appending chat', {
          message: 'JOINED' + data.role,
          timestamp: Date.now(),
          role,
        });
        appendChat({
          message: 'JOINED' + data.role,
          timestamp: Date.now(),
        });
      }
    });

    socket.on('left-interview', (data) => {
      if (data.role !== 'c' && data.role !== 'i') return;
      console.log('Someone left', data);
      if (data.role === role) {
        history.go(0);
        toast.error('Joined from another device');
      } else {
        // if (data.role === 'c') {
        // remove peer call
        video2Ref?.current && (video2Ref.current.srcObject = null);
        // }

        console.log('Appending chat', {
          message: 'JOINED' + data.role,
          timestamp: Date.now(),
          role,
        });
        appendChat({
          message: 'LEFT' + data.role,
          timestamp: Date.now(),
        });
      }
    });

    return () => {
      // socket.off('left-interview');
      // socket.off('joined-interview');
      stream.current?.getTracks().forEach((track) => track.stop());
      // peer.off('call');
    };
  }, [socket, history, token, role, appendChat, peer]);

  return (
    <>
      <aside className="border-gray-700 border-l-2 fixed z-10 sm:z-auto sm:static inset-0 sm:inset-auto sm:w-1/3 bg-white">
        <div className="flex flex-col h-full">
          <div>
            <div className="flex flex-col font-bold text-blue-500 px-2 bg-gray-100 shadow-md">
              Video Call
            </div>
            <div className="flex">
              <div className="w-full h-40 bg-gray-700">
                <video
                  className="h-40 w-full object-cover"
                  ref={video1Ref}
                  muted={true}
                  autoPlay
                  src=""
                ></video>
              </div>
              <div className="h-40 w-full bg-gray-700">
                <video
                  className="h-40 w-full object-cover"
                  ref={video2Ref}
                  // REMOVE bwlow line in PROD
                  muted={true}
                  autoPlay
                  src=""
                ></video>
              </div>
            </div>
          </div>
          <div className="bg-gray-300 flex-grow flex flex-col h-full">
            <div className="flex flex-col font-bold text-blue-500 px-2 bg-gray-100 shadow-md">
              Chat
            </div>
            <div className="flex-grow h-0 overflow-auto nice-scrollbar px-2">
              <div
                ref={chatContainerRef}
                className="flex-grow flex flex-col justify-end"
              >
                <div className="flex justify-end m-1">
                  <div className="w-5/6 inline-block bg-green-500 padding text-white py-1 px-2 rounded-2xl break-words">
                    <span>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Error quisquam possimus adipisci quam iure quod fugit,
                      harum et hic nostrum temporibus itaque numquam assumenda
                      quos excepturi sapiente odio enim. Deleniti.
                    </span>
                    <span className="float-right opacity-70 text-xs pt-1">
                      2:00 PM
                    </span>
                  </div>
                </div>
                <div className="flex justify-end m-1">
                  <div className="w-5/6 inline-block bg-white border border-black padding text-white py-1 px-2 rounded-2xl break-words">
                    <div className="text-black">
                      <p>Here are the results</p>
                      <p className="font-semibold">STDIN</p>
                      <div className="overflow-auto max-h-20 nice-scrollbar bg-gray-300 rounded p-2 text-sm">
                        {/* <pre>{stdin || ' '}</pre> */}
                        <pre>stdin || ' '</pre>
                      </div>
                      <p className="font-semibold">Output</p>
                      <div className="overflow-auto max-h-60 nice-scrollbar bg-gray-300 rounded p-2 text-sm">
                        {/* <pre>{output === null ? 'null' : output?.trim()}</pre> */}
                        <pre>output === null ? 'null' : output?.trim()</pre>
                      </div>
                      <p className="font-semibold">CPU Time</p>
                      <div className="overflow-auto nice-scrollbar bg-gray-300 rounded p-2 text-sm">
                        {/* <pre>{cpuTime === null ? 'null' : cpuTime}</pre> */}
                        <pre>cpuTime =/== null ? 'null' : cpuTime</pre>
                      </div>
                      <p className="font-semibold">Memory</p>
                      <div className="overflow-auto nice-scrollbar bg-gray-300 rounded p-2 text-sm">
                        {/* <pre>{memory === null ? 'null' : memory}</pre> */}
                        <pre>memory === null ? 'null' : memory</pre>
                      </div>
                    </div>
                    <span className="float-right opacity-70 text-xs pt-1">
                      2:00 PM
                    </span>
                  </div>
                </div>
                <div className="flex justify-end m-1">
                  <div className="w-5/6">
                    <div className="float-right inline-block bg-green-500 padding text-white py-1 px-2 rounded-2xl break-words">
                      <span>Hi</span>
                      <span className="float-right opacity-70 text-xs pt-1 pl-2">
                        2:00 PM
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-start m-1">
                  <div className="w-5/6">
                    <div className="float-left inline-block bg-green-500 padding text-white py-1 px-2 rounded-2xl break-words">
                      <span>Hi</span>
                      <span className="float-right opacity-70 text-xs pt-1 pl-2">
                        2:00 PM
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-5/6 m-1">
                  <span className="inline-block bg-blue-500 padding text-white py-1 px-2 rounded-2xl break-words">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Error quisquam possimus adipisci quam iure quod fugit, harum
                    et hic nostrum temporibus itaque numquam assumenda quos
                    excepturi sapiente odio enim. Deleniti.
                  </span>
                </div>

                <div className="text-center text-gray-700 text-sm m-1">
                  <span>Your chat starts from here</span>{' '}
                  <span className="text-xs opacity-70">
                    {new Date()
                      .toLocaleString('en-IN', dateFormat)
                      .toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-2 bg-gray-100 py-2 flex justify-between items-end shadow-md">
              <textarea
                ref={messageRef}
                rows="1"
                className="flex-grow border rounded-full border-blue-500 py-1 px-2 mx-2 outline-none focus:ring resize-none no-scrollbar"
                placeholder="Your message here..."
                type="text"
                onKeyDown={textareaKeydown}
              ></textarea>
              <button
                onClick={sendMessage}
                className="bg-blue-500 hover:bg-blue-700 rounded-full py-1 px-4 text-white"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Cams;
