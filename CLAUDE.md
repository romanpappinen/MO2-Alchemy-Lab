# CLAUDE.md

Project instructions for Claude Code in this repo.

## Scope
Work only inside this repository (`/workspaces/alchemy`).
Prefer the smallest change that solves the task.
Do not scan unrelated folders unless explicitly asked.
This applies identically whether the session started locally or via Remote
Control from a phone — a remote origin does not grant extra trust.

## Secrets
Never read, print, summarize, diff, or modify:
- .env
- .env.local
- .env.*.local
- .npmrc
- private keys, SSH keys, cloud credential files
- CI secret stores (GitHub Actions secrets, deploy tokens, etc.)

Use only:
- .env.example
- typed config
- documented variable names

Never reveal secret values in output, logs, diffs, or comments, even
partially.

## Deploy and production — hard boundary
Never deploy, never publish a release, never push to `main`/`master` —
regardless of permission mode or remote/mobile session.

The only path to production:
1. Propose changes as a small diff on a feature branch.
2. A human reviews and opens/merges a PR.
3. CI runs the actual build/deploy, gated by a manual approval step.

If asked to deploy directly, refuse and point to this section instead.

## Commands
Do not run destructive commands such as:
- rm -rf
- git reset --hard
- git clean -fd
- git push --force
- npm publish / pnpm publish

Do not use networked commands (fetching URLs, installing arbitrary global
packages, calling third-party APIs) unless explicitly requested, and never
for anything resembling a deploy or release action.

## Workflow
This session runs in `plan` permission mode: for any non-trivial change,
propose a plan first (files to touch, why, expected risk) and wait for
explicit approval before writing code or running commands. Trivial,
obviously-safe read-only actions (viewing files, `git status`, `git diff`,
running existing lint/test scripts) don't need a plan, but still don't chain
into edits without a go-ahead.

After approval, run only minimal relevant checks for touched code:
- typecheck (`vue-tsc` / `tsc --noEmit`, if configured)
- lint (`eslint`)
- component-scoped tests, if present

After any non-trivial change, append a short entry to `diary.md`:
- what changed
- what was verified (typecheck/lint/tests run and result)
- the next concrete step

After a step/task is completed successfully (checks above pass), commit the
work to git as its own commit, with a message summarizing the work done
(what changed and why). This applies to local changes only — it does not
authorize pushing to a remote; pushes still require explicit user request per
the deploy/production boundary above.

## Repo structure
- src/pages — routed pages (`router/index.ts` wires these up manually)
- src/components/AppShell — top-level shell: app switcher, language switcher
- src/components/AlchemyLab — potion/ingredient calculator
- src/components/CraftCalc — Mortal Online 2 craft-tree calculator
- src/composables — shared state (`use*Store.js`, `use*Calc.js`), constants,
  and `useI18n.js` (the single source of truth for RU/EN strings — locale is
  a shared singleton, not per-component state)
- No backend/database in this repo. All persistence is `localStorage` in the
  browser; there is nothing here that resembles a migration or a production
  data boundary.
