import {useEffect} from 'react';
import './image-overlay.css';

export function ImageOverlay({image, onClose, onNext, onPrevious}) {

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
    <>
      <div className="imageOverlayBackground" style={{ backgroundColor: image.color }} />
      <div className="imageOverlay">
        <div className="imageContainter">
          <img src={image.regularSrc} width="100%" />
        </div>
      </div>
    </>
  );
}
