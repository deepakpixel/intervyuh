import React, { useContext } from 'react';
import Peer from 'peerjs';

const peer = new Peer();
const PeerContext = React.createContext();

peer.on('open', (id) => console.log('Peer ready, id: ', id));
peer.on('disconnect', () => console.log('peer disconnected'));

// peer.on('connection', (conn) => {
//   console.log('Peer connected, data connection setup. Peer id: ', conn.peer);
//   conn.on('open', () => {
//     console.log('conn open');
//   });
//   conn.on('data', (data) => {
//     console.log(data);
//   });
// });

const usePeer = () => useContext(PeerContext);

// socket.on('candidate-joined',data=>makeCall())

const PeerProvider = ({ children }) => {
  return <PeerContext.Provider value={peer}>{children}</PeerContext.Provider>;
};

export default PeerProvider;
export { usePeer };
