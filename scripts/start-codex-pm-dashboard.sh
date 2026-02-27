#!/usr/bin/env bash
set -euo pipefail

WORKDIR='/Users/anthonyvazquez/Documents/Project-Manager-Dashboard'
SUPABASE_PROJECT_ID='rucrraniltkhbevprvvl'

read -r -d '' SESSION_PROMPT <<'PROMPT' || true
For this workspace, treat Supabase project_id `SUPABASE_PROJECT_ID_PLACEHOLDER` as the default.
When a Supabase MCP tool accepts `project_id`, use that value unless I explicitly provide a
different project_id in the same request.
PROMPT

SESSION_PROMPT="${SESSION_PROMPT/SUPABASE_PROJECT_ID_PLACEHOLDER/$SUPABASE_PROJECT_ID}"

exec codex -C "$WORKDIR" "$SESSION_PROMPT"
