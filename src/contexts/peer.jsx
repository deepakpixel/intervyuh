import React from 'react';
import Peer from 'peerjs';

export const peer = new Peer();

window.peer = peer;

peer.peer.on('open', (id) => console.log('Peer ready, id: ', id));
peer.on('disconnect', () => console.log('Socket disconnected'));

peer.on('connection', (conn) => {
  console.log('Peer connected, data connection setup. Peer id: ', conn.peer);
  conn.on('open', () => {
    console.log('conn open');
  });
  conn.on('data', (data) => {
    console.log(data);
  });
});

export const PeerContext = React.createContext();
