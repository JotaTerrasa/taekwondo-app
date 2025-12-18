import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaPlayButton,
  MediaMuteButton,
  MediaPlaybackRateButton,
} from "media-chrome/react";
import { useRef } from "react";

const SimplePlayer = () => {
  const mediaControllerRef = useRef(null);

  const movementTimestamps = [0, 2.4, 4, 6.5, 9, 12, 15]; // cambiar por el json
  const currentMovementRef = useRef(0);

  const goToMovement = (direction) => {
    if (!mediaControllerRef.current) return;

    const videoElement = mediaControllerRef.current.querySelector("video");
    if (!videoElement) return;

    if (direction === "next") {
      currentMovementRef.current = Math.min(
        currentMovementRef.current + 1,
        movementTimestamps.length - 1
      );
    } else {
      currentMovementRef.current = Math.max(currentMovementRef.current - 1, 0);
    }

    videoElement.currentTime = movementTimestamps[currentMovementRef.current];
  };

  return (
    <>
      <MediaController ref={mediaControllerRef}>
        <video slot="media" src="/videos/won-hyo.mp4" preload="auto">
          <track default kind="chapters" src="/chapters/won-hyo.vtt" />
        </video>
        <MediaControlBar>
          <MediaPlayButton></MediaPlayButton>
          <MediaTimeRange></MediaTimeRange>
          <MediaTimeDisplay showDuration></MediaTimeDisplay>
          <MediaPlaybackRateButton></MediaPlaybackRateButton>
          <MediaMuteButton></MediaMuteButton>
        </MediaControlBar>
      </MediaController>
      <button onClick={() => goToMovement("prev")}>Anterior movimiento</button>
      <p>Won hyo - Movimiento {currentMovementRef.current + 1}</p>
      <button onClick={() => goToMovement("next")}>Siguiente movimiento</button>
    </>
  );
};

export default SimplePlayer;
