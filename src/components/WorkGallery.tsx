import { useState } from "react";
import { workPhotos, type WorkPhoto } from "../content/storefront";
export function WorkGallery({
  photos = workPhotos,
}: {
  photos?: readonly WorkPhoto[];
}) {
  const [index, setIndex] = useState(0);
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
              onClick={() =>
                setIndex((current + photos.length - 1) % photos.length)
              }
              aria-label="Previous work photo"
            >
              ←
            </button>
            <button
              onClick={() => setIndex((current + 1) % photos.length)}
              aria-label="Next work photo"
            >
              →
            </button>
          </div>
        )}
      </div>
      <figure>
        <img
          src={photo.src}
          alt={photo.alt}
          width="1200"
          height="800"
          loading="lazy"
          decoding="async"
        />
        <figcaption aria-live="polite">
          {photo.caption} · {current + 1} of {photos.length}
        </figcaption>
      </figure>
    </section>
  );
}
