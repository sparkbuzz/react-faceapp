import React, { useRef, useState } from 'react';
import { FaceLandmarksOverlay } from '../components/face-landmarks-overlay';
import { WebcamVideo } from '../components/webcam-video';
import { MediaElementReadyState } from '../components/webcam-video/enums';
import styles from './styles.module.scss';

const App = () => {
  const ref = useRef<HTMLVideoElement>(null);
  const [videoIsReady, setVideoIsReady] = useState<boolean>(false);

  const handleReadyStateChange = (readyState: MediaElementReadyState) => {
    setVideoIsReady(readyState === MediaElementReadyState.HAVE_ENOUGH_DATA);
  };

  return (
    <div className={styles.wrapper}>
      <WebcamVideo
        ref={ref}
        className={styles.cover}
        onReadyStateChange={handleReadyStateChange}
      />
      {videoIsReady && <FaceLandmarksOverlay drawPointCloud={false} srcObject={ref}/>}
    </div>
  );
};

export { App };
