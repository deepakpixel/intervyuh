import React, { useContext } from 'react';
import socketio from 'socket.io-client';

const SocketContext = React.createContext();
const socket = socketio.connect(process.env.REACT_APP_SOCKET_URL);

socket.on('connect', () => console.log('Socket connected'));
socket.on('disconnect', () => console.log('Socket disconnected'));

var startTime, latency;
setInterval(function () {
  startTime = Date.now();
  socket.emit('ping');
}, 2000);

socket.on('pong', function () {
  latency = Date.now() - startTime;
  console.log('PONG', latency);
});

const useSocket = () => useContext(SocketContext);

// socket.on('candidate-joined',data=>makeCall())

const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
export { useSocket };
