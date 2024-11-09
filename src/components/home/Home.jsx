import React, { useRef, useState, useEffect } from 'react';
import './home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const headerRef = useRef(null); // Ref to apply animation to header
  const cardsRef = useRef([]); // Ref to apply animation to each card

  const [showCards, setShowCards] = useState(false);

  // Navigate to the join page
  const goToJoinPage = () => {
    navigate('/join');
  };

  useEffect(() => {
    // Adding the "show" class to the header after 500ms for animation
    setTimeout(() => {
      if (headerRef.current) {
        headerRef.current.classList.add('show');
      }
    }, 500);

    // Adding "show" class to the cards after the header appears (staggered)
    setTimeout(() => {
      setShowCards(true);
    }, 1000); // Delay to start animation after header
    
  }, []);

  useEffect(() => {
    if (showCards) {
      // Add show class to each card with staggered delay for animation
      cardsRef.current.forEach((card, index) => {
        setTimeout(() => {
          if (card) {
            card.classList.add('show');
          }
        }, index * 300); // Staggered animation (300ms delay between each)
      });
    }
  }, [showCards]);

  return (
    <>
      <header className="Home_header" ref={headerRef}>
        <div className="logo">
          <h1>Social Media Application</h1>
        </div>
        <div className="btns">
          <button onClick={goToJoinPage}>JOIN US</button>
        </div>
      </header>

      <div className="Home_main">
        <div className="learn-cards">
          <div className="learn-card" ref={(el) => (cardsRef.current[0] = el)}>
            <img
              src="https://i.ibb.co/sWmkY3p/Socail-Media-Application.png"
              alt="Graphic showing how the app facilitates easy communication"
              onError={(e) => (e.target.src = 'fallback-image-url.jpg')} // fallback for broken images
            />
            <h2>1- Our Application Is Used To Make Communication Easy In The World</h2>
          </div>

          <div className="learn-card" ref={(el) => (cardsRef.current[1] = el)}>
            <img
              src="https://i.ibb.co/VBBwmXP/Opera-Snapshot-2024-11-09-202157-localhost.png"
              alt="Illustration showing people making friends through the app"
              onError={(e) => (e.target.src = 'fallback-image-url.jpg')}
            />
            <h2>2- You Can Make New Friends In Our Application</h2>
          </div>

          <div className="learn-card" ref={(el) => (cardsRef.current[2] = el)}>
            <img
              src="https://i.ibb.co/WBXscZt/Opera-Snapshot-2024-11-09-203057-localhost.png"
              alt="Chat feature of the app allowing communication with friends"
              onError={(e) => (e.target.src = 'fallback-image-url.jpg')}
            />
            <h2>3- You Can Chat With New Friends Too In Our Application</h2>
          </div>

          <div className="learn-card" ref={(el) => (cardsRef.current[3] = el)}>
            <img
              src="https://i.ibb.co/YDW44qC/Opera-Snapshot-2024-11-09-203405-localhost.png"
              alt="Post feature in the app allowing users to share content"
              onError={(e) => (e.target.src = 'fallback-image-url.jpg')}
            />
            <h2>4- You Can Add Posts To Your Account, Making Your Content Visible</h2>
          </div>

          <div className="learn-card" ref={(el) => (cardsRef.current[4] = el)}>
            <img
              src="https://i.ibb.co/HpkKVxC/Opera-Snapshot-2024-11-09-203606-localhost.png"
              alt="Meeting feature in the app enabling users to meet friends"
              onError={(e) => (e.target.src = 'fallback-image-url.jpg')}
            />
            <h2>5- You Can Add Meetings With Friends To See Them And Chat</h2>
          </div>

          <div className="learn-card" ref={(el) => (cardsRef.current[5] = el)}>
            <img
              src="https://i.ibb.co/sWmkY3p/Socail-Media-Application.png"
              alt="Join the app now"
              onError={(e) => (e.target.src = 'fallback-image-url.jpg')}
            />
            <h2>6- Now, Please Join Us 👍👍</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
