import { useId, useState } from "react";
import "../styles/custom-story.css";

const stages = [
  {
    id: "idea",
    label: "Idea",
    title: "It starts with something that matters.",
    description:
      "A few words, a team name, or a rough sketch can be the starting point for your custom piece.",
  },
  {
    id: "artwork",
    label: "Artwork",
    title: "Give the idea a little shape.",
    description:
      "Explore the wording, colors, and arrangement. Your concept stays editable while you work through the details.",
  },
  {
    id: "piece",
    label: "Your piece",
    title: "Picture something made for your people.",
    description:
      "Preview a possible placement, then review the garment, price, and final artwork proof with BEE before production.",
  },
] as const;

export function CustomStory() {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const panelId = `${id}-concept`;
  const stage = stages[selected]!;

  return (
    <section className="custom-story sf-wrap" aria-labelledby="custom-heading">
      <div className="custom-story-copy">
        <span className="sf-kicker">The custom design studio</span>
        <h2 id="custom-heading">Your idea. A piece only you could make.</h2>
        <p className="custom-story-lead">
          A team worth showing up for. A gift with a story. Something entirely
          your own.
        </p>
        <div
          className="custom-story-stages"
          role="group"
          aria-label="Explore the example design stages"
        >
          {stages.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected === index}
              aria-controls={panelId}
              onClick={() => setSelected(index)}
            >
              <span aria-hidden="true">0{index + 1}</span>
              {item.label}
            </button>
          ))}
        </div>
        <div
          className="custom-story-description"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <h3>{stage.title}</h3>
          <p>{stage.description}</p>
        </div>
        <div className="custom-story-actions">
          <a className="sf-button" href="/studio?garment=tee">
            Create your own <span aria-hidden="true">↗</span>
          </a>
          <a className="sf-text-link" href="/start-order">
            Have BEE help with my idea <span aria-hidden="true">↗</span>
          </a>
        </div>
        <p className="custom-story-reassurance">
          Start a fresh concept in Studio. Saving does not send a request or
          take payment.
        </p>
      </div>
      <figure
        id={panelId}
        className="custom-story-art"
        data-stage={stage.id}
        aria-label={`Example custom concept: ${stage.label}`}
      >
        <div className="custom-story-art-label" aria-hidden="true">
          <span>Custom by BEE</span>
          <span>0{selected + 1} / 03</span>
        </div>
        <svg viewBox="0 0 600 490" aria-hidden="true" focusable="false">
          <defs>
            <pattern
              id={`${id}-grid`}
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="#8796a4" opacity=".35" />
            </pattern>
            <linearGradient id={`${id}-fabric`} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#394449" />
              <stop offset=".5" stopColor="#20262a" />
              <stop offset="1" stopColor="#11151a" />
            </linearGradient>
          </defs>
          <rect width="600" height="490" fill={`url(#${id}-grid)`} />
          <g className="custom-story-scene custom-story-scene--idea">
            <path d="M151 83 464 104 440 408 128 385Z" fill="#ccd4dc" />
            <g transform="rotate(-5 300 245)">
              <rect x="136" y="78" width="326" height="326" fill="#ffffff" />
              <path
                d="M167 136H431M167 332H431M167 355H351"
                stroke="#ccd4dc"
                strokeWidth="2"
              />
              <text
                x="166"
                y="120"
                fill="#52606d"
                fontSize="11"
                fontFamily="system-ui, sans-serif"
                letterSpacing="2"
              >
                THE START OF SOMETHING
              </text>
              <text
                x="166"
                y="187"
                fill="#52606d"
                fontSize="19"
                fontFamily="Georgia, serif"
                fontStyle="italic"
              >
                a shirt for
              </text>
              <text
                x="165"
                y="236"
                fill="#11151a"
                fontSize="38"
                fontFamily="system-ui, sans-serif"
                fontWeight="900"
                letterSpacing="-2"
              >
                OUR PEOPLE.
              </text>
              <path
                d="M164 250Q277 269 419 246"
                stroke="#0b6b63"
                fill="none"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <text
                x="166"
                y="304"
                fill="#52606d"
                fontSize="15"
                fontFamily="system-ui, sans-serif"
              >
                An idea is enough to begin.
              </text>
            </g>
          </g>
          <g className="custom-story-scene custom-story-scene--artwork">
            <rect x="141" y="74" width="318" height="342" fill="#ffffff" />
            <path
              d="M126 85H152M139 72V98M448 85H474M461 72V98M126 405H152M139 392V418M448 405H474M461 392V418"
              stroke="#0b6b63"
              strokeWidth="2"
            />
            <g transform="translate(178 119)">
              <path
                d="M110 0V32M94 16H126M98 4L122 28M98 28L122 4"
                stroke="#0b6b63"
                strokeWidth="5"
              />
              <text
                y="92"
                fill="#11151a"
                fontSize="48"
                fontWeight="900"
                fontFamily="system-ui, sans-serif"
                letterSpacing="-3"
              >
                YOUR
              </text>
              <text
                y="144"
                fill="#11151a"
                fontSize="48"
                fontWeight="900"
                fontFamily="system-ui, sans-serif"
                letterSpacing="-3"
              >
                PEOPLE.
              </text>
              <path d="M0 164H240" stroke="#0b6b63" strokeWidth="5" />
              <text
                y="193"
                fill="#0b6b63"
                fontSize="16"
                fontWeight="700"
                fontFamily="system-ui, sans-serif"
                letterSpacing="3"
              >
                YOUR STORY.
              </text>
              <text
                y="256"
                fill="#52606d"
                fontSize="10"
                fontFamily="system-ui, sans-serif"
                letterSpacing="2"
              >
                AN EXAMPLE. YOURS CAN BE DIFFERENT.
              </text>
            </g>
          </g>
          <g className="custom-story-scene custom-story-scene--piece">
            <ellipse
              cx="300"
              cy="425"
              rx="150"
              ry="14"
              fill="#11151a"
              opacity=".1"
            />
            <path
              d="M231 81 272 62H328L369 81 460 137 421 215 374 190V415H226V190L179 215 140 137Z"
              fill={`url(#${id}-fabric)`}
              stroke="#11151a"
              strokeWidth="2"
            />
            <path
              d="M272 62Q300 113 328 62"
              fill="#11151a"
              stroke="#52606d"
              strokeWidth="5"
            />
            <path
              d="M226 190 231 81M374 190 369 81M238 399H362"
              stroke="#75818d"
              strokeWidth="1.5"
              opacity=".6"
              fill="none"
            />
            <g transform="translate(245 157)">
              <path
                d="M53 0V20M43 10H63M46 3L60 17M46 17L60 3"
                stroke="#5eead4"
                strokeWidth="3"
              />
              <text
                y="53"
                fill="#e1e5e9"
                fontSize="24"
                fontWeight="900"
                fontFamily="system-ui, sans-serif"
                letterSpacing="-1"
              >
                YOUR
              </text>
              <text
                y="81"
                fill="#e1e5e9"
                fontSize="24"
                fontWeight="900"
                fontFamily="system-ui, sans-serif"
                letterSpacing="-1"
              >
                PEOPLE.
              </text>
              <path d="M0 93H110" stroke="#5eead4" strokeWidth="3" />
              <text
                y="111"
                fill="#5eead4"
                fontSize="8"
                fontWeight="700"
                fontFamily="system-ui, sans-serif"
                letterSpacing="1.5"
              >
                YOUR STORY.
              </text>
            </g>
          </g>
        </svg>
        <figcaption>
          Illustrative concept · not a product or production proof
        </figcaption>
      </figure>
    </section>
  );
}
