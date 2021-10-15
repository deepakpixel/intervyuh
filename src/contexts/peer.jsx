import React, { useContext } from 'react';
import Peer from 'peerjs';

// const peer = new Peer();
const peer = new Peer(undefined, {
  host: 'localhost',
  port: 3002,
  path: '/peerjs',
});
const PeerContext = React.createContext();

peer.on('open', (id) => console.log('Peer ready, id: ', id));
peer.on('disconnect', () => {
  console.log('peer disconnected');
  if (peer._disconnected) {
    console.log('RECONNECTING PEER after disconnect');
    return peer.reconnect();
  }
});
window.p = peer;
peer.on('error', (err) => {
  if (peer._disconnected) {
    console.log('RECONNECTING PEER', err);
    return peer.reconnect();
  }
  console.log('PEEER ERRRROR', err);
});

peer.on('reconnect', () => console.log('peer reconnected'));
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
