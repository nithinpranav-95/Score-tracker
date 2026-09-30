import { defineMcp } from "@lovable.dev/mcp-js";
import listPlayers from "./tools/list-players";
import listResults from "./tools/list-results";
import leaderboard from "./tools/leaderboard";

export default defineMcp({
  name: "troopconnect",
  title: "TroopConnect",
  version: "0.1.0",
  instructions:
    "Read-only tools for TroopConnect, a game score tracker for friend troops. Use `list_players` for troopers, `list_game_results` for finished games, and `get_leaderboard` for wins and points.",
  tools: [listPlayers, listResults, leaderboard],
});
