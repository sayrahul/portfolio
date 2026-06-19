import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import './CustomPlayer.css';

export default function CustomPlayer({ videoSrc, posterSrc }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => console.log("Play interrupted: ", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgress = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration || 1;
      const current = videoRef.current.currentTime;
      setProgress((current / duration) * 100);
    }
  };

  const handleProgressBarClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = pos * videoRef.current.duration;
      setProgress(pos * 100);
    }
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) { /* Safari */
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) { /* IE11 */
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleEnded = () => setIsPlaying(false);
      video.addEventListener('ended', handleEnded);
      return () => {
        if (video) video.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  return (
    <div className="custom-player-wrapper" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        className="custom-video-element"
        onTimeUpdate={handleProgress}
        playsInline
      />

      {/* Large Center Play Overlay */}
      {!isPlaying && (
        <div className="play-overlay">
          <button className="play-overlay-button" aria-label="Play video">
            <Play size={28} fill="currentColor" />
          </button>
        </div>
      )}

      {/* Control Bar */}
      <div className="controls-bar" onClick={(e) => e.stopPropagation()}>
        {/* Progress Bar */}
        <div className="progress-container" onClick={handleProgressBarClick}>
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Buttons Row */}
        <div className="controls-row">
          <div className="controls-left">
            <button className="control-btn" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>
            <button className="control-btn" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
          <div className="controls-right">
            <button className="control-btn" onClick={toggleFullscreen} aria-label="Fullscreen">
              <Maximize2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
