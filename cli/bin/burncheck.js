#!/usr/bin/env node
// burncheck — privacy-first Claude Code burn-rate analyzer (CLI)
// https://github.com/Genie-J/burncheck
// Zero dependencies. Reads your local ~/.claude/projects/ logs. Nothing uploaded.

const fs = require('fs');
const path = require('path');
const os = require('os');

// ANSI colors — warm palette matching web version
const c = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  orange: '\x1b[38;2;194;65;12m',   // C2410C — deep tangerine
  cream: '\x1b[38;2;251;243;232m',  // FBF3E8 — linen cream
  ink: '\x1b[38;2;43;24;16m',       // 2B1810 — warm near-black (light bg only)
  muted: '\x1b[38;2;138;111;92m',   // 8A6F5C — warm taupe
  green: '\x1b[38;2;76;175;80m',
  red: '\x1b[38;2;192;57;43m',
  yellow: '\x1b[38;2;181;118;0m',
};

// Pricing ($/1M tokens) — community-published rates, ±30% uncertain
const PRICING = {
  opus:   { in: 15.00, out: 75.00, cw: 1.25, cr: 0.10 },
  sonnet: { in:  3.00, out: 15.00, cw: 1.25, cr: 0.10 },
  haiku:  { in:  0.25, out:  1.25, cw: 1.25, cr: 0.10 },
};
const priceOf = (m) => {
  const s = (m || '').toLowerCase();
  if (s.includes('opus')) return PRICING.opus;
  if (s.includes('sonnet')) return PRICING.sonnet;
  if (s.includes('haiku')) return PRICING.haiku;
  return PRICING.sonnet;
};
const costOf = (m, u) => {
  const p = priceOf(m);
  return (u.input_tokens || 0) / 1e6 * p.in
    + (u.output_tokens || 0) / 1e6 * p.out
    + (u.cache_creation_input_tokens || 0) / 1e6 * p.in * p.cw
    + (u.cache_read_input_tokens || 0) / 1e6 * p.in * p.cr;
};

const CAPS = { 'Max $20': 25, 'Max $100': 140, 'Max $200': 320 };
const ROOT = process.env.CLAUDE_PROJECTS_DIR || path.join(os.homedir(), '.claude', 'projects');
const CUTOFF = Date.now() - 7 * 86400 * 1000;

function walk(dir, out) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch (e) { return; }
  for (const f of entries) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p, out);
    else if (f.name.endsWith('.jsonl')) out.push(p);
  }
}

function bar(pct, width = 24, color = c.orange) {
  const filled = Math.min(width, Math.max(0, Math.round(pct * width)));
  return color + '█'.repeat(filled) + c.dim + '░'.repeat(width - filled) + c.reset;
}

function fmtUSD(n) {
  if (n >= 1000) return '$' + n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return '$' + n.toFixed(n < 10 ? 2 : 1);
}
function fmtTok(n) {
  if (n >= 1e9) return (n/1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n/1e6).toFixed(0) + 'M';
  if (n >= 1e3) return (n/1e3).toFixed(0) + 'K';
  return String(n);
}

function analyze() {
  if (!fs.existsSync(ROOT)) {
    console.error(c.red + '\nERROR: ' + c.reset + ROOT + ' not found.');
    console.error('Set CLAUDE_PROJECTS_DIR=/path/to/projects or install Claude Code first.\n');
    process.exit(1);
  }

  const files = [];
  walk(ROOT, files);

  if (files.length === 0) {
    console.error(c.yellow + 'No .jsonl files found in ' + ROOT + c.reset);
    process.exit(1);
  }

  const records = [];
  for (const f of files) {
    let text;
    try { text = fs.readFileSync(f, 'utf8'); } catch (e) { continue; }
    for (const line of text.split('\n')) {
      if (!line.trim()) continue;
      try {
        const d = JSON.parse(line);
        if (d.type === 'assistant' && d.message && d.message.usage && d.timestamp) {
          const ts = new Date(d.timestamp).getTime();
          if (ts >= CUTOFF) records.push({ m: d.message.model, u: d.message.usage, t: ts });
        }
      } catch (e) { /* skip */ }
    }
  }

  if (records.length === 0) {
    console.error(c.yellow + 'No assistant records in the last 7 days.' + c.reset);
    console.error('Scanned ' + files.length + ' files from ' + ROOT);
    process.exit(1);
  }

  const byModel = {};
  let totalTokens = 0, totalCost = 0;
  for (const r of records) {
    const k = r.m;
    if (!byModel[k]) byModel[k] = { calls: 0, input: 0, output: 0, cw: 0, cr: 0, cost: 0 };
    byModel[k].calls++;
    byModel[k].input += r.u.input_tokens || 0;
    byModel[k].output += r.u.output_tokens || 0;
    byModel[k].cw += r.u.cache_creation_input_tokens || 0;
    byModel[k].cr += r.u.cache_read_input_tokens || 0;
    const cost = costOf(r.m, r.u);
    byModel[k].cost += cost;
    totalCost += cost;
    totalTokens += (r.u.input_tokens || 0) + (r.u.output_tokens || 0) + (r.u.cache_creation_input_tokens || 0) + (r.u.cache_read_input_tokens || 0);
  }

  const costPerDay = totalCost / 7;
  const costPerWeek = costPerDay * 7;
  const topModel = Object.entries(byModel).sort((a, b) => b[1].cost - a[1].cost)[0];

  // ── Output ──
  const w = 68;
  const hr = c.dim + '─'.repeat(w) + c.reset;

  console.log('');
  console.log('  ' + c.orange + c.bold + '🔥 BurnCheck' + c.reset + c.muted + '   Last 7 days on Claude Code' + c.reset);
  console.log('  ' + hr);
  console.log('');
  // Hero — big cost number
  const costStr = fmtUSD(totalCost);
  console.log('    ' + c.bold + '\x1b[38;2;220;220;220m' + costStr + c.reset);
  console.log('    ' + c.orange + c.bold + 'BURNED THIS WEEK' + c.reset);
  console.log('');
  console.log('    ' + c.muted + fmtTok(totalTokens) + ' tokens  ·  ' + records.length.toLocaleString() + ' API calls  ·  ' + Math.round(topModel[1].cost / totalCost * 100) + '% on ' + topModel[0].replace('claude-', '').replace(/-\d+(-\d+)?(-\d{8})?$/, '') + c.reset);
  console.log('');

  // Flex tagline
  let tag;
  if (totalCost > 2000) tag = `That's ${(totalCost/320).toFixed(1)}× a Max $200 subscription.`;
  else if (totalCost > 500) tag = `That's ${(totalCost/140).toFixed(1)}× a Max $100 subscription.`;
  else if (totalCost > 100) tag = `Max $100 territory — heavy but not crazy.`;
  else if (totalCost > 25) tag = `Max $20 is carrying my week.`;
  else tag = `Lightweight week. Savings mode engaged.`;
  console.log('    ' + c.bold + tag + c.reset);
  console.log('');

  // Model breakdown
  console.log('  ' + c.bold + 'Model breakdown' + c.reset);
  console.log('  ' + hr);
  const sorted = Object.entries(byModel).sort((a, b) => b[1].cost - a[1].cost);
  for (const [name, m] of sorted) {
    if (m.cost < 0.01 && m.calls < 5) continue;
    const share = m.cost / totalCost;
    const pad = (s, n) => (String(s) + ' '.repeat(n)).slice(0, n);
    const nameShort = name.replace('claude-', '').replace(/-\d{8}$/, '');
    console.log('    ' + pad(nameShort, 22) + c.dim + pad(m.calls.toLocaleString() + ' calls', 14) + c.reset + pad(fmtUSD(m.cost), 10) + ' ' + bar(share, 20));
  }
  console.log('');

  // Weekly cap forecast
  console.log('  ' + c.bold + 'Weekly cap forecast' + c.reset + c.muted + '   (at $' + costPerDay.toFixed(1) + '/day)' + c.reset);
  console.log('  ' + hr);
  for (const [plan, cap] of Object.entries(CAPS)) {
    const ratio = costPerWeek / cap;
    let status, color;
    if (ratio >= 1) { status = `OVER by ${((ratio-1)*100).toFixed(0)}%`; color = c.red; }
    else if (ratio >= 0.8) { status = `${(ratio*100).toFixed(0)}% used — tight`; color = c.yellow; }
    else { status = `${(ratio*100).toFixed(0)}% — comfortable`; color = c.green; }
    console.log('    ' + plan.padEnd(12) + c.dim + 'cap ' + fmtUSD(cap).padEnd(8) + c.reset + color + status.padEnd(22) + c.reset + ' ' + bar(Math.min(1, ratio), 16, color));
  }
  console.log('');
  console.log('  ' + c.muted + '  ⚠ Caps are approximate. Anthropic tweaks them and doesn\'t publish exact numbers.' + c.reset);
  console.log('');

  // Recommendations
  const opusEntry = Object.entries(byModel).find(([k]) => k.toLowerCase().includes('opus'));
  if (opusEntry) {
    const [name, op] = opusEntry;
    const opShare = op.cost / totalCost;
    if (opShare > 0.5) {
      console.log('  ' + c.orange + c.bold + '💡 ' + c.reset + c.bold + `${Math.round(opShare*100)}% of your cost is on ${name}.` + c.reset);
      console.log('  ' + c.muted + `   Switching half those calls to Sonnet would save ~${fmtUSD(op.cost * 0.4)}/week.` + c.reset);
      console.log('');
    }
  }

  // Footer
  console.log('  ' + hr);
  console.log('  ' + c.muted + '  Scanned ' + files.length + ' session files · nothing was uploaded · ' + records.length.toLocaleString() + ' records' + c.reset);
  console.log('  ' + c.muted + '  Visual dashboard → ' + c.reset + c.orange + 'https://genie-j.github.io/burncheck/' + c.reset);
  console.log('');
}

function help() {
  console.log('');
  console.log('  ' + c.orange + c.bold + '🔥 burncheck' + c.reset + c.muted + '   privacy-first Claude Code burn-rate analyzer' + c.reset);
  console.log('');
  console.log('  ' + c.bold + 'Usage:' + c.reset);
  console.log('    ' + c.orange + 'npx burncheck' + c.reset + '           run analysis on ~/.claude/projects/');
  console.log('    ' + c.orange + 'burncheck --help' + c.reset + '         show this help');
  console.log('    ' + c.orange + 'burncheck --version' + c.reset + '      print version');
  console.log('');
  console.log('  ' + c.bold + 'Env:' + c.reset);
  console.log('    CLAUDE_PROJECTS_DIR    override the scan path (default ~/.claude/projects/)');
  console.log('');
  console.log('  ' + c.muted + 'Nothing is uploaded. All analysis runs locally.' + c.reset);
  console.log('  ' + c.muted + 'Repo → ' + c.reset + 'https://github.com/Genie-J/burncheck');
  console.log('');
}

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) { help(); process.exit(0); }
if (args.includes('--version') || args.includes('-v')) {
  console.log('0.7.2');
  process.exit(0);
}

analyze();
