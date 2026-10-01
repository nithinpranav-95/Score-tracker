import { createFileRoute } from "@tanstack/react-router";
import { ScoreUp } from "./index";

export const Route = createFileRoute("/players")({
  head: () => ({
    meta: [
      { title: "Players — Troop Connect" },
      { name: "description", content: "Meet the troop: profiles, spirit animals and stats." },
      { property: "og:title", content: "Players — Troop Connect" },
      { property: "og:description", content: "Meet the troop: profiles, spirit animals and stats." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ScoreUp tab="players" />,
});
