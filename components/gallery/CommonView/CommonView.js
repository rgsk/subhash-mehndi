import styles from './CommonView.module.scss';
import { useState } from 'react';
import CustomImage from '@components/common/CustomImage/CustomImage';
import DesktopImageView from '@components/gallery/DesktopImageView/DesktopImageView';
import { isMobile } from 'react-device-detect';
import MobileImageView from '@components/gallery/MobileImageView/MobileImageView';
function CommonView({ header, description, images }) {
  const [showImageView, setShowImageView] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState();
  const [blockSmoothScroll, setBlockSmoothScroll] = useState(true);
  return (
    <div className={styles.commonView}>
      <div className={styles.imageView}>
        <h1 className={styles.header}>{header}</h1>
        <div className={styles.container}>
          <div className={styles.images}>
            {images.map((src, i) => {
              return (
                <div
                  className={styles.image}
                  onClick={() => {
                    setBlockSmoothScroll(true);
                    setActiveImageIndex(i);
                    setShowImageView(true);
                  }}
                  key={i}
                >
                  <CustomImage src={src} addHoverEffect loading="lazy" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div
        style={{
          display: showImageView ? 'block' : 'none',
        }}
        className={styles.imageOpened}
      >
        {isMobile ? (
          <MobileImageView
            images={images}
            activeImageIndex={activeImageIndex}
            setActiveImageIndex={setActiveImageIndex}
            closeImageView={() => setShowImageView(false)}
            blockSmoothScroll={blockSmoothScroll}
            setBlockSmoothScroll={setBlockSmoothScroll}
          />
        ) : (
          <DesktopImageView
            images={images}
            activeImageIndex={activeImageIndex}
            setActiveImageIndex={setActiveImageIndex}
            closeImageView={() => setShowImageView(false)}
            blockSmoothScroll={blockSmoothScroll}
            setBlockSmoothScroll={setBlockSmoothScroll}
          />
        )}
      </div>
    </div>
  );
}

export default CommonView;