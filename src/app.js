import {useCallback, useEffect, useMemo, useState} from 'react';

import {ImageOverlay} from './components/image-overlay/image-overlay';
import {loadImages} from './components/api/api';
import './app.css';

function App() {
  const [images, setImages] = useState([]);

  const imagesGrid = useMemo(() => {
    const perRow = 9;
    const grid = [];
    for (let i = 0; i < images.length; i += perRow) {
      grid.push(images.slice(i, Math.min(i + perRow, 28)));
    }
    return grid;
  }, [images]);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        const list = await loadImages();
        if (!isCancelled) {
          setImages(list);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }

    load();
    return () => { isCancelled = true; };
  }, []);

  const [selectedImage, setSelectedImage] = useState(null);

  const onOverlayClose = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const onOverlayNext = useCallback(() => {
    if (selectedImage) {
      const nextImageIndex = (images.findLastIndex(it => it.id === selectedImage.id) || 0) + 1;
      setSelectedImage(images[nextImageIndex < images.length ? nextImageIndex : 0]);
    }
  }, [selectedImage, images]);

  const onOverlayPrevious = useCallback(() => {
    if (selectedImage) {
      const nextImageIndex = (images.findLastIndex(it => it.id === selectedImage.id) || 0) - 1;
      setSelectedImage(images[nextImageIndex >= 0 ? nextImageIndex : images.length - 1]);
    }
  }, [selectedImage, images]);

  return (
    <div className="app">
      <div className="container">
        {imagesGrid.map((arr, rowIdx) => (
          <div key={`row-${rowIdx}`} className="images">
            {arr.map((it) => (
              it && (
                <div key={it.id || it.src} className="image" onClick={() => setSelectedImage(it)}>
                  <div className="imgContainer">
                    <img src={it.thumbnailSrc} width={150} />
                    <svg width="150" height="150" viewBox="0 0 150 150" aria-hidden="true" className="imageSvg">
                      <polygon
                        points="112.5,10 150,75 112.5,140 37.5,140 0,75 37.5,10"
                        stroke={it.color}
                        strokeWidth="1"
                        fill={it.color}
                      />
                    </svg>
                  </div>
                </div>
              )
            ))}
          </div>
        ))}
      </div>
      {
        selectedImage &&
        <ImageOverlay
          image={selectedImage}
          onClose={onOverlayClose}
          onNext={onOverlayNext}
          onPrevious={onOverlayPrevious}
        />
      }
    </div>
  );
}

export default App;
