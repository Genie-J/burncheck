# BurnCheck X thread — V2 narrative

> V1 (tool-intro tone) deprecated. V2 opens with "I burned $X" first-person narrative. Tool mentioned only in tweets 5-6/7.
> Deploy timing: **NOT Day 1**. Wait until day-1-3 GitHub comments surface any P1 endorsement (any 1K+ follower account engaging naturally), then deploy within 24h.
> Account constraint: never use a personal public account for OPC content (anonymity red line). Either create an anonymous burncheck handle when trigger fires, or accept that this thread will not be posted.

## Main thread (7 tweets — narrative arc: shock → breakdown → absurdity → lesson → tool → invitation)

**1/7** 🔥

I just pulled my last 7 days of Claude Code logs.

$5,163 burned.

On a $200/mo Max subscription.

That's 15× the subscription value. Anthropic has been cutting me off mid-task all week and I finally understand why.

[attach warm card PNG]

---

**2/7**

The breakdown was the part that hurt:

• 1.6B tokens
• 11,254 API calls
• 100% on Opus
• 0% on Sonnet

I didn't even know I was defaulting to Opus for everything — refactors, boilerplate, stupid one-line edits. Every call at 5× Sonnet rates.

---

**3/7**

Here's the absurd part:

Community-reported Max $200 weekly cap ≈ $320 of token value.

I ran ~15× that before getting throttled.

Which means either: (a) Anthropic is eating a massive loss on heavy users, or (b) the weekly cap is a *soft* limit and Max subscribers are the cost center they keep quiet about.

Either way, the math is wild.

---

**4/7**

The honest diagnosis from my own data:

~$2,062/week of my Opus spend would've run just fine on Sonnet.

Not because Sonnet is as good — it isn't for hard reasoning — but because I was using Opus for tasks Sonnet could've handled (JSDoc updates, type annotations, find-and-replace refactors).

The subscription model hides this. You pay flat, so you stop optimizing.

---

**5/7**

So I spent a weekend writing the dumbest, smallest analyzer I could:

- Single HTML file (27 KB)
- Reads `~/.claude/projects/*.jsonl` locally via File API
- Nothing uploaded. No account. No tracking.
- Shows burn rate, per-model cost, weekly cap projection, model-swap savings

No backend. No `node_modules`. Just a page.

---

**6/7**

Open-sourced it: **https://genie-j.github.io/burncheck/**

Source: github.com/Genie-J/burncheck

If you're on Claude Max and feel like you're hitting the wall more than you should — takes 30 seconds to run your own. Generate a shareable card and drop it in your next "why am I paying $200/mo" rant.

---

**7/7**

The real goal of writing this: make it cheap enough to pull your own burn number that the next time this bug thread (github.com/anthropics/claude-code/issues/38335) gets a defensive "it's just edge cases" reply from Anthropic, there's a pile of hard numbers below it.

Yours + mine + the next hundred = a receipt they can't wave off.

---

## Alt opener (if X algorithm filters $ numbers — backup)

> "Ran my Claude Code weekly spend through an analyzer I wrote.
>
> $5,163 in 7 days. 100% Opus. Max $200 subscription.
>
> I'm not mad at Anthropic — I'm mad at past-me for not watching this."

More relatable, less victim-tone; possibly more replies.

## Image specs

- Tweet 1/7 must attach screenshot.png (v0.7.2 warm card at 1200×630)
- Tweet 4/7 optional: a model breakdown screenshot
- Tweet 6/7 optional: a weekly cap forecast "OVER by 1,513%" table screenshot

## Pre-deploy checklist

- [ ] A P1-tier account (1K+ followers, active in Claude/AI infra) has naturally mentioned BurnCheck
- [ ] BurnCheck GitHub stars ≥ 5 (social proof baseline)
- [ ] Footer share card feature verified end-to-end (warm card generates correctly)
- [ ] Anonymous account ready OR explicit decision to skip this thread

## Failure fallback

If Day 1-3 comments don't produce P1 endorsement → don't deploy X thread; keep as ready-to-go asset for the next Claude quota news cycle (typically 1-2 weeks after any Anthropic policy tweak).
