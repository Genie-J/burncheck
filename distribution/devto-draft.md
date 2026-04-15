---
title: How I built a privacy-first Claude Code burn-rate analyzer in a single HTML file
published: false
description: A web app that tells you how much you spent on Claude this week — no upload, no backend, no account. Just point it at your local logs.
tags: claude, claudecode, ai, webdev
cover_image: https://raw.githubusercontent.com/Genie-J/burncheck/main/screenshot.png
canonical_url: https://genie-j.github.io/burncheck/
---

If you're a Claude Code power user on a Max $20 / $100 / $200 plan, you've probably hit a weekly limit mid-task at least once. Anthropic doesn't publish exact caps, the UI doesn't warn you beforehand, and existing tools just show current usage — they don't predict.

So I built [**BurnCheck**](https://genie-j.github.io/burncheck/): a single-page webapp that reads your `~/.claude/projects/` folder locally and shows:

- Projected weekly cost (based on last 7 days)
- Whether you'll cross Max $20 / $100 / $200 caps before Sunday
- Sessions at risk of hitting the 5-hour interrupt
- Concrete model-swap recommendations ("these 14 Opus calls could've run on Sonnet → save $23/week")

**Everything runs in your browser.** Zero upload, zero account, zero tracking. Open DevTools Network tab — there are no outbound requests after the page loads. The whole thing is one 27 KB HTML file on GitHub Pages.

---

## The design constraint that shaped everything

Claude Code logs contain every prompt you've ever written — source code, API keys occasionally (though you shouldn't, but people do), business ideas, private thoughts. Any tool that asks you to *upload* those logs to analyze them is dead on arrival for the target audience (privacy-conscious devs). So:

**Constraint:** nothing can leave the user's machine.

**Consequence:** no backend, no serverless, no database, no analytics. Just HTML + JS using the browser's `File API` to read local files on user-gesture click.

```javascript
// That's it. The whole "upload" flow.
document.getElementById('folderInput').addEventListener('change', async (e) => {
  const files = Array.from(e.target.files).filter(f => f.name.endsWith('.jsonl'));
  const records = [];
  for (const f of files) {
    const text = await f.text();
    for (const line of text.split('\n')) {
      const d = JSON.parse(line);
      if (d.type === 'assistant' && d.message?.usage) {
        records.push({ model: d.message.model, usage: d.message.usage, ts: d.timestamp });
      }
    }
  }
  render(analyze(records));
});
```

The user picks their `~/.claude/projects/` folder in the native file picker. Chrome's File API gives the page read access to every `.jsonl` inside — and nothing more. No network, no `fetch()`, no hidden beacon.

---

## Cost calculation

Each `type: assistant` record in the JSONL has a `usage` object:

```json
{
  "input_tokens": 3,
  "cache_creation_input_tokens": 59469,
  "cache_read_input_tokens": 11530,
  "output_tokens": 27
}
```

Per-model pricing (community-published rates, ±30% uncertain since Anthropic doesn't publish a stable schedule):

```javascript
const PRICING = {
  opus:   { in: 15.00, out: 75.00, cw: 1.25, cr: 0.10 },
  sonnet: { in:  3.00, out: 15.00, cw: 1.25, cr: 0.10 },
  haiku:  { in:  0.25, out:  1.25, cw: 1.25, cr: 0.10 },
};

const costOf = (model, u) => {
  const p = priceOf(model);
  return (u.input_tokens || 0) / 1e6 * p.in
       + (u.output_tokens || 0) / 1e6 * p.out
       + (u.cache_creation_input_tokens || 0) / 1e6 * p.in * p.cw
       + (u.cache_read_input_tokens || 0) / 1e6 * p.in * p.cr;
};
```

**Surprising finding from my own logs:** 99% of my cost came from cache reads. Without cache prompt optimization, long sessions become very expensive very fast. A single multi-hour Claude Code session with a growing context can easily cross $50.

---

## Weekly cap heuristic

Anthropic's Max plans have opaque weekly caps enforced somewhere between "suggested" and "hard throttle." Community reports suggest:

| Plan | Approx weekly $-equivalent |
|---|---|
| Max $20 | ~$25 |
| Max $100 | ~$140 |
| Max $200 | ~$320 |

These aren't official and shift. BurnCheck lets users override them from their own throttle experience — the values persist in `localStorage` so the forecast improves as users calibrate.

At current burn rate × 7, we compute `ratio = projected_week / cap`. If >100%: "OVER by X%". If 80–100%: "tight". If <80%: "comfortable". It's not a rocket science prediction — it's a trust-the-user-can-read-a-bar-chart move. The value isn't the math, it's **surfacing information Anthropic's UI never shows you.**

---

## The shareable card (viral loop)

The most fun part to build. A `<canvas>` element that renders your weekly burn as a 1200×630 PNG (Twitter/X OG card dimensions):

![BurnCheck share card — warm cream background with big hero $ number and BURNED THIS WEEK label in deep tangerine](https://raw.githubusercontent.com/Genie-J/burncheck/main/screenshot.png)

Users download + post it. Each share becomes free distribution. My alpha tester (my partner) noticed this instantly — "people love to flex how much they spent on AI this week" — and it turned out to be the most engagement-generating feature by a large margin.

Canvas drawing is old-school pleasant:

```javascript
ctx.fillStyle = '#FBF3E8';  // linen paper
ctx.fillRect(0, 0, 1200, 630);
ctx.font = '700 260px -apple-system, sans-serif';
ctx.fillStyle = '#2B1810';  // warm near-black
ctx.textAlign = 'center';
ctx.fillText(`$${totalCost.toFixed(0)}`, 600, 360);
```

No html2canvas, no external libs. 50 lines of draw calls.

---

## Seven design iterations in one day

I wrote the first version in 2 hours. Then I spent the next 8 hours **making it look worse**, three times, before landing back near v0.1.

Why? Because I kept trying to ape Cal.com, Clay.com, and Linear.app's design systems instead of just shipping a clean utility. Each time I'd read their DESIGN.md-style regulations, take the DNA ("oat background", "hard-edge offset shadows", "multi-layer ring shadows"), and apply it mechanically — "use hard shadow at least 3 places." Result: cramped dashboards that visually screamed "I am pretending to be a marketing site."

My alpha tester's feedback each round:
- v0.4 (Cal-inspired grayscale): "too cold"
- v0.5 (Clay-inspired warm + hard shadows): "ugly, zero breathing room"
- v0.6 (Linear-inspired breathing-first): "worse, not as good as the first version"

Only v0.6 had the right diagnosis — subtract, don't add. But the right *aesthetic* was v0.1 all along: orange accent + clean off-white background + system fonts + 1px borders. Boring. Functional. Invisible design.

**Lesson**: design system DNA is grammar, not recipe. Apply it selectively based on whether the product is marketing-site-shaped (Clay, Linear home page) or utility-dashboard-shaped (what BurnCheck actually is). Force-fitting a marketing aesthetic onto a dashboard produces cramped ugliness at worst, cargo-cult polish at best.

---

## What's next

- **npm CLI** — `npx github:Genie-J/burncheck` runs the same analysis in your terminal, colored output, zero deps (shipped today)
- **Pro tier** (planned) — auto-monitoring daemon, daily email alerts, hosted dashboard. $9/mo, founding users $5/mo for life. [Watch the repo](https://github.com/Genie-J/burncheck) to be notified.
- **Leaderboard** — opt-in "biggest burn of the week" flex board. Privacy-preserving (only aggregated stats posted). Network effect around the share-card loop.

---

## Try it

- Web: https://genie-j.github.io/burncheck/
- CLI: `npx github:Genie-J/burncheck`
- Source: https://github.com/Genie-J/burncheck

Built over a single day. MIT licensed. Not affiliated with Anthropic.

If it saves you from a Thursday-afternoon limit cutoff, open an issue and tell me how. That's the only thanks the project needs.
