import classNames from 'classnames';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { useFaceLandmarks } from '../../hooks/use-face-landmarks';
import { useWindowSize } from '../../hooks/use-window-size';
import { drawDot } from '../../utils/draw';
import styles from './styles.module.scss';

type Props = {
  srcObject: RefObject<HTMLVideoElement>
} & React.HTMLAttributes<HTMLElement>;

const FaceLandmarksOverlay = ({ className, srcObject }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const predictions = useFaceLandmarks(srcObject);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (predictions) {
      configureContext();
      if (!context) return;
      clearCanvas();
      drawPointCloud();
    }

    function clearCanvas () {
      if (!context || !canvasRef) return;
      context.clearRect(0, 0, canvasRef.current?.width || 0, canvasRef.current?.height || 0);
    }

    function drawPointCloud () {
      if (!predictions || !context || !srcObject) return;

      context.fillStyle = 'limegreen';
      const scaleWidth = context.canvas.offsetWidth / (srcObject.current as HTMLVideoElement).videoWidth;
      const scaleHeight = context.canvas.offsetHeight / (srcObject.current as HTMLVideoElement).videoHeight;

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
  }, [context, predictions, srcObject, width, height]);

  return (
    <canvas
      className={classNames(className, styles.canvas)}
      ref={canvasRef}
    />
  );
};

export { FaceLandmarksOverlay };
