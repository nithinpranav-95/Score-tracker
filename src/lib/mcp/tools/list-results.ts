import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

type Row = { playerId?: string; name?: string; score?: number; rank?: number };

export default defineTool({
  name: "list_game_results",
  title: "List finished games",
  description: "List finished games with date, rounds and each player's final score and rank, newest first.",
  inputSchema: {
    game: z.string().optional().describe("Game name to filter by, e.g. Poker."),
    limit: z.number().int().min(1).max(100).optional().describe("Max games to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ game, limit }) => {
    let q = supabaseAnon()
      .from("game_results")
      .select("id, game_name, played_at, rounds, results")
      .order("played_at", { ascending: false })
      .limit(limit ?? 20);
    if (game) q = q.ilike("game_name", game);
    const { data, error } = await q;
    if (error) throw new ToolError(error.message);
    const games = (data ?? []).map((g) => ({
      id: g.id as string,
      game: g.game_name as string,
      played_at: g.played_at as string,
      rounds: g.rounds as number,
      results: ((g.results as Row[]) ?? []).map((r) => ({
        name: r.name ?? "",
        score: r.score ?? 0,
        rank: r.rank ?? 0,
      })),
    }));
    return { content: [{ type: "text", text: JSON.stringify(games) }], structuredContent: { games } };
  },
});
