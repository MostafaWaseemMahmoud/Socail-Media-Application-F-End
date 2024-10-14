import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

// Replace with your backend server URL
const SOCKET_SERVER_URL = 'https://social-media-back-end-gamma.vercel.app'; // Or 3000 if running on the same port

const VideoCall = () => {
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomId = "room-123"; // Replace with dynamic room ID if needed

  useEffect(() => {
    // Get media stream from user (audio & video)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      userVideo.current.srcObject = stream;

      // Connect to the signaling server
      socketRef.current = io(SOCKET_SERVER_URL);
      
      // Join a specific room
      socketRef.current.emit('join-room', roomId);

      // Handle new users joining the room
      socketRef.current.on('user-connected', userId => {
        const peer = createPeer(userId, socketRef.current.id, stream);
        peersRef.current.push({ peerID: userId, peer });
        setPeers(users => [...users, peer]);
      });

      // Handle receiving a signal from a user
      socketRef.current.on('signal', ({ from, signal }) => {
        const item = peersRef.current.find(p => p.peerID === from);
        if (item) {
          item.peer.signal(signal);
        }
      });

      // Handle user disconnection
      socketRef.current.on('user-disconnected', userId => {
        const peerObj = peersRef.current.find(p => p.peerID === userId);
        if (peerObj) {
          peerObj.peer.destroy();
        }
        peersRef.current = peersRef.current.filter(p => p.peerID !== userId);
        setPeers(peers => peers.filter(p => p.peerID !== userId));
      });
    });
  }, []);

  // Create a peer connection
  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', signal => {
      socketRef.current.emit('signal', { to: userToSignal, from: callerID, signal });
    });

    return peer;
  }

  return (
    <div>
      <video ref={userVideo} autoPlay playsInline muted />
      {peers.map((peer, index) => {
        return <Video key={index} peer={peer} />;
      })}
    </div>
  );
};

// Video component to render remote peer's video stream
const Video = ({ peer }) => {
  const ref = useRef();

  useEffect(() => {
    peer.on('stream', stream => {
      ref.current.srcObject = stream;
    });
  }, [peer]);

  return <video ref={ref} autoPlay playsInline />;
};

export default VideoCall;
