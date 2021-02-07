import React, { forwardRef, HTMLAttributes, useEffect } from 'react';
import styles from './styles.module.scss';

type Props = {
  flip?: boolean
} & HTMLAttributes<HTMLDivElement>;

const Emoticon = forwardRef(
  ({ flip, style }: Props, forwardRef) => {
    const ref = (forwardRef as React.RefObject<HTMLDivElement>);

    useEffect(() => {
      if (ref.current) {
        const obj = { text: `&#128065;` };
        ref.current.innerHTML = JSON.parse(`"${obj.text}"`);
      }
    }, [ref]);

    if (!style) style = {};
    if (flip) style.transform = 'scaleX(-1)';

    return <div style={style} className={styles.emoticon} ref={ref}/>;
  }
);

export { Emoticon };
