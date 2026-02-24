# OpenClaw Tips, Tricks & Recommendations

Based on a review of community best practices (sourced from [@aiedge\_](https://x.com/aiedge_/status/2024882793462005866)) mapped against our current instance setup.

---

## Current Setup Summary

- **Host:** macOS (Docker Compose)
- **Gateway:** `openclaw-gateway` container, bound to LAN, token auth
- **Browser:** Sandbox browser at `172.26.0.10:9222` (CDP, headless)
- **Model:** Moonshot Kimi K2.5 (256k context, 16k max output)
- **Channels:** Slack (socket mode) — #claw-1, #morning-report
- **Workspace:** `~/.openclaw/workspace/` with AGENTS.md, SOUL.md, USER.md, MEMORY.md, TOOLS.md, HEARTBEAT.md, IDENTITY.md
- **Cron:** Morning report at 5 AM MST (`bc3e312b`)

---

## Recommendations to Implement

### 1. Security Hardening (HIGH PRIORITY)

Our gateway is currently bound to `lan` — this exposes it to the local network.

**Action items:**

- [ ] Change `--bind lan` to `--bind loopback` in `docker-compose.yml` unless LAN access is needed from other devices
- [ ] Run `openclaw security audit` (or `clawdbot security audit`) to check for misconfigurations
- [ ] Verify sandbox is enabled: `openclaw config get sandbox`
- [ ] Consider a command allowlist if running unattended: `openclaw config set sandbox.commandAllowlist '["git","npm","pnpm","docker"]'`
- [ ] Don't add the bot to group chats where untrusted users could inject prompts
- [ ] Treat third-party ClawHub skills as untrusted — review source before installing

**Commands:**

```bash
# Audit security posture (from host)
pnpm openclaw security audit
pnpm openclaw security audit --deep   # includes live gateway probes
pnpm openclaw security audit --fix    # auto-remediate safe fixes

# Inside the container, there is no `openclaw` binary on PATH.
# Use `node dist/index.js` instead:
#   node dist/index.js security audit

# Check current sandbox config
openclaw config get sandbox

# Restrict gateway to localhost only
# In docker-compose.yml, change --bind lan to --bind loopback

# If you need LAN access (e.g., from phone), keep lan but ensure
# your network is trusted and the gateway token is strong
```

### 2. Model Stack — Add a Lighter Model (MEDIUM)

We're using Kimi K2.5 for everything. The article recommends matching model power to task complexity.

**Action items:**

- [ ] Add a lighter/cheaper model for simple tasks (file nav, quick lookups, heartbeats)
- [ ] Reserve Kimi K2.5 (or a heavier model like Opus) for complex reasoning, debugging, multi-step planning
- [ ] Consider adding an OpenAI model (GPT-4o-mini) as a fallback/light option

**Example config addition:**

```json
{
  "id": "gpt-4o-mini",
  "name": "GPT-4o Mini (Light Tasks)",
  "reasoning": false,
  "cost": { "input": 0.15, "output": 0.6 }
}
```

### 3. Memory Management (MEDIUM)

Our MEMORY.md is minimal. The article highlights that OpenClaw compacts and forgets mid-conversation.

**Action items:**

- [ ] Enable memory flush before compaction: `openclaw config set compaction.memoryFlush.enabled true`
- [ ] Enable session memory search: `openclaw config set memorySearch.experimental.sessionMemory true`
- [ ] Keep daily notes in `workspace/memory/YYYY-MM-DD.md` (AGENTS.md already instructs this)
- [ ] Periodically distill daily notes into MEMORY.md (already in AGENTS.md — just do it)
- [ ] Make the workspace a git repo for backup (article tip #38)

**Commands:**

```bash
# Enable memory flush before compaction
openclaw config set compaction.memoryFlush.enabled true

# Enable experimental session memory search
openclaw config set memorySearch.experimental.sessionMemory true

# Back up workspace as a git repo
cd ~/.openclaw/workspace
git init
git add -A
git commit -m "initial workspace backup"
# Optionally push to a private GitHub repo
```

### 4. HEARTBEAT.md — Put It to Work (MEDIUM)

Our HEARTBEAT.md is currently empty. This is a missed opportunity for periodic autonomous checks.

**Action items:**

- [ ] Add 2-4 rotating checks (keep it lean to minimize token burn)
- [ ] Suggested checks: memory cleanup, project status, unread Slack summary

**Example HEARTBEAT.md:**

```markdown
# HEARTBEAT.md

## Checks (rotate — don't run all every time)

- [ ] Distill any `memory/` daily notes older than 3 days into MEMORY.md
- [ ] Check `git status` in ~/git/openclaw — any uncommitted changes?
- [ ] Summarize any unread Slack messages in #claw-1 since last check
- [ ] Check if morning report cron ran successfully today
```

### 5. IDENTITY.md — Fill It In (LOW)

Currently blank/template. The article emphasizes persona setup.

**Action items:**

- [ ] Fill in name, vibe, emoji (already have "Claw-1" and ⚙️ in SOUL.md — mirror it here)

### 6. TOOLS.md — Update Max Output (LOW)

TOOLS.md says max output is 8192 but we bumped it to 16384.

**Action items:**

- [ ] Update TOOLS.md line 22: `8192` → `16384`

### 7. Prompt Templates (LOW)

The article recommends standardizing prompt templates for common tasks.

**Action items:**

- [ ] Create reusable prompt templates in `notes/` for: refactoring, debugging, code review, feature dev
- [ ] Use the 5-part structure: **Objective → Context → Constraints → Plan → Output format**

### 8. Web Search — Add Brave/Tavily (LOW)

The article recommends Brave (general) and Tavily (specific scraping) as free web search tools.

**Action items:**

- [ ] Evaluate adding Brave Search API as a skill for general web lookups
- [ ] Evaluate Tavily for contact scraping or structured data extraction

---

## Useful Commands Cheatsheet

### Gateway & Status

```bash
# Check gateway health
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:18789/health

# Check container status
docker compose ps

# Restart gateway
docker compose restart openclaw-gateway

# View gateway logs
docker compose logs -f --tail 100 openclaw-gateway
```

### Cron Jobs

```bash
# List all cron jobs
openclaw cron list

# View a specific job
openclaw cron show <job-id>

# Edit a cron job message
openclaw cron edit <job-id> --message "$(cat notes/morning-report-prompt.txt)"

# Trigger a cron job manually
openclaw cron run <job-id>

# Add a new cron job
openclaw cron add --every day --at 05:00 --session isolated --message "your prompt"
```

### Configuration

```bash
# View full config
openclaw config get

# Set a specific value
openclaw config set <key> <value>

# Check connected channels
openclaw channels status --probe

# Security audit
openclaw security audit

# Doctor (troubleshoot issues)
openclaw doctor
```

### Workspace & Memory

```bash
# Workspace location
ls ~/.openclaw/workspace/

# Key files to maintain
# AGENTS.md    — operating instructions (loaded every session)
# SOUL.md      — personality and principles
# USER.md      — info about you
# MEMORY.md    — long-term curated memory (main session only)
# HEARTBEAT.md — periodic autonomous checks
# TOOLS.md     — environment-specific tool notes
# IDENTITY.md  — agent identity/persona

# Back up workspace
cd ~/.openclaw/workspace && git add -A && git commit -m "workspace update"
```

### Browser (CDP)

```bash
# Check sandbox browser is running
docker compose ps openclaw-sandbox-browser

# Test CDP connectivity from gateway
docker compose exec openclaw-gateway curl -s http://172.26.0.10:9222/json/version
```

### Slash Commands

```bash
# Built-in slash commands (use in chat)
/help     — show available commands
/new      — start a new conversation
/reset    — reset the current session
/compact  — manually trigger context compaction
```

---

## Tips & Tricks

1. **Break large tasks into phases** — Don't ask for a massive refactor in one shot. Split into: analysis → plan → implement → validate.

2. **End sessions cleanly** — Before closing, ask the agent to summarize changes, confirm no pending edits, and verify git status.

3. **Voice notes** — Send voice messages via WhatsApp/Telegram instead of typing long prompts. Brain dumps work well.

4. **Scope your requests** — Explicitly name which files/directories the agent should touch. Prevents unnecessary scanning and risky modifications.

5. **Plan before execute** — For non-trivial tasks, ask the agent to propose a plan first. Approve before allowing file changes.

6. **Multi-channel access** — You already have Slack. Consider adding WhatsApp or Telegram for mobile access when away from the desk.

7. **Quiet hours** — Already configured (23:00-08:00 MST). Good. Respect them.

8. **Token awareness** — The morning report costs ~$0.08-0.12 per run. Keep HEARTBEAT.md lean. Rotate checks instead of running everything every 30 minutes.

9. **Git your workspace** — Make `~/.openclaw/workspace` a git repo. Push to a private GitHub repo. This is your agent's brain backup.

10. **Time audit** — Catalog your daily manual tasks. Share the list with the agent and ask it to recommend what to automate next. This is how you find the next morning-report-style win.

---

## What We Already Do Well

- ✅ Workspace files are well-structured (AGENTS, SOUL, USER, MEMORY, TOOLS)
- ✅ Morning report cron job with browser scraping
- ✅ Sandbox browser isolated in Docker
- ✅ Token auth on gateway
- ✅ Prompt versioned in git (`notes/morning-report-prompt.txt`)
- ✅ Quiet hours configured
- ✅ Safety rules in AGENTS.md (trash > rm, ask before external actions)

## What to Improve

- ⚠️ Gateway bound to LAN (consider loopback)
- ⚠️ Single model for all tasks (add a lighter option)
- ⚠️ Memory flush/session search not enabled
- ⚠️ HEARTBEAT.md empty (missed automation opportunity)
- ⚠️ IDENTITY.md not filled in
- ⚠️ TOOLS.md has stale maxTokens value
- ⚠️ No workspace git backup
- ⚠️ No command allowlist configured
