import styles from './MobileImageView.module.scss';
import { useSwipeable } from 'react-swipeable';
import { useContext, useState, useEffect } from 'react';
import { GlobalStateContext } from '@state/GlobalStateProvider';
import { CSSTransition } from 'react-transition-group';
import CustomImage from '@components/common/CustomImage/CustomImage';
import { useRouter } from 'next/router';

function MobileImageView({
  images,
  alt = 'mehndi design',
  activeImageIndex,
  setActiveImageIndex,
  closeImageView,
  blockSmoothScroll,
  setBlockSmoothScroll,
  parentRoute,
  show,
}) {
  const { swipeUsed, setSwipeUsed } = useContext(GlobalStateContext);
  const [showSwipe, setShowSwipe] = useState(!swipeUsed);

  const [swipeType, setSwipeType] = useState('left');
  const [imageLoadingSpeeds, setImageLoadingSpeeds] = useState(() => {
    const arr = Array(images.length).fill('lazy');
    arr[0] = 'eager';
    return arr;
  });
  const router = useRouter();
  useEffect(() => {
    let goToParent = () => {
      router.push(parentRoute);
      window.removeEventListener('popstate', goToParent);
    };
    if (show) window.addEventListener('popstate', goToParent);
  }, [show]);
  const prevBlock = () => {
    setSwipeType('right');
    setActiveImageIndex((prevActive) => {
      if (prevActive === 0) {
        return images.length - 1;
      }
      return prevActive - 1;
    });
  };
  const nextBlock = () => {
    setSwipeType('left');
    setActiveImageIndex((prevActive) => {
      if (prevActive === images.length - 1) {
        return 0;
      }
      return prevActive + 1;
    });
  };
  const handlers = useSwipeable({
    onSwipedLeft: (e) => {
      // to prevent tab change

      nextBlock();
    },
    onSwipedRight: (e) => {
      prevBlock();
    },
    onSwiped: (e) => {
      if (!swipeUsed) {
        setSwipeUsed(true);
        setTimeout(() => {
          setShowSwipe(false);
          // we want to hide the swipe after animation is over
          // 600ms delay, 600ms animaation (gone)
        }, 1200);
      }
    },
    // trackMouse: true,
  });
  useEffect(() => {
    setImageLoadingSpeeds((speeds) => {
      const updatedSpeeds = [...speeds];
      updatedSpeeds[activeImageIndex] = 'eager';
      if (activeImageIndex + 1 < speeds.length)
        updatedSpeeds[activeImageIndex + 1] = 'eager';
      if (activeImageIndex - 1 >= 0)
        updatedSpeeds[activeImageIndex - 1] = 'eager';

      // console.log(updatedSpeeds);
      return updatedSpeeds;
    });
  }, [activeImageIndex]);

  useEffect(() => {
    if (blockSmoothScroll) {
      setSwipeType('');
      setBlockSmoothScroll(false);
    }
  }, [blockSmoothScroll]);

  return (
    <div className={styles.mobileImageView}>
      <div className={styles.back} onClick={closeImageView}>
        <i className="fa fa-arrow-left" aria-hidden="true"></i>
      </div>
      <div className={styles.images} {...handlers}>
        {images.map((src, i) => (
          <CSSTransition
            classNames={`swipe-image-${swipeType}`}
            timeout={300}
            in={i === activeImageIndex}
            key={i}
          >
            <div
              className={[
                styles.image,
                swipeType === '' && i === activeImageIndex
                  ? 'display-block'
                  : 'display-none',
              ].join(' ')}
            >
              <CustomImage
                src={src}
                alt={alt}
                height="80vh"
                width="95vw"
                imageFit="contain"
                imageQuality={100}
                loading={imageLoadingSpeeds[i]}
              />
            </div>
          </CSSTransition>
        ))}
      </div>

      {showSwipe && (
        <div
          className={[
            styles.swipeHint,
            !swipeUsed ? styles.swipeAnimationShow : styles.swipeAnimationGone,
          ].join(' ')}
        >
          <i className="fa fa-angle-right" aria-hidden="true"></i>
          <i className="fa fa-angle-right" aria-hidden="true"></i>
          <i className="fa fa-angle-right" aria-hidden="true"></i> swipe
        </div>
      )}
    </div>
  );
}

export default MobileImageView;
