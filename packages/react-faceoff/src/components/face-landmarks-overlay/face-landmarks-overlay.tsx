import classNames from 'classnames';
import React, { HTMLAttributes, RefObject, useEffect, useRef, useState } from 'react';
import { useFaceLandmarks } from '../../hooks/use-face-landmarks';
import { useWindowSize } from '../../hooks/use-window-size';
import { drawDot } from '../../utils/draw';
import { Emoticon } from '../emoticon';
import styles from './styles.module.scss';
import type { FaceLandmarkPredictions } from './types';

type Props = {
  srcObject: RefObject<HTMLVideoElement>,
  drawPointCloud?: boolean
} & HTMLAttributes<HTMLElement>;

const FaceLandmarksOverlay = ({ className, drawPointCloud, srcObject }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const eyeLRef = useRef<HTMLDivElement>(null);
  const eyeRRef = useRef<HTMLDivElement>(null);

  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [leftIrisPosition, setLeftIrisPosition] = useState({ x: 0, y: 0 });
  const [rightIrisPosition, setRightIrisPosition] = useState({ x: 0, y: 0 });

  const predictions = useFaceLandmarks(srcObject);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (predictions) {
      configureContext();
      if (!context) return;
      clearCanvas();

      const scaleWidth = context.canvas.offsetWidth / (srcObject.current as HTMLVideoElement).videoWidth;
      const scaleHeight = context.canvas.offsetHeight / (srcObject.current as HTMLVideoElement).videoHeight;

      if (drawPointCloud) {
        renderPointCloud(scaleWidth, scaleHeight);
      }
      updateEmoticons(scaleWidth, scaleHeight);
    }

    function clearCanvas () {
      if (!context || !canvasRef) return;
      context.clearRect(0, 0, canvasRef.current?.width || 0, canvasRef.current?.height || 0);
    }

    function updateEmoticons (scaleWidth: number, scaleHeight: number) {
      if (!predictions || !srcObject.current) return;

      const offsetX = (eyeLRef.current?.offsetWidth ?? 0) / 2;
      const offsetY = (eyeRRef.current?.offsetHeight ?? 0) / 2;

      const prediction = predictions[0] as unknown as FaceLandmarkPredictions

      if (prediction.annotations) {
        let [x, y] = prediction.annotations.leftEyeIris[0];
        setLeftIrisPosition({
          x: x * scaleWidth + srcObject.current?.offsetLeft - offsetX,
          y: y * scaleHeight + srcObject.current?.offsetTop - offsetY
        });

        [x, y] = prediction.annotations.rightEyeIris[0];
        setRightIrisPosition({
          x: x * scaleWidth + srcObject.current?.offsetLeft - offsetX,
          y: y * scaleHeight + srcObject.current?.offsetTop - offsetY
        });
      }
    }

    function renderPointCloud (scaleWidth: number, scaleHeight: number) {
      if (!predictions || !context || !srcObject) return;

      context.fillStyle = 'limegreen';

      for (let i = 0; i < predictions.length; i++) {
        const points: number[][] = (predictions[i] as any)?.scaledMesh;

        for (let j = 0; j < points.length; j++) {
          const [x, y] = points[j];
          drawDot(context, x * scaleWidth, y * scaleHeight);
        }
      }
    }

    function configureContext () {
      if (!canvasRef) return;

      const ctx = canvasRef.current?.getContext('2d')
      if (!ctx) {
        throw Error('Attempt to get 2D canvas context failed!');
      }

      ctx.canvas.width = srcObject.current?.offsetWidth ?? 0;
      ctx.canvas.height = srcObject.current?.offsetHeight ?? 0;

      setContext(ctx);
      return ctx;
    }
  }, [context, predictions, srcObject, width, height, eyeLRef, eyeRRef]);

  return <>
    <canvas className={classNames(className, styles.canvas)} ref={canvasRef}/>
    <Emoticon ref={eyeLRef} flip style={{ top: `${leftIrisPosition.y}px`, left: `${leftIrisPosition.x}px` }}/>
    <Emoticon ref={eyeRRef} style={{ top: `${rightIrisPosition.y}px`, left: `${rightIrisPosition.x}px` }}/>
  </>;
};

export { FaceLandmarksOverlay };
