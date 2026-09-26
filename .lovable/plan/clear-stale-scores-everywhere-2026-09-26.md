# Clear stale scores everywhere

## Goal
Make the score reset visible immediately and ensure deleted shared results cannot reappear from an older browser copy.

## Changes
- Stop restoring score history from browser storage when the shared database has no results.
- Clear any legacy browser-saved score history during app loading.
- Keep current players and games unchanged.
- Verify the home, ranks, stats, profiles, and history all start at zero after refresh.

## Technical details
The shared result table is already empty. The remaining values come from the legacy `scoreup_sessions` browser-storage fallback, which will be removed while cloud results remain the single source of truth.
