import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './ImageWithPreview.module.scss';

const loadImage = (url) => {
  const image = new Image();
  image.src = url;
  return image.decode();
};

export const ImageWithPreview = ({ image, style, className, ...props }) => {
  const [imageUrl, setImageUrl] = useState(image.miniThumbUrl);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    loadImage(image.url).then(() => {
      setImageUrl(image.url);
      setShowLoader(false);
    });
  }, []);

  const ratio = (image.height / image.width) * 100;

  return (
    <div
      style={{
        backgroundImage: `url("${imageUrl}")`,
        paddingTop: `${ratio}%`,
        width: image.width,
        ...style,
      }}
      className={classNames(styles.image, className)}
      {...props}
    >
      <div className={styles.overlay}>
        {!!showLoader && <div className={styles.loader} />}
      </div>
    </div>
  );
};
