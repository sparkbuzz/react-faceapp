import React, { useEffect, useRef } from 'react';
import { useWindowSize } from '../hooks/use-window-size';

const VideoCanvas = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const constraints: MediaStreamConstraints = {
      audio: false,
      video: { width, height }
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        if (videoRef?.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        console.error('You can\'t have dessert unless you finish your vegetables!');
      })
  }, [width, height]);

  return (
    <video ref={videoRef} autoPlay/>
  );
};

export { VideoCanvas };
