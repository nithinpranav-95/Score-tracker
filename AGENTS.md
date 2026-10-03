<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Treat Lovable Cloud `game_results` as the sole score-history source; legacy browser storage must never restore deleted scores, because resets must apply consistently to every device.
- Player names shown anywhere are resolved from `players` by id and refreshed via realtime on `players`/`game_results`, because a rename must appear on every device without reloading.
