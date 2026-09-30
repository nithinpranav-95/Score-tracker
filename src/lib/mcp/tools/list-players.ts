import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_players",
  title: "List troopers",
  description: "List troopers (players) with their spirit animal, optionally filtered by troop name.",
  inputSchema: { troop: z.string().optional().describe("Troop name to filter by (case-insensitive).") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ troop }) => {
    let q = supabaseAnon().from("players").select("id, name, spirit_animal, troop").order("name");
    if (troop) q = q.ilike("troop", troop);
    const { data, error } = await q;
    if (error) throw new ToolError(error.message);
    const players = (data ?? []).map((p) => ({
      id: p.id as string,
      name: p.name as string,
      spirit_animal: p.spirit_animal as string,
      troop: p.troop as string,
    }));
    return { content: [{ type: "text", text: JSON.stringify(players) }], structuredContent: { players } };
  },
});
