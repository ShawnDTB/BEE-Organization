import { designBriefLines, type DesignBrief } from "../../shared/designBrief";
export function DesignBriefSummary({ brief }: { brief?: DesignBrief }) {
  const lines = designBriefLines(brief);
  if (!lines.length) return null;
  return (
    <section aria-label="Design intent">
      <h3>Your design brief</h3>
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
      <p>
        These are creative requests. Check the artwork to see what is included.
      </p>
    </section>
  );
}
