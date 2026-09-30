import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

type Row = { name?: string; score?: number; rank?: number };

export default defineTool({
  name: "get_leaderboard",
  title: "Get leaderboard",
  description: "Wins, games played and total points per player, optionally for one game.",
  inputSchema: { game: z.string().optional().describe("Game name to filter by.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ game }) => {
    let q = supabaseAnon().from("game_results").select("game_name, results");
    if (game) q = q.ilike("game_name", game);
    const { data, error } = await q;
    if (error) throw new ToolError(error.message);
    const stats = new Map<string, { name: string; wins: number; games: number; points: number }>();
    for (const g of data ?? []) {
      for (const r of (g.results as Row[]) ?? []) {
        const name = r.name ?? "Unknown";
        const s = stats.get(name) ?? { name, wins: 0, games: 0, points: 0 };
        s.games += 1;
        s.points += r.score ?? 0;
        if (r.rank === 1) s.wins += 1;
        stats.set(name, s);
      }
    }
    const leaderboard = [...stats.values()].sort((a, b) => b.wins - a.wins || b.points - a.points);
    return {
      content: [{ type: "text", text: JSON.stringify(leaderboard) }],
      structuredContent: { leaderboard },
    };
  },
});
