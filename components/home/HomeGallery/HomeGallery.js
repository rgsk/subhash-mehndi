import styles from './HomeGallery.module.scss';
import CustomImage from '@components/common/CustomImage/CustomImage';

import Button from '@components/common/Button/Button';
import Link from 'next/link';
import LeftRightButtons from '@components/common/LeftRightButtons/LeftRightButtons';
import { useState, useEffect, useRef } from 'react';

import { CSSTransition } from 'react-transition-group';
import { Debounce } from '@base/utils';
import { useRouter } from 'next/router';
import { useSwipeable } from 'react-swipeable';
const images = [
  '/images/bridal/bridal-wedding-mehndi-by-subhash-gupta-mehndi-artist8.jpg',
  '/images/bridal/bridal-wedding-mehndi-by-subhash-gupta-mehndi-artist9.jpg',
  '/images/designer/designer-arabic-function-mehndi-by-subhash-gupta-mehndi-artist2.jpg',
  '/images/designer/designer-arabic-function-mehndi-by-subhash-gupta-mehndi-artist10.jpg',
  '/images/churi/churi-bangle-jutti-kade-prandi-stall2.jpg',
  '/images/churi/churi-bangle-jutti-kade-prandi-stall1.jpg',
];
const categoryLinks = [
  '/gallery/bridal-mehndi',
  '/gallery/designer-mehndi',
  '/gallery/bangles-kade-stall',
];
const imageDimension = {
  width: 250,
  height: 250,
};
const delay = 5000;
function HomeGallery() {
  const router = useRouter();
  const [imageBlocks, setImageBlocks] = useState([]);
  const [swipeType, setSwipeType] = useState('');
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [scrollInterval, setScrollInterval] = useState();
  const [scrollTimeout, setScrollTimeout] = useState();
  const intervalRef = useRef();
  let componentMounted = true;
  const windowResizeHandler = useRef(
    new Debounce(() => {
      // console.log('computation actually ran');
      updateImageBlocks();
    }, 500)
  );
  const startAutomaticScroll = () => {
    const i = setInterval(() => {
      console.log('auto next Item');
      nextBlock();
    }, delay);
    intervalRef.current = i;
    setScrollInterval(i);
  };
  const manualControl = () => {
    clearInterval(scrollInterval);
    clearTimeout(scrollTimeout);
    const t = setTimeout(() => {
      // console.log('resumed auto scroll');
      startAutomaticScroll();
    }, delay * 2);
    setScrollTimeout(t);
  };
  const updateImageBlocks = () => {
    // console.log('imageBlocks updated');
    setImageBlocks(() => {
      const smallScreen = window.innerWidth < 900;
      if (smallScreen) {
        return generateNumImagesPerBlock(1);
      } else {
        return generateNumImagesPerBlock(2);
      }
    });
    setActiveBlockIndex(0);
  };
  useEffect(() => {
    updateImageBlocks();
    const cb = () => {
      windowResizeHandler.current.call();
    };
    window.addEventListener('resize', cb);
    startAutomaticScroll();
    return () => {
      // console.log(scrollInterval);
      // console.log(scrollTimeout);
      componentMounted = false;
      window.removeEventListener('resize', cb);
    };
  }, []);
  const nextBlock = () => {
    if (!componentMounted) {
      console.log('clearing interval');
      console.log(scrollInterval);
      console.log(intervalRef.current);
      clearInterval(intervalRef.current);
      return;
    }
    setSwipeType('right');
    setImageBlocks((currentImageBlocks) => {
      setActiveBlockIndex((idx) => {
        if (idx === currentImageBlocks.length - 1) return 0;
        return idx + 1;
      });
      return currentImageBlocks;
    });
  };
  const prevBlock = () => {
    // console.log('prev clicked');
    setSwipeType('left');
    setActiveBlockIndex((idx) => {
      if (idx === 0) {
        return imageBlocks.length - 1;
      }
      return idx - 1;
    });
  };
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      manualControl();
      nextBlock();
    },
    onSwipedRight: () => {
      manualControl();
      prevBlock();
    },
    trackMouse: true,
  });
  return (
    <div className={styles.gallery} {...handlers}>
      <div
        className={[styles.images, 'swipe-home-gallery'].join(' ')}
        style={{
          height: `${imageDimension.height}px`,
        }}
      >
        <div className={styles.buttons}>
          <LeftRightButtons
            leftClick={() => {
              manualControl();
              prevBlock();
            }}
            rightClick={() => {
              manualControl();
              nextBlock();
            }}
            textColor="black"
            borderColor="var(--color-bluegray)"
          />
        </div>

        {imageBlocks.map((block, i) => (
          <div className={styles.block} key={i}>
            {block.map((imageSrc, i) => (
              <CSSTransition
                classNames={`image-${swipeType}`}
                timeout={600}
                in={imageBlocks[activeBlockIndex] === block}
                key={i}
              >
                <div
                  className={[
                    styles.image,
                    swipeType === '' && imageBlocks[activeBlockIndex] === block
                      ? 'display-block'
                      : 'display-none',
                  ].join(' ')}
                  style={{
                    transitionDelay:
                      block.length > 1 && swipeType === 'left'
                        ? i === 0
                          ? '100ms'
                          : '0ms'
                        : i === 1
                        ? '100ms'
                        : '0ms',
                  }}
                  onClick={() => {
                    router.push(categoryLinks[activeBlockIndex]);
                  }}
                >
                  <CustomImage
                    src={imageSrc}
                    width={`${imageDimension.width}px`}
                    height={`${imageDimension.height}px`}
                    addHoverEffect
                    imageQuality={100}
                  />
                </div>
              </CSSTransition>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.button}>
        <Button>
          <Link href="/gallery">
            <a>View Gallery</a>
          </Link>
        </Button>
      </div>
    </div>
  );
  function generateNumImagesPerBlock(num) {
    const result = [];
    let current = [];
    for (let i = 0; i < images.length; i++) {
      if (current.length === num) {
        result.push(current);
        current = [images[i]];
      } else {
        current.push(images[i]);
      }
    }
    if (current.length !== 0) {
      result.push(current);
    }
    return result;
  }
}

export default HomeGallery;
