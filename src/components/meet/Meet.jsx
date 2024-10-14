import React, { useEffect, useState } from "react";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "./API";
import ReactPlayer from "react-player";
import axios from "axios";
import "./meet.css"; // Import the CSS styles

function JoinScreen({ getMeetingAndToken }) {
  const [meetingId, setMeetingId] = useState("");

  const onClick = async () => {
    if (!meetingId) {
      alert("Please enter a Meeting ID");
      return;
    }
    await getMeetingAndToken(meetingId);
  };

  return (
    <div className="join-screen">
        <div className="sc">
        <div className="join">
      <input
        type="text"
        placeholder="Enter Meeting Id"
        onChange={(e) => setMeetingId(e.target.value)}
        />
      <button onClick={onClick}>Join</button>
        </div>
    <div className="create">
      <button onClick={() => getMeetingAndToken(null)}>Create Meeting</button>
    </div>
        </div>
    </div>
  );
}

function ParticipantView({ participantId }) {
  const micRef = React.useRef(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);

  const videoStream = React.useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  React.useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);
        micRef.current.srcObject = mediaStream;
        micRef.current.play().catch((err) => console.error(err));
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div className="participant-view">
      <p>
        Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
        {micOn ? "ON" : "OFF"}
      </p>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      <div className="div-cam">
      {webcamOn && (
          <ReactPlayer
          url={videoStream}
          playing
          playsinline
          className="react-player"
          height="50%"
          />
        )}
        </div>
    </div>
  );
}

function Controls() {
  const { leave, toggleMic, toggleWebcam } = useMeeting();

  const handleToggleMic = () => {
    console.log("Toggling Mic");
    toggleMic();
  };

  const handleToggleWebcam = () => {
    console.log("Toggling Webcam");
    toggleWebcam();
  };

  return (
    <div className="controls">
      <button className="leave" onClick={leave}>Leave</button>
      <button onClick={handleToggleMic}>Toggle Mic</button>
      <button onClick={handleToggleWebcam}>Toggle Webcam</button>
    </div>
  );
}

function MeetingView({ meetingId, onMeetingLeave }) {
  const [joined, setJoined] = useState(null);
  const { join, participants } = useMeeting({
    onMeetingJoined: () => setJoined("JOINED"),
    onMeetingLeft: onMeetingLeave,
  });

  const joinMeeting = async () => {
    setJoined("JOINING");
    try {
      await join();
      console.log("Joined meeting successfully");
    } catch (error) {
      console.error("Failed to join meeting:", error);
      alert("Failed to join meeting: " + error.message); // Show user-friendly error message
      setJoined(null); // Reset joined state on error
    }
  };

  return (
    <div className="meeting-view">
      <h3>Meeting Id: {meetingId}</h3>
      {joined === "JOINED" ? (
        <div>
          <Controls />
          <div className="participant-grid">
            {[...participants.keys()].map((participantId) => (
              <ParticipantView participantId={participantId} key={participantId} />
            ))}
          </div>
        </div>
      ) : joined === "JOINING" ? (
        <p className="joining-status">Joining the meeting...</p>
      ) : (
        <button onClick={joinMeeting}>Join</button>
      )}
    </div>
  );
}

const Meet = () => {
  const [meetingId, setMeetingId] = useState(null);
  const [user, setUser] = useState(null);

  const getMeetingAndToken = async (id) => {
    let meetingId;
    try {
      meetingId = id == null ? await createMeeting({ token: authToken }) : id;
      console.log("Meeting ID set:", meetingId);
    } catch (error) {
      console.error("Error getting meeting and token:", error);
      return; // Exit early on error
    }
    setMeetingId(meetingId);
  };

  const onMeetingLeave = () => setMeetingId(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://social-media-back-end-gamma.vercel.app/usersettings/users/${window.localStorage.getItem("Id")}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  return authToken && meetingId ? (
    <MeetingProvider
      config={{
          meetingId,
          micEnabled: true,
          webcamEnabled: true,
          name: user?.name || "Guest",
        }}
         // Use optional chaining to avoid errors if user is null
        token={authToken}
        >
      <MeetingView meetingId={meetingId}  onMeetingLeave={onMeetingLeave} />
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
};

export default Meet;
