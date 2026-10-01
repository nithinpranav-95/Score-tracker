import { createFileRoute } from "@tanstack/react-router";
import { ScoreUp } from "./index";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — Troop Connect" },
      { name: "description", content: "Every finished game: final scores, rounds and winners." },
      { property: "og:title", content: "History — Troop Connect" },
      { property: "og:description", content: "Every finished game: final scores, rounds and winners." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ScoreUp tab="history" />,
});
