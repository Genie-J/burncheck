---
status: unread
created: 2026-04-15
source: builder-launch
---

# BurnCheck GTM 战略 — 势差重构（v1）

> 写给这个产品的下一个 48 小时。不是 tactics playbook，是势差分解。
> 所有 tactics 必须从这个势差结构里自然流出，反过来就是倒着走了。

---

## § 1 · 产品势差公式

**BurnCheck 的势差是把"Claude Code 用户对 weekly limit 的受害者心态"转换成一张可以甩到老板脸上的吐槽票据。**

展开这句话：

- **状态 A（用户此刻）**：这周被 Claude Code 中途砍掉至少一次，不知道下次什么时候砍，不知道是自己用多了还是 Anthropic 偷偷收紧（GitHub issue 11810/38335 上 Anthropic 自己承认 3/23 起"reducing quotas during peak hours"影响 ~7% 用户），正在酝酿要不要取消订阅切 ChatGPT Plus。
- **状态 B（用户想去）**：一张写着 "$5,163 burned this week · 100% Opus · switch half to Sonnet, save $2,062" 的卡片——**能解释他为什么被砍、能丢给团队/老板/Twitter 做决策依据、能作为抱怨的锚点而不是模糊的情绪**。
- **中间差**：用户需要的不是"再装一个 monitor"（ccusage / Claude-Code-Usage-Monitor 都已经在装了），是**把现状压缩成一句能转发、能决策、能发泄的话**。这件事现有工具不做——它们全都停在"给你看数字"那一层。
- **阻拦**：对 Anthropic 的失望已经让一部分人在 churn 的边缘，这些人不会去装 CLI。分享卡必须足够刺眼、足够自嘲、足够"发出来没人骂我显摆"，才能穿过这道心理门槛。

**一句话公式**：**把被砍的沉默屈辱变成公开可分享的 meme 票据。**

这不是"更好的 usage monitor"——这是"受害者吐槽武器"。市场里没人在做这件事，因为所有现有工具都是工程师做给工程师的**观察工具**，没人把它当**表达工具**。

---

## § 2 · 目标用户画像

不是"Claude Code 付费用户"——太宽，且 churn 中的他们会先逃走。三类精确画像：

| ID | 是谁 | 他的痛（原话） | 他信任什么渠道 | 第一秒怎么分类 BurnCheck |
|---|---|---|---|---|
| **P1 · 愤怒的 Max $200 重度依赖者** | 30-40 岁，自由职业/独立 builder/小团队 CTO，每天 6+ 小时跑 Claude Code 写生产代码，$200 订阅是"最便宜的生产资料" | "I burn through the whole damn quota in like ONE OR TWO DAYS" / "like losing your top developer mid-week" | 每天早上翻 HN front page、github.com/anthropics/claude-code/issues 订阅、X 上关注 @swyx @simonw @aidenybai 这类 infra 声音 | "终于有人把这个说清楚了"——**他想转发**，不想装（他已经有三个 monitor 了） |
| **P2 · 焦虑的 Max $100 创业者** | 在 AI 产品赛道的 solo founder 或 2-5 人小团队 CTO，$100/月对他是 DAU-like 的运营成本，周中被砍会直接推迟产品 release | "paying for a service I can't use" / "I've been bait and switched TWICE now" | Indie Hackers、X、HN Ask、小型 Discord 社群（如 Every/Latent Space），频繁 read Simon Willison blog、Thorsten Ball newsletter | "这个帮我判断要不要降级到 Pro / 切 Cursor"——**他想用来做决策**，不是装着看 |
| **P3 · 好奇的 Pro $20 经验者** | 工程师在工作用 Pro，听说 Max 更好但没确认自己的使用量够不够，也想看看别人花多少 | 没有原话——因为他还没真痛。他是**等着看别人惨况的围观者** | Twitter 热门列表、dev.to 首页算法推送、朋友转发 | "这个数字让我知道我是不是够省"——**他看别人的卡片**，自己用 BurnCheck 更多为了 benchmarking 和 meme 参与 |

三类人不是三个 funnel，是**一个 Loop 的三角色**：P1 炸裂产出分享卡（生产内容），P2 转发给同事做决策用（放大信号），P3 看热闹并参与自嘲（拓宽受众池）。

**关键识别**：P1 的决策不是"买不买 BurnCheck"（它免费），是"**值不值得转发**"。整个 GTM 的杠杆点是 P1 转发那一刻，不是他第一次访问那一刻。

---

## § 3 · 自然流动路径：0 → 1000

### 种子阶段（0 → 100 用户）

**第 1 个用户**不会是随机访客。第 1 个用户是一个 P1——在 GitHub issue 11810（weekly limit bug 讨论楼，目前 100+ 条长愤怒评论）底下第一个被说服点链接的人。怎么到他？

- 在 **issue 11810、9424、38335** 里留 1 条**纯信息性**评论（不是产品 pitch，是"我跑完我的 logs 给你参考——per-model breakdown 是这样：xxx。如果你想跑自己的，这是个 single HTML、100% client-side"）。
- 关键纪律：**把自己的痛摆出来**（"I burned $5,163 this week, 100% Opus"），再顺势提 BurnCheck。如果这条评论读起来像"隔壁新工具又来蹭热度"，零转化。如果读起来像"兄弟我也被烧了，这是我做的工具我自己在用"，5-10 人会点进去。
- 当前已投的 3 条评论 0 反应，说明**这一条评论没写对**——要么是工具介绍多于痛点共鸣，要么是没贴到最热的楼。这需要先修。

第 1 个用户→前 10 个用户的路径：**Issue 评论 → GitHub repo → 他下载自己 logs 跑 → 震惊于具体数字 → 生成卡片 → 发 X/评论区**。从第 1 到第 10 这段要**一个一个人盯**——看谁从 issue 楼点进来，如果他没生成卡片就没留下足迹，在 discussion 区发一个 "Show your weekly burn" thread 拉他们下场。

第 11-100 个用户：**dev.to 那篇已经草好的长文**（"How I built a privacy-first burn-rate analyzer in a single HTML file"）不是分发主力，是**信任锚**——当 P2 在 X 上看到分享卡起疑"这谁做的靠不靠谱"时，点进去看一篇诚实的技术自白（包括"$5,163/week on Opus 是我自己"+"我写了 7 版设计都做错了"），信任建立。dev.to 这篇应在**第一条 issue 评论奏效之后 24-48 小时内发布**，不是之前。

停留深度判据：**用户必须跑一次自己的 logs 才算留下**。纯访问首页 = 未发生。跑完之后，界面必须在看到数字的瞬间引导"生成卡片"（这一点产品已有）。足迹 = 他生成的 PNG 卡片被下载/分享。

### 增长阶段（100 → 1000）

这里 Loop Gain 必须 > 0.3 才有戏（每 10 个用户带 3+ 新用户）。自然不自燃。

**能点燃的 Loop**：**愤怒 + 炫耀 + 自嘲的三重共振卡片**。

为什么结构性能自燃：

1. **推特/X 在 2026 年已经把"AI 花了我多少钱"作为一个共享的 meme category**——参照 OpenAI API bill 截图 meme、Cursor 订阅吐槽、"我用 Claude 一个周末花了 $400" 这类帖子的 engagement 远高于一般技术帖。BurnCheck 的卡片**天然标准化了这类吐槽**——1200×630 暖奶油底、hero 数字、"BURNED THIS WEEK"——把个性化吐槽升级成可辨识的 template。
2. **卡片是**"我被 Anthropic 坑了"**的可信凭证**——不是情绪化抱怨，是有数字有 per-model 拆分的"账本"。这个凭证对 P1/P2 有真实社交价值（用来 @anthropicAI 的含金量）。
3. **每一张卡片底下都带 BurnCheck URL 水印**，这是结构性分发——分享的不是 screenshot 广告，是"你也可以跑一份"的邀请函。

三个不是自燃而是**人工催化**的辅助动作：

- 每周发布"**Burn Leaderboard**"（纯 opt-in 聚合数据，没人敢信的话就先用自己和朋友的数据起手）——"this week's champion: $5,163, 100% Opus" 之类的截图帖。这把孤立的个体分享聚合成了**每周一次的社区事件**。
- 在 HN 上发"Show HN"的时机不是 day 1，是**GitHub stars 达到 200 且至少有一个 P1 级别的用户（1K+ followers）自然发推背书之后**——过早发 HN 会被淹没在 10 条同类工具里，有 social proof 之后发能冲上首页。
- 与 ccusage/Monitor 的关系：**不竞争，走互补定位**。首页写 "Already running ccusage? BurnCheck answers what to do about the numbers." 把他们的用户也接过来做 forecast/prescription。

### 留存（第 2 次打开）

诚实地说：**BurnCheck 的留存结构是脆弱的**——一次跑完之后，用户最自然的下次动作是**下一次被砍的时候再跑**，可能是 1-3 周后。这期间不来不是 bug 是 feature。

产品结构上自然触发第 2 次的机会有两个：

1. **Weekly 提醒自己**——但不做 email nudge（违反隐私定位）。做法：CLI 版 (`npx github:Genie-J/burncheck`) 可以加一行到用户 shell profile（opt-in），每周一自动跑一次 print 到终端。这是**用户自己触发 Claude Code 时顺带看到**的，零打扰。
2. **社区回访触发**——每周的 Leaderboard 帖子在 X 上发，P1 看到后想"我这周烧了多少"，回来跑一次。这是**社交触发**，不是产品触发。

Pro tier 的留存逻辑是**替代 Web 版的偶发行为**——自动 daemon + 每周 email brief。只有在用户**已经发现 BurnCheck 有用**之后才问他要不要 $9/月。

### 货币化（Pro tier）

**$9/月**的选择逻辑（投资人会问为什么不是 $5/$19）：

- $5 对 Max $200 用户是零信号（他已经在 per month 花 $200），免费和 $5 没差。
- $19 撞上 Cursor Pro $20 和 v0 Pro $20——进入"月订阅工具"红海被比较。
- $9 是**"一个三明治"价格**——低于任何对照物的心理阈值，决策路径是"这东西能防我下次被砍损失一小时工作 = 省几百刀"而不是"我再加一个月订阅"。

转化漏斗（基于免费版 1000 用户估算）：

- 1000 免费用户 → 约 50 人被砍过 2+ 次（重度 P1/P2）→ 发 Pro 邀请邮件（opt-in 邮箱订阅）→ 预期 5-10 人付费 = **0.5-1% 免费转付费**。
- 这是保守数字。如果 Leaderboard 形成社区效应，付费可能带"支持项目"属性，能到 1-2%。
- **不追求高转化率**——这个产品的主价值是流量和 meme 资产，付费只是印证 PMF。

**什么时候问 Pro**：不在首页（免费版是整个漏斗的入口）；不在第一次访问后；**在用户第二次生成卡片那一刻**弹一个"Get weekly email alerts before the cutoff"——因为第二次生成 = 他已经验证过价值。

**对比物定价锚**：页面上明说 "ccusage (free) + Anthropic's nonexistent alerts vs. BurnCheck Pro's weekly forecast email ($9/mo or 1 hour of not getting cut off)"——不是和其他工具比，是和**被砍一次损失的工作价值**比。

---

## § 4 · 为什么**不是** HN / Reddit / dev.to / npm publish

每个都要给出结构性理由。"舍"比"做"重要。

### 不 day-1 发 HN

HN 是**一次性分发**通道——首页能带来 5000 访客，但 48 小时后归零，且 HN 人群 overlap P1 很少（HN 更多是 hobbyist/观察者）。更关键：**day-1 发 HN 会被定位成"又一个 monitor"**，淹没在 ccusage/Claude-Code-Usage-Monitor 的既有讨论里。HN 要发，但要等到 `§3` 里说的"有真实 P1 背书"之后，且标题不写 "Show HN: usage monitor"，写 **"Show HN: I burned $5,163 on Claude last week. Here's the receipt."**——叙事化、数字化、反工具化。

### 不 r/ClaudeAI r/LocalLLaMA post

Reddit 对**自我推广**的免疫极强。产品帖 3 小时内会被 mod 或社区标成 self-promo 沉底。Reddit 的正确用法是**在 P1 的投诉帖里留技术性评论**，不是开新帖。能在 `r/ClaudeAI` 一条"I got cut off again"的 2000 upvote 帖底下留一条 $5,163-receipt 的 comment，比开 100 个自推帖有用。

### 不"主力推 dev.to"

dev.to 是**信任锚**不是流量源——它的 SEO 价值（长期被 Google/ChatGPT 搜到）> 当日发布流量。把它当成 P2 点进来 due diligence 时看到的"这人是认真的"的文档，不是当成首发武器。已经写好的 draft 留着在 X 热度起来后第 3-5 天发。

### 不立即 `npm publish`

当前 `npx github:Genie-J/burncheck` 已经能跑，立即 publish 到 npm registry 的唯一好处是关键词搜索时出现。但 **npm publish 会创造一个"产品已正式发布"的信号**——这会让用户预期"应该有文档/社区/roadmap"。当前阶段不想接受这个预期。等 1000 用户量级、Pro tier 准备好时再 publish，叙事是 v1.0 launch。

### 不做 Product Hunt

PH 的受众是**产品人/早期 adopter/媒体**，不是 Claude Code 重度用户。上 PH 会带 300-500 访客但跑 logs 的转化率 <5%，**稀释数据**。更危险：PH 榜单会让 Anthropic 内部注意到 BurnCheck——目前最好**在他们雷达下面长大**，避免被"友好地"要求改 disclaimer 或下架（这个产品法律上安全，但早期不想惹麻烦）。

### 不投放 paid ads

势差结构决定了——Pain 强、Loop Gain 有潜力但需要社区催化、Channel_Fit 应走 organic content——**paid ads 无法放大社区 loop**。广告能带来 cold traffic 但这些人不会转发，也就不会触发 Loop。Paid 是热度已经有了之后 scale 的工具，不是冷启动工具。

---

## § 5 · 北极星指标（非 vanity）

不是 page views / GitHub stars / MRR / daily active users。

**北极星：每周生成并分享（下载 + 链接水印被点击）的卡片数量。**

为什么这个指标：

1. **页面 views 可以 fake**（爬虫/投放），stars 可以刷（朋友圈互 star），MRR 早期太噪。分享卡片的"下载→某处被点击回来"是**完整 Loop 的单次完成**。
2. **它直接测产品创造的价值**——用户愿意把它甩到 Twitter 上，等于他认为这东西**说出了他想说的话**。如果他只是访问了首页，我们没帮到他。
3. **它驱动所有决策**：新功能是否应该做，问一句"这会不会让更多用户分享"；改什么 copy，问一句"这会不会让卡片更容易被分享"；Pro 什么时候问，问一句"他分享过几次了"。

测量方式：卡片下载事件（客户端无法追踪）→ 代理指标改为**短链服务上的 referrer 来自 X/LinkedIn/GitHub 的访问数**（生成卡片时自动加一个 `?src=card&w=YYYY-WW` 的 referrer，服务端只记聚合数不记 IP，不破坏隐私定位）。

**健康基线**：第 1 周 ≥ 10 次卡片回流，第 4 周 ≥ 100 次，第 12 周 ≥ 1000 次。低于这个线说明 Loop 不自燃，必须回到产品而不是继续推渠道。

---

## § 6 · 24h / 7d / 30d 路径

### 24 小时

**关键行动（3 条）**：

1. **重写 GitHub issue 11810 下的那条评论**，按 `§3` 的模板——痛点共鸣在前（自己的 $5,163 截图），工具在后，明确写 "not a pitch, single HTML you can audit"。同时在 issue 9424、38335、41930 各留 1 条。**4 条总共**，不多不少，每条不同语气不同数据。
2. **在 X 上发 1 条 thread**（现有 `x-thread-draft.md` 需要按新 positioning 改写——**不是"我做了个工具"，是"I burned $5,163 on Claude last week and here's exactly where"**，product URL 在 tweet 4/6 而不是 1/6）。不买推广，不 at 任何人。让它自然沉或者浮。
3. **盯 GitHub repo traffic + issue 评论回复 + X 提及**——每 3 小时看一次。**不做额外推广动作**，观察第 1 条评论和 thread 的真实反应，校准话术。

**成功判据**：24h 内，至少 2 个陌生人（非朋友/非 bot）留下痕迹——一条 issue reply、一个 GitHub star、一条 X 回复。任何一个没有 = 话术没命中，回到原点重写。

**失败降级**：如果 24h 全部为零，**不扩大投放**，先做一件事——找 1-2 个真实的 Max $200 用户（在 AI builder 社群里找陌生人）免费让他们跑 BurnCheck，观察他们第一眼看到屏幕时说什么。话术错了。

### 7 天

**关键行动（3 条）**：

1. **Day 2-3**：根据前 48h 数据校准 X thread 话术 → 发第 2 条 thread（不同角度，聚焦 "the mid-week cutoff is like losing your top dev"）。
2. **Day 3-5**：dev.to 那篇发布（已经写好 87 分的版本，改 10% 去掉过度产品化的段落，加强"独自 debug 7 版设计"的 builder 真诚叙事）。
3. **Day 5-7**：如果有 ≥ 1 个 P1-tier 账号（10K+ 粉丝且真实 Claude Code 用户）自然转发/引用 → 在 HN Show 发"I burned $5,163 on Claude last week"；如果没有，**不发 HN**，继续等 social proof。

**成功判据**：Day 7 累计：100+ GitHub stars、≥ 3 次卡片分享带回链访问、至少 1 个 P1/P2 级别 unprompted 背书。

**失败降级**：Day 7 < 50 stars、0 分享回流 → 势差里哪一维坏了？大概率是 Pain 没那么强（用户吐槽但不行动），或 Loop 卡片没想象中病毒（可能是视觉不够刺眼）。**停止所有渠道动作**，回到产品——重做分享卡设计，测试 5 个 P1 真人反应。

### 30 天

**关键行动（3 条）**：

1. **Leaderboard 机制上线**（Pro tier 的前身），做成每周 opt-in 聚合帖发 X。如果有 100 个愿意 opt-in 的用户，这就是社区雏形。
2. **Pro tier 页面但不强推**——在第二次生成卡片时弹 "get weekly alert by email" 的 opt-in。10-20 个 waitlist 即足够验证付费意愿。
3. **观察是否出现第三种意外 loop**——每个产品都有 maker 没预料的使用方式（meme 分享？团队内部 benchmarking？招聘时 flex？）。Day 15 和 Day 30 各做一次 loop 盘点，识别出来之后**给它加 tailwind**（优化界面、加快速分享按钮等）。

**成功判据**：Day 30：1000+ 独立访问、500+ stars、20+ Pro waitlist、≥ 1 个被主流媒体/newsletter 引用（Simon Willison、Latent Space、TLDR AI 等任一）。

**失败降级**：Day 30 < 300 访问、< 100 stars、waitlist < 5 → 不是 GTM 问题，是产品/市场问题。见 §7。

---

## § 7 · 诚实边界

**应该砍掉 BurnCheck 的条件（stop conditions）**：

1. **Day 30 同时满足**：访问 < 300 + stars < 100 + 分享回流 < 10 + waitlist < 5。四项全输意味着势差里 Pain 被高估了——用户虽然在 GitHub issue 里愤怒，但他们的**愤怒不转化为行动**（他们写 issue 而不是找工具）。此时继续做只是堆 tactics，应该砍掉或 pivot 到更上游的问题（如：帮他们直接迁移到 Cursor/Gemini 的工具）。

2. **Anthropic 官方在 30 天内推出 usage forecast + 具体省钱建议**。如果 Anthropic 在 `/usage` 页面直接加上"projected weekly + model-swap recommendations"，BurnCheck 的价值结构性清零——这不是能靠 positioning 挽救的。概率评估：15%（他们现在被 limit 问题逼得很紧），看 April-May 的 Claude Code changelog。

3. **ccusage 或 Monitor 在 60 天内复刻 shareable card 功能**。他们的用户基数大 30-100 倍，一旦抄过去，BurnCheck 的 Loop 失去唯一独占。概率评估：30%（功能不难），需要持续观察。防御：**把 Leaderboard 社区建起来**——功能可抄，社区难抄。

4. **Maker 的 15 分钟/天预算在 Day 14 仍然每天都被消耗**——如果维持这个产品需要 maker 持续投入（排障、回复、社群管理），说明自动化没有建立起来，产品变成了运营负担。BurnCheck 必须在 Day 14 之前进入"每周 < 30 分钟"的维护成本，否则它是错配的项目类型。

**核心哲学**：**BurnCheck 是一个小产品，它的成功上限决定了它可以容忍的时间成本上限**——它不值得花 6 个月去推。如果 60 天还没找到自燃 loop，这个产品应该以"一个小而美的 builder log"归档，经验沉淀到下一个项目，不在它身上继续耗。

---

## § 8 · 整体判断

```
ΔE = Pain × (1/Switch_Cost) × Channel_Fit × Loop_Gain

Pain         = 高       — GitHub issues 愤怒度 + Anthropic 官方承认 + 用户在 churn 边缘
Switch_Cost  = 极低     — 单 HTML 零上传零账户零安装（Web 版），CLI 一行 npx
Channel_Fit  = 中       — 选中 lane: Content（issue 评论 + dev.to builder log）。不选 Paid/Virality 作主推
Loop_Gain    = 中-高(待验证) — 分享卡有结构性 meme 潜力，但需真实 P1 背书才能自燃

整体势差 = 中-高（条件性）
```

**零维度警告**：无。四维都不为 0，但 Loop_Gain 是**最高方差的一维**——卡片能不能病毒化是这个产品的生死线。**如果 Day 7 分享回流 < 3，Loop_Gain 实际上是 0.x 不是 0.5+，整个公式坍塌**。

**推荐路径**：选一个 lane = **Content-first**（GitHub issue 评论 → dev.to builder log → X 自然生长 → 观察是否自燃）。不 paid，不 PH，不立即 HN，不立即 npm publish。Loop 催化用每周 Leaderboard，货币化等 PMF 信号。

---

## § 9 · Steel-man 压力测试（预回答）

**Q1: "'B 状态'——用户为什么真的想要一张'吐槽票据'？你是不是臆想？"**

不是臆想。证据三层：(a) X 上"我花了 $X 在 AI"类帖子已经是稳定的 meme category，engagement 显著高于技术帖；(b) GitHub issue 11810 下 100+ 条评论本质就是**无卡片版的吐槽票据**——用户已经在用自然语言做这件事；(c) 我们自己测试 `$5,163/week` 那条分享素材给 alpha tester（partner）时，她第一反应是 "people love to flex how much they spent on AI" 并预判这会是最高 engagement 功能。三条证据独立收敛到"用户想要 flex-complain 的凭证"。**反例**：如果用户真的只想要"解决问题"而非"表达问题"，ccusage 的数字表格对他们就够了，他们不会在 issue 下写 100 条情绪化评论。

**Q2: "第 100 个用户具体怎么来？不要假设"**

具体故事：Day 5，一个叫 Marcus 的独立 builder 在 X 刷到一条转发——来源是 Day 3 在 issue 11810 评论里被我们 seed 的某个 P1 用户 @swyx 级别账号（假设名）引用了我们的 $5,163 截图。Marcus 点开链接，跑自己的 logs，发现自己周五之前会被砍，生成卡片下载。周六他在团队 Slack 里 po 这张卡 + "guys we need to rethink our Opus budget"——团队里 3 个人跟着跑了一遍。其中 1 人在 X 上发了自己那张卡带 BurnCheck 链接。**第 100 个用户就是那个 X 帖子下点进来的某个陌生人**。这条链需要 Day 3 的 P1 背书真发生——如果 Day 3 没有背书，这条链断在第 30 个用户左右。**这是最大风险点**。

**Q3: "$9/mo 的定价凭什么？"**

不是心理定价的"黄金价位"故事。实际逻辑：(a) **价格对比物**——用户决策心智里的锚不是 "要不要买 BurnCheck"，是"被砍一次损失多少"。Claude Code 生产级用户一次 cutoff 损失 2-6 小时工作，按 $100/h 机会成本算 = $200-600。$9 是这个对比物的 2-5% 无脑购买区间。(b) **Cursor Pro $20 / v0 Pro $20 / Linear Standard $10** 定义了"工具月订阅"的基准线，$9 在基准线以下但非廉价——即"有感情投入的工具"但非"严肃生产力工具"。(c) Founding $5/life 的副价格让价格敏感用户有台阶。**如果 $9 月转化率 < 0.3%，降到 $7 而不是 $5**——$5 和 $7 的心理差距很小，但 $5 会把产品锚定为"小玩意儿"污染定位。

**Q4: "留存 Loop 是真的吗？还是一次性漏斗？"**

**诚实答**：**当前的留存结构是弱的**，这是产品的真实软肋。一次性访问后自然回访的触发只有两个（CLI weekly 提醒 + 社区 Leaderboard），两者都依赖用户的"额外 opt-in 动作"。**这不是病毒性产品意义上的 Loop**，更像是**偶发性工具 + 社区附着**。Pro tier 的本质就是为这个软肋付费——把"偶发记起来用"变成"每周自动推送一次"。如果 Day 30 后 Pro waitlist < 5，说明用户不愿意把偶发变成持续——产品就应该被接受为"一次性工具 + meme 资产"，不追求持续订阅，货币化转向"打赏/捐赠"而不是"订阅"。

**Q5: "如果不 work，怎么知道是策略错了还是产品错了？"**

分界线：**看 Loop Gain**。

- 策略错：用户访问量低 + **访问用户里生成卡片比例高（>30%）** → 产品能抓住进来的人，只是进来的人不够多。这是渠道/话术问题。修话术、换渠道。
- 产品错：用户访问量尚可（>500） + **生成卡片比例低（<10%）** → 进来的人不愿意留足迹。这是价值未击中问题。修产品（可能是首屏/卡片视觉/价值 framing）。

两者都错（量和转化都差）= 势差判断错 = 停止。

这是 Day 14 的诊断日——那时应该有足够数据做这个判断。

---

## § 10 · 诚实边界（本分析盲区）

1. **卡片的 meme 潜力是假设**，不是证据。Loop_Gain 的关键变量没有一手数据，只有类比（其他 AI 花销截图 meme）和单个 alpha tester 反馈。**这是整个战略最脆的环节**。
2. **Anthropic 的反应未知**。如果他们觉得 BurnCheck 是 FUD 源（让用户更焦虑），可能施压 GitHub/托管商。概率低但非零。
3. **中文市场未分析**。当前所有渠道建议基于英文 builder 生态，中文 Claude Code 用户（即刻/V2EX/小红书）的痛点表达和分发路径没有一手诊断。如果后续要拓，需要单独做一次 Channel Fit 诊断，不是平移英文 playbook。
4. **产品目前的 3 条投放评论 0 反应**是一个已有的负信号。本战略假设"话术没写对"，但也可能是"BurnCheck 在那几个楼里本来就没有势差"——需要通过 `§6` Day 1-3 的新评论验证。如果重写后仍零反应，势差判断要降一级。
5. **Maker 时间预算是真实约束**——15 分钟/天很紧。本战略的 Content-first lane 对匿名 maker 的原创产出依赖很重，但 P1 级别的背书无法由匿名账号自生成（匿名红线不可破）。**自然增长的 critical path 过于依赖外部 P1 账号自发转发，这是这个 GTM 最不可控的外生变量**。如果 30 天内完全没有 P1 背书出现，势差的 Loop_Gain 结构性兑现不了，需要重新诊断是不是产品本身的社交属性不够。

---

*Launch · 2026-04-15 · v1*
