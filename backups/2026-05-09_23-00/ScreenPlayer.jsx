import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import QRCodeStyling from "qr-code-styling";

import americanaBadge from "../assets/badge-vibes/americana.png";
import rockBadge from "../assets/badge-vibes/rock.png";
import bluesBadge from "../assets/badge-vibes/blues.png";
import hiphopBadge from "../assets/badge-vibes/rap.png";
import folkBadge from "../assets/badge-vibes/folk:acoustic.png";
import punkBadge from "../assets/badge-vibes/punk:grunge.png";
import popBadge from "../assets/badge-vibes/pop.png";
import heavyMetalBadge from "../assets/badge-vibes/heavymetal.png";

export default function ScreenPlayer() {

  const badgeAssets = {
  americana: americanaBadge,
  rock: rockBadge,
  blues: bluesBadge,
  hiphop: hiphopBadge,
  folk: folkBadge,
  punk: punkBadge,
  pop: popBadge,
  heavymetal: heavyMetalBadge,
};
  const videoRef = useRef(null);
  const qrMountRef = useRef(null);
  const { eventCode = "TEST" } = useParams();
  const location = useLocation();

  const [countdown, setCountdown] = useState(10);
  const [showVideo, setShowVideo] = useState(false);

  const videoUrl =
    new URLSearchParams(location.search).get("videoUrl") ||
    location.state?.videoUrl;
  const badgeConfig = useMemo(() => {
    try {
      const saved = localStorage.getItem("codenxt_badge_config");
      return saved ? JSON.parse(saved) : { template: "americana" };
    } catch {
      return { template: "americana" };
    }
  }, []);

  const activeBadge = badgeAssets[badgeConfig.template] || americanaBadge;

  const joinUrl = `${window.location.origin}/join/${encodeURIComponent(eventCode)}?lang=en`;
    useEffect(() => {
    if (!qrMountRef.current) return;

    qrMountRef.current.innerHTML = "";

    const qr = new QRCodeStyling({
      width: 220,
      height: 220,
      type: "svg",
      data: joinUrl,
      margin: 0,

      qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: "H",
      },

      dotsOptions: {
        color: "#000000",
        type: "square",
      },

      cornersSquareOptions: {
        color: "#000000",
        type: "square",
      },

      cornersDotOptions: {
        color: "#000000",
        type: "square",
      },

      backgroundOptions: {
        color: "#F2EBDC",
      },
    });

    qr.append(qrMountRef.current);
  }, [joinUrl]);
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
<div style={styles.screenBadgeWrap}>
  <img src={activeBadge} alt="Selected badge" style={styles.screenBadgeImage} />

  <div style={styles.screenQrBox}>
    <div ref={qrMountRef} style={styles.screenQrMount} />
  </div>

  <div style={styles.countdownBadgeNumber}>{countdown}</div>
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
    screenBadgeWrap: {
    position: "relative",
    width: "58vmin",
    height: "58vmin",
  },

  screenBadgeImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
  },

  screenQrBox: {
    position: "absolute",
    left: "50%",
    top: "51%",
    width: "29%",
    height: "29%",
    transform: "translate(-50%, -50%)",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  screenQrMount: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  countdownBadgeNumber: {
    position: "absolute",
    right: "-42px",
    bottom: "-24px",
    color: "#ffffff",
    fontSize: "96px",
    fontWeight: "900",
    textShadow: "0 0 24px rgba(0,240,255,0.65)",
  },
  video: {
    width: "100vw",
    height: "100vh",
    objectFit: "cover",
    background: "black",
  },
};