import { io } from 'socket.io-client';

let socket = null;

export function connectSocket(url) {
  if (socket) {
    socket.disconnect();
  }
  socket = io(url);
  return socket;
}

export function getSocket() {
  return socket;
}