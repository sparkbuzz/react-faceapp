import React from 'react';
import { VideoCanvas } from '../video-canvas';
import styles from './styles.module.scss';

const App = () => (
  <div className={styles.wrapper}>
    <VideoCanvas className={styles.video} />
  </div>
);

export { App };
