# OmniRoute — Safe Test Setup

Goal: try OmniRoute for extra daily usage **without touching your normal Claude setup**, so you can compare quality side by side and back out in one step.

> **Read first — what OmniRoute does and doesn't cover**
> - It only works with **Claude Code** (the terminal / "Code" tool). It does **not** change the regular Claude app chats where your video skills (Greg, Becky, TopView, Jason's copywriting…) run. Limits you hit in the Claude app are not helped by this.
> - When it switches models, you are no longer using Claude — you're using whatever free model it picked (GLM, Kimi, Gemini, Mistral, etc.).
> - Your prompts go to that provider. Some free tiers can train on what you send.

---

## 1. Install (on your own computer, not the cloud session)

Needs Node.js installed.

```bash
npm install -g omniroute
omniroute
```

Dashboard opens at `http://localhost:20128`.

## 2. Pick providers by hand — don't use "auto"

In the dashboard → **Providers**:

- ✅ Connect providers that have an **official** free tier and published terms (e.g. Google Gemini, Mistral, Groq).
- ❌ Skip anything OmniRoute's own catalog flags **"avoid"** in its terms-risk list.
- ❌ Skip "free Claude" re-sellers or anything that works by using someone else's account or web cookies — those can get accounts banned.

Then build one **combo** with `priority` strategy, best model first. That way you always know which model answered.

## 3. Make a separate test profile (keeps your normal Claude untouched)

```bash
omniroute setup-claude --dry-run     # preview first
omniroute setup-claude               # writes ~/.claude/profiles/<name>/settings.json
omniroute launch --profile <name>    # opens Claude Code on that model
```

Your regular `claude` command keeps running on real Claude. The test profile lives in its own folder.

## 4. Ground rules for the test

| Use OmniRoute for | Keep on real Claude |
|---|---|
| Quick questions, Amazon lookups, research | Anything with Shopify, customer or order data |
| Rough first drafts you'll rewrite | Final scripts for Greg / Becky / Nicole |
| Brainstorming hooks | Anything with skincare / health claims (FTC compliance) |

## 5. Run a fair quality test

Give the **same 3 tasks** to both, e.g.:

1. Rebuild one competitor script with the 6-beat structure
2. Write 10 hooks for the castor oil eyelash serum
3. Turn a short script into a shot list

Score each 1–10. If OmniRoute's are clearly worse, delete it (step 6).

## 6. Undo

```bash
npm uninstall -g omniroute
rm -rf ~/.claude/profiles
```

Nothing in your main Claude settings changes, so there's nothing else to revert.

---

## The bigger fix for daily limits (Claude app)

These cut usage on the plan you already pay for:

1. **Remove the unused plugins** (Sales, HR, Legal, Finance, Operations, Customer Support, Cowork Plugin Management, Productivity). They load 200+ extra skill descriptions into every session and ~60 broken connections.
2. **One task per chat.** Every new message re-reads the whole chat, so long chats burn usage fastest. Start a fresh chat for each script / video.
3. **Use a lighter model for small stuff.** Quick questions and lookups don't need the top model — switch in the model picker.
4. **Check before you generate.** Run Higgsfield's virality predictor before making extra versions of a clip.

Sources: [OmniRoute README](https://github.com/diegosouzapw/OmniRoute) · [OmniRoute Claude Code configuration guide](https://github.com/diegosouzapw/OmniRoute/blob/main/docs/guides/CLAUDE-CODE-CONFIGURATION.md)
