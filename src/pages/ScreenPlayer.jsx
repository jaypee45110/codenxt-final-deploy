import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ScreenPlayer() {
  const videoRef = useRef(null);
  const location = useLocation();

  const [countdown, setCountdown] = useState(10);
  const [showVideo, setShowVideo] = useState(false);

  const videoUrl =
    new URLSearchParams(location.search).get("videoUrl") ||
    location.state?.videoUrl;

  useEffect(() => {
    if (!videoUrl) return;

    let timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowVideo(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [videoUrl]);

  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [showVideo]);

  if (!videoUrl) {
    return (
      <div style={styles.container}>
        No video
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {!showVideo ? (
        <div style={styles.countdown}>
          {countdown}
        </div>
      ) : (
        <video
          ref={videoRef}
          src={videoUrl}
          style={styles.video}
          autoPlay
          muted
          loop
          playsInline
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    background: "black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  countdown: {
    color: "white",
    fontSize: "140px",
    fontWeight: "bold",
  },
  video: {
    width: "100vw",
    height: "100vh",
    objectFit: "cover",
    background: "black",
  },
};