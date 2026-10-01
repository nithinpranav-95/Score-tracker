import { createFileRoute } from "@tanstack/react-router";
import { ScoreUp } from "./index";

export const Route = createFileRoute("/ranks")({
  head: () => ({
    meta: [
      { title: "Ranks — Troop Connect" },
      { name: "description", content: "Leaderboards, wins and bragging rights for the troop." },
      { property: "og:title", content: "Ranks — Troop Connect" },
      { property: "og:description", content: "Leaderboards, wins and bragging rights for the troop." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ScoreUp tab="ranks" />,
});
