import styles from './Story.module.scss';
import { useState, useEffect } from 'react';
import FirstStory from './stories/FirstStory';
import SecondStory from './stories/SecondStory';
import ThirdStory from './stories/ThirdStory';
import { CSSTransition } from 'react-transition-group';
const numStories = 3;
function Story() {
  const [visibleStory, setVisibleStory] = useState(
    Array(numStories).fill(false)
  );
  const [navigationTimeout, setNavigationTimeout] = useState();
  useEffect(() => {
    setVisibleStory((prev) => {
      const updated = [...prev];
      updated[0] = true;
      return updated;
    });
  }, []);

  return (
    <div className={styles.story}>
      <div className={styles.buttons}>
        <div
          className={styles.button}
          onClick={() => {
            clearTimeout(navigationTimeout);
            const activeIndex = visibleStory.findIndex((v) => v);
            setVisibleStory(Array(numStories).fill(false));
            let prevIndex = activeIndex - 1;
            if (prevIndex < 0) {
              prevIndex = numStories - 1;
            }
            const t = setTimeout(() => {
              setVisibleStory((prev) => {
                const updated = [...prev];
                updated[prevIndex] = true;
                return updated;
              });
            }, 1000);
            setNavigationTimeout(t);
          }}
        >
          <i className="fa fa-angle-left"></i>
        </div>
        <div
          className={styles.button}
          onClick={() => {
            clearTimeout(navigationTimeout);
            const activeIndex = visibleStory.findIndex((v) => v);
            setVisibleStory(Array(numStories).fill(false));
            let nextIndex = activeIndex + 1;
            if (nextIndex >= numStories) {
              nextIndex = 0;
            }
            const t = setTimeout(() => {
              setVisibleStory((prev) => {
                const updated = [...prev];
                updated[nextIndex] = true;
                return updated;
              });
            }, 1000);
            setNavigationTimeout(t);
          }}
        >
          <i className="fa fa-angle-right"></i>
        </div>
      </div>
      {[FirstStory, SecondStory, ThirdStory].map((Story, i) => {
        return (
          <CSSTransition
            classNames={`story`}
            timeout={1000}
            in={visibleStory[i]}
          >
            <div className={[styles.storyChild, 'visibility-hidden'].join(' ')}>
              <Story show={visibleStory[i]} />
            </div>
          </CSSTransition>
        );
      })}
    </div>
  );
}

export default Story;