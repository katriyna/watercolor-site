import {useCallback, useEffect} from 'react';
import './image-overlay.css';

export function ImageOverlay({image, onClose, onNext, onPrevious}) {
  const onClick = useCallback((evt) => {
    if (evt.target.tagName.toLowerCase() !== 'img') {
      evt.preventDefault();
      evt.stopPropagation();
      onClose();
    }
  }, [onClose]);

  const onClickNext = useCallback((evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    onNext();
  }, [onNext]);

  const onClickPrev = useCallback((evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    onPrevious();
  }, [onPrevious]);

  useEffect(() => {
        window.addEventListener('keydown', onKeyDown);
        return () => {
          window.removeEventListener('keydown', onKeyDown);
        }

        function onKeyDown(evt) {
          if (evt.key === 'Escape') {
            evt.preventDefault();
            onClose();
          } else if (evt.key === 'ArrowRight') {
            evt.preventDefault();
            onNext();
          } else if (evt.key === 'ArrowLeft') {
            evt.preventDefault();
            onPrevious();
          }
        }
    },
  [onClose, onNext, onPrevious]
  );

  return (
    <div onClick={onClick}>
      <div className="imageOverlayBackground" style={{ backgroundColor: image.color }} />
      <div className="imageOverlay">
        <div className="imageContainter">
          <img src={image.regularSrc} width="100%" />
          <svg
            onClick={onClickPrev}
            className="leftArrow"
            width="100"
            height="100"
            viewBox="0 0 100 100"
            aria-label="Equilateral triangle"
            role="img"
          >
            <polygon points="50,5 95,86.6 5,86.6" fill={image.color} stroke="white" />
          </svg>
          <svg
            onClick={onClickNext}
            className="rightArrow"
            width="100"
            height="100"
            viewBox="0 0 100 100"
            aria-label="Equilateral triangle"
            role="img"
          >
            <polygon points="50,5 95,86.6 5,86.6" fill={image.color} stroke="white" />
          </svg>
        </div>
      </div>
    </div>
  );
}
