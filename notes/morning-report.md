# Morning Report

Daily morning report delivered at **5:00 AM MST** via cron job.

**Cron job ID:** `bc3e312b-4ee4-417f-ad72-2542700ddd33`

## General rules

- If any source is unreachable, note it briefly and move on.
- Keep each item to 1-2 sentences. Be thorough but concise.
- Slack formatting: bold, bullet lists, links. No markdown tables.

## Sections

### 1. News headlines (top 5)

Sources: **Reuters** (reuters.com), **AP News** (apnews.com), **NYT** (nytimes.com), **WSJ** (wsj.com). For each: one-line summary, link, one sentence on impact.

### 2. Hacker News (top 5)

Source: https://news.ycombinator.com/. For each: one-line summary, link, why notable.

### 3. Reddit trending (top 5)

Source: https://www.reddit.com/r/popular/. For each: one-line summary, subreddit, link, and significance.

### 4. Google Trends (top 5)

Source: https://trends.google.com/trending?geo=US&hours=24. Top 5 trending US searches. For each: query, search volume, why it's trending.

### 5. Crypto (BTC, ETH, SOL)

Source: https://www.coingecko.com/. For each: current price, 24h change %, one-line trend.

### 6. OpenClaw updates

Source: https://github.com/openclaw/openclaw/releases. Releases in last 24h? Summarize or state "No new releases."

### 7. OpenClaw skills

Source: https://clawhub.ai/. New skills in last 24h? Brief description and link. If unavailable or none, note it.

### 8. Clarity Act odds

Source: https://polymarket.com/event/clarity-act-signed-into-law-in-2026. Current odds and brief state. Skip if unavailable.

### 9. Report cost

Estimate cost in USD (tokens used, approximate cost).

## Delivery

Agent sends directly to **#morning-report** (`channel:C0AFKPL6LE4`) via the messaging tool. Delivery mode is `none` (no announce pipeline — agent handles it).
