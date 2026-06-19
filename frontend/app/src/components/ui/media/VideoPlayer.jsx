import React, { useRef, useEffect, useState } from "react";

const VideoPlayer = (props) => {
  const [subtitleUrl, setSubtitleUrl] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (props.sub === 1) {
      setSubtitleUrl(props.url.slice(0, -4) + ".vtt");
    }
    videoRef.current.src = props.url;
    videoRef.current.load();
    videoRef.current.play();
  }, [subtitleUrl, props.url, props.sub]);

  return (
    <div>
      <video ref={videoRef} controls>
        <source src={props.url} />
        {subtitleUrl ? (
          <track
            src={subtitleUrl}
            kind="subtitles"
            srcLang="ko"
            label="Korean"
            default
          />
        ) : null}
      </video>
    </div>
  );
};

export default VideoPlayer;
