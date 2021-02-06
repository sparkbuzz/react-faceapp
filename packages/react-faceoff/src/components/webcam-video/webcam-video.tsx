import classNames from 'classnames';
import React, { forwardRef, useEffect } from 'react';
import { useWindowSize } from '../../hooks/use-window-size';

type Props = {
  onReadyStateChange: Function
} & React.HTMLAttributes<HTMLVideoElement>;

const WebcamVideo = forwardRef<HTMLVideoElement, Props>(
  ({ className, onReadyStateChange }, ref) => {
    const innerRef = (ref as React.RefObject<HTMLVideoElement>);
    const { width, height } = useWindowSize();

    useEffect(() => {
      let videoElement: HTMLVideoElement;

      if (onReadyStateChange && innerRef.current) {
        videoElement = innerRef.current;
        const handleLoadedData = (event: Event) => {
          const readyState = (event.target as HTMLVideoElement).readyState;
          return onReadyStateChange(readyState);
        };
        innerRef.current.addEventListener('loadeddata', handleLoadedData);

        return function cleanup () {
          videoElement && videoElement.removeEventListener('loadedData', handleLoadedData);
        }
      }
    }, [innerRef, onReadyStateChange]);

    useEffect(() => {
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode: { ideal: 'user' },
          width,
          height
        }
      };

      navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          if (innerRef?.current) {
            innerRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          if (error.name === 'NotAllowedError') {
            console.log('This app needs permissions to use your camera to run!\n' +
              'Please grant the appropriate permissions and reload this page to see some action.');
          } else {
            console.error(error);
          }
        });
    }, [width, height, innerRef]);

    return (
      <video
        autoPlay
        className={classNames(className)}
        ref={innerRef}
      />
    );
  });

export { WebcamVideo };
