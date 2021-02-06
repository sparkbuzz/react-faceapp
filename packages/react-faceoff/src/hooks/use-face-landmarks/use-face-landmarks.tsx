import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { FaceLandmarksPackage, FaceLandmarksPrediction } from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs-backend-webgl';
import { RefObject, useEffect, useState } from 'react';
import { MediaElementReadyState } from '../../components/webcam-video/enums';

const PREDICTIONS_PER_SECOND = 30;

let intervalId: number | null = null;
let isBusyEstimating: boolean = false;

const useFaceLandmarks = (srcObject: RefObject<HTMLVideoElement>) => {
  const [model, setModel] = useState<FaceLandmarksPackage | null>(null);
  const [predictions, setPredictions] = useState<FaceLandmarksPrediction[]>();

  useEffect(() => {
    if (model || srcObject.current?.readyState !== MediaElementReadyState.HAVE_ENOUGH_DATA) {
      return;
    }

    loadTensorFlowModel();

    function loadTensorFlowModel () {
      faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
        {
          maxFaces: 1
        }
      ).then(model => {
        setModel(model);
      });
    }

    return function cleanup () {
      if (intervalId) window.clearInterval();
    }
  }, [model, srcObject]);

  startInterval();

  async function estimateFaces () {
    if (isBusyEstimating ||
      !srcObject?.current ||
      srcObject.current.readyState !== MediaElementReadyState.HAVE_ENOUGH_DATA) {
      return;
    }

    isBusyEstimating = true;

    const predictions = await model?.estimateFaces({
      input: srcObject.current,
      flipHorizontal: false
    })
    setPredictions(predictions);

    isBusyEstimating = false;
  }

  async function handleInterval () {
    await estimateFaces();
  }

  function startInterval () {
    if (!intervalId && model) {
      intervalId = window.setInterval(handleInterval, 1000 / PREDICTIONS_PER_SECOND);
    }
  }

  return predictions;
}

export { useFaceLandmarks };
