import { useId, useState } from "react";
import { workPhotos, type WorkPhoto } from "../content/storefront";
export function WorkGallery({
  photos = workPhotos,
}: {
  photos?: readonly WorkPhoto[];
}) {
  const [index, setIndex] = useState(0);
  const slideId = useId();
  if (!photos.length) return null;
  const current = index % photos.length;
  const photo = photos[current];
  if (!photo) return null;
  return (
    <section
      className="sf-section sf-wrap sf-work"
      aria-label="Our recent work"
      aria-roledescription="carousel"
    >
      <div className="sf-section-heading">
        <div>
          <span className="sf-kicker">Made by BEE</span>
          <h2>A look at our work.</h2>
        </div>
        {photos.length > 1 && (
          <div className="sf-gallery-controls">
            <button
              type="button"
              aria-controls={slideId}
              onClick={() =>
                setIndex((current + photos.length - 1) % photos.length)
              }
              aria-label="Previous work photo"
            >
              ←
            </button>
            <button
              type="button"
              aria-controls={slideId}
              onClick={() => setIndex((current + 1) % photos.length)}
              aria-label="Next work photo"
            >
              →
            </button>
          </div>
        )}
      </div>
      <figure
        id={slideId}
        role="group"
        aria-roledescription="slide"
        aria-label={`${current + 1} of ${photos.length}`}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          width="1200"
          height="800"
          loading="lazy"
          decoding="async"
        />
        <figcaption aria-live="polite" aria-atomic="true">
          {photo.caption} · {current + 1} of {photos.length}
        </figcaption>
      </figure>
    </section>
  );
}
