# Cache & Cost Optimization for Claude Code

> **Last updated:** 2026-03-31
> **Status:** Two confirmed bugs in Claude Code that can silently inflate API costs.
> **Sources:** [GitHub #40524](https://github.com/anthropics/claude-code/issues/40524), [GitHub #34629](https://github.com/anthropics/claude-code/issues/34629)
> **Confidence:** Both bugs are confirmed open issues with reproductions. The cost impact numbers are estimates from community reports on large (500K+ token) conversations. Your mileage may vary depending on conversation size.

---

## Why This Matters

Claude Code uses **prompt caching** to avoid re-processing your entire conversation on every turn. When caching works correctly, ~90% of tokens are cache reads ($0.03/MTok) instead of fresh input ($0.30/MTok). When caching breaks, costs increase significantly — and there's no visible error.

This plugin's index-first architecture **avoids** both bugs by design — not because it patches Claude Code, but because its workflow naturally sidesteps the conditions that trigger them.

---

## Bug 1: Conversation History Invalidation (Standalone Binary)

**Issue:** [anthropics/claude-code#40524](https://github.com/anthropics/claude-code/issues/40524)
**Status:** Open, confirmed (`bug, has repro, area:cost, regression`), assigned to Anthropic engineer, 32+ comments
**Severity:** Cache invalidation on every turn when triggered — costs vary by conversation size

### What Happens

The standalone Claude Code binary (from `claude.ai/install.sh` or `npm install -g`) performs a string replacement in the request body before sending it to the API. According to community analysis, if your conversation history contains certain internal strings (billing sentinels, CC source code), the replacement can target the wrong location, changing your `messages` content on every request and breaking the cache prefix.

**Important caveats:**
- This only triggers when conversations contain CC internal strings — most normal usage is unaffected
- The exact mechanism is from community reverse engineering and may not be 100% accurate in its technical details
- The symptoms (cache invalidation on subsequent turns) are confirmed by multiple users

### When Does This Trigger?

- Discussing Claude Code billing internals or API headers in conversation
- Having CC source code or billing identifiers in CLAUDE.md
- Reading the Claude Code bundle source within a session

### Reported Workarounds

1. **Use `npx @anthropic-ai/claude-code` instead of the standalone binary** — reported to avoid the replacement mechanism (community-reported, not officially confirmed)
2. **Avoid discussing CC internals in long, expensive conversations**
3. **Keep CLAUDE.md free of CC internal identifiers**

### How This Plugin's Architecture Avoids It

This plugin naturally avoids the trigger conditions because:
- CLAUDE.md contains only project instructions, design rules, and knowledge references — no CC internals
- Knowledge files are about frameworks, libraries, and UI patterns — not CC billing
- Agents read targeted knowledge files, not CC source code

**Note:** This is not a "fix" — it's simply that the plugin's clean content doesn't trigger the bug. Most well-structured projects would also be unaffected.

---

## Bug 2: --resume Always Breaks Cache (Since v2.1.69)

**Issue:** [anthropics/claude-code#34629](https://github.com/anthropics/claude-code/issues/34629)
**Status:** Open, confirmed (`bug, has repro, area:cost, regression`), 9+ comments
**Severity:** One-time full cache rebuild per resume — ~$0.15 on a 500K token conversation (less on smaller ones)

### What Happens

Every `--resume` causes a **full cache miss** on the entire conversation history. Only the system prompt (~11-14k tokens) is cached; everything else is `cache_creation` from scratch.

**Root cause (per community analysis):** In v2.1.69, Anthropic introduced `deferred_tools_delta` — system-reminder attachments listing tools via ToolSearch. On a fresh session, these are injected into `messages[0]`. On resume, they're appended at the end (`messages[N]`), creating a prefix mismatch that breaks caching.

**Subsequent turns after resume cache normally** — the cost hit is one-time per resume.

**Cost scaling:** The $0.15 figure is for a 500K token conversation. Smaller conversations cost proportionally less on resume. A 100K token conversation would cost ~$0.03 per resume.

### Reported Workarounds

1. **Start fresh sessions instead of resuming** — reconstruct context from project files
2. **Pin to v2.1.68 or v2.1.30-34** — avoids the regression but loses newer features (not recommended long-term)
3. **Accept the one-time cost** if resumes are infrequent

### How This Plugin's Architecture Avoids It

The plugin's `/resumeproject` command reconstructs context from `.10x/` index files in a **fresh session** instead of using `--resume`:

- **`.10x/project.json`** — app name, scope, stack, vision (~1KB)
- **`.10x/file-index.json`** — every file, its purpose, exports, dependencies (~2-5KB)
- **`.10x/tasks.json`** — task states (~1KB)
- **`.10x/feature-map.json`** — feature-to-file mapping (~1KB)
- **`.10x/dev-log.md`** — recent activity (~1KB)

**Cost comparison for resuming a large project (500K tokens):**
| Method | Cache cost |
|--------|-----------|
| `--resume` | ~$0.15 one-time cache rebuild |
| `/resumeproject` (fresh session + index files) | ~$0.001 (reading small JSON files) |

This is where the plugin provides the most concrete cost benefit — the index system was designed for cross-session context reconstruction, which happens to be exactly what avoids this bug.

---

## Combined Cost Impact (estimates for 500K token conversations)

| Scenario | Extra cost |
|----------|-----------|
| Bug 1 only (when triggered) | ~$0.04-0.15 per request, every request |
| Bug 2 only (every resume) | ~$0.15 one-time per resume |
| Both bugs combined | Up to $0.20+ per request |
| Using `/resumeproject` instead of `--resume` | Bug 2 avoided; Bug 1 unlikely with clean project files |

**For smaller conversations (under 100K tokens), costs scale proportionally lower.**

---

## How to Check Your Cache Health

Monitor your API usage to see if caching is working:

1. **Healthy caching:** ~90% of tokens are `cache_read`, ~6% `cache_creation`, ~4% input/output
2. **Bug 1 active:** Large `cache_creation` on every turn, low `cache_read`
3. **Bug 2 active:** First turn after resume shows massive `cache_creation`, subsequent turns normal

---

## Plugin Best Practices for Cost Efficiency

These are built into the 10x Development Team plugin:

1. **Index-first architecture** — Agents read small JSON index files instead of scanning the filesystem
2. **Targeted knowledge reads** — Each agent reads ONE knowledge file per task, not the entire knowledge base
3. **Fresh sessions with context reconstruction** — `/resumeproject` loads context from `.10x/` files instead of relying on `--resume`
4. **Clean CLAUDE.md** — Project instructions only, no CC internals or billing strings
5. **Scoped agent delegation** — Each agent gets only the context it needs, keeping token counts low
6. **Dev log as memory** — Logs everything to `.10x/dev-log.md` for cross-session persistence
