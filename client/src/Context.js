// import React, { createContext, useState, useRef, useEffect } from "react";
// import { io } from "socket.io-client";
// import Peer from "simple-peer";

// const SocketContext = createContext();

// const socket = io("http://localhost:5001");

// const ContextProvider = ({ children }) => {
//     const [callAccepted, setCallAccepted] = useState(false);
//     const [callEnded, setCallEnded] = useState(false);
//     const [stream, setStream] = useState();
//     const [name, setName] = useState('');
//     const [call, setCall] = useState({});
//     const [me, setMe] = useState('');
  
//     const myVideo = useRef();
//     const userVideo = useRef();
//     const connectionRef = useRef();

//   useEffect(() => {
//     //we want to get the permission to use the video and audio camera, microphone
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((currentStream) => {
//         setStream(currentStream);
//         myVideo.current.srcObject = currentStream;
//       });
//     socket.on("me", (id) => setMe(id));
//     socket.on("calluser", ({ from, name: callerName, signal }) => {
//       setCall({ isReceivedCall: true, from, name: callerName, signal });
//     });
//   }, []);

//   const answerCall = () => {
//     setCallAccepted(true);
//     const peer = new Peer({ initiator: false, trickle: false, stream }); //initiator is false because we are the person who is receiving call and answer them

//     peer.on("signal", (data) => {
//       socket.emit("answercall", { signal: data, to: call.from });
//     });
//     peer.on("stream", (currentStream) => {
//       userVideo.current.srcObject = currentStream;
//     });
//     peer.signal(call.signal);
//     connectionRef.current = peer; //means our current connection is equal to our peer connection which is created at line no. 35
//   };

//   const callUser = (id) => {
//     const peer = new Peer({ initiator: true, trickle: false, stream }); //initiator is true because we are the person who is calling
//     peer.on("signal", (data) => {
//       socket.emit("calluser", {
//         userToCall: id,
//         signalData: data,
//         from: me,
//         name,
//       });
//     });
//     peer.on("stream", (currentStream) => {
//       userVideo.current.srcObject = currentStream;
//     });
//     socket.on("callAccepted", (signal) => {
//       setCallAccepted(true);
//       peer.signal(signal);
//     });
//     connectionRef.current = peer;
//   };

//   const leaveCall = () => {
//     setCallEnded(true);
//     connectionRef.current.destroy(); // stop receiving inputs from user camera and audio
//     window.location.reload();
//   };

//   return (
//       <SocketContext.Provider value={{
//         call,
//         callAccepted,
//         myVideo,
//         userVideo,
//         stream,
//         name,
//         setName,
//         callEnded,
//         me,
//         callUser,
//         leaveCall,
//         answerCall,
//       }}>
//           {children}
//       </SocketContext.Provider>
//   )
// };

// export  {ContextProvider,SocketContext}

import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

 const socket = io('http://localhost:5001');
//const socket = io('https://warm-wildwood-81069.herokuapp.com');

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if(myVideo.current){
            myVideo.current.srcObject = currentStream;
        }
    
      });
      

    socket.on('me', (id) => setMe(id));

    socket.on('calluser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);   //initiator is false because we are the person who is receiving call and answer them

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answercall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);       

    connectionRef.current = peer;    //means our current connection is equal to our peer connection which is created at line no. 35
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });  //initiator is true because we are the person who is calling

    peer.on('signal', (data) => {
      socket.emit('calluser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();  // stop receiving inputs from user camera and audio

    window.location.reload();
  };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };