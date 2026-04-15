# 🔥 burncheck

**Privacy-first Claude Code burn-rate analyzer, as a CLI.**

See your last 7 days of Claude Code usage — burn rate, per-model cost breakdown, weekly cap risk — right in your terminal.

```bash
npx burncheck
```

No install. No upload. No account. Reads `~/.claude/projects/` locally, prints to stdout.

## Example output

```
  🔥 BurnCheck   Last 7 days on Claude Code
  ────────────────────────────────────────

    $5,163
    BURNED THIS WEEK

    1.7B tokens  ·  11,573 API calls  ·  100% on opus

    That's 16.1× a Max $200 subscription.

  Model breakdown
  ────────────────────────────────────────
    opus-4-6         10,821 calls   $5,156  ████████████████████
    haiku-4-5           725 calls    $3.54  ░░░░░░░░░░░░░░░░░░░░

  Weekly cap forecast   (at $737.5/day)
  ────────────────────────────────────────
    Max $20      cap $25.0    OVER by 20551%
    Max $100     cap $140.0   OVER by 3588%
    Max $200     cap $320.0   OVER by 1513%

  💡 100% of your cost is on claude-opus-4-6.
     Switching half those calls to Sonnet saves ~$2,062/week.
```

## Want a visual dashboard?

Same analysis as a web page: **https://genie-j.github.io/burncheck/**

Pick your `~/.claude/projects/` folder from the browser — everything runs client-side.

## Privacy

- **Zero upload.** Nothing leaves your machine.
- **Zero dependencies.** Single-file Node script, no `node_modules`.
- **Open source.** Read the 200 lines at [github.com/Genie-J/burncheck](https://github.com/Genie-J/burncheck).

## Env

- `CLAUDE_PROJECTS_DIR=/custom/path` to override the scan path (defaults to `~/.claude/projects/`)

## How it works

1. Recursively finds all `.jsonl` files in `~/.claude/projects/`
2. Parses `type=assistant` records, extracts `message.usage` + `model` + `timestamp`
3. Filters to last 7 days
4. Computes cost per model using published Anthropic per-token rates
5. Projects against weekly caps for Max $20 / $100 / $200 plans

## Accuracy disclaimer

Anthropic doesn't publish exact weekly caps and tweaks them periodically. BurnCheck uses community-reported $-equivalents. Treat numbers as ±30%. Ranking ("you'll cross by Friday") is more reliable than exact thresholds.

## License

MIT. Not affiliated with Anthropic.
