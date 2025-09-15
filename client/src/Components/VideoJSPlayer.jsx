import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoJSPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }

    const videoElement = document.createElement("video-js");
    videoElement.className = "video-js vjs-big-play-centered";
    videoRef.current.appendChild(videoElement);

   
    const player = videojs(videoElement, {
      autoplay: false,
      controls: true,
      fluid: true,
      playbackRates: [0.25,0.5,0.75, 1, 1.25, 1.5, 2],
      sources: [
        {
          src,
          type: src.includes(".m3u8")
            ? "application/x-mpegURL"
            : "video/mp4",
        },
      ],
    });

    playerRef.current = player;


    player.on("loadedmetadata", () => {
      console.log("Metadata loaded, video duration:", player.duration());
    });

    player.on("error", () => {
      console.error("Video.js error:", player.error());
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src]);

  return <div ref={videoRef} style={{ width: "100%", height: "500px" }} />;
};

export default VideoJSPlayer;
