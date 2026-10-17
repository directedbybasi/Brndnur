# BRNDNUR — Antigravity Plugins and Existing GitHub Skills

## Current project state

The supplied archive's `skills-lock.json` records:
- `frontend-design` — `anthropics/skills`
- `web-design-guidelines` — `vercel-labs/agent-skills`

The workspace also contains skill folders named `agentic-seo`, `playwright`, `web-a11y-authoring`, `web-a11y-testing`, and `design-system`. Verify each relevant `SKILL.md` exists and can be read before taking any install action. A folder being present does not prove a runtime is properly activated, and `skills-lock.json` may not list every bundled skill.

## Minimal recommended setup

1. **Google Antigravity — Modern Web Guidance**: enable from `Settings → Customizations → Build with Google Plugins` if it is not already enabled.
2. **Use existing `agentic-seo` / `seo` skill** for the technical SEO/AEO audit. Its description already covers SEO, schema, Core Web Vitals, E-E-A-T, GEO and AEO; do not install another general SEO skill first.
3. **Use existing `web-design-guidelines`** only for a focused check of the four current pages.
4. **Use existing `frontend-design`** only if the owner explicitly approves visual redesign; most changes in this project should be technical and visually neutral.
5. **Use existing `playwright` skill or Antigravity browser** for navigation, responsive, screenshot, broken-image and console tests.
6. **Use `web-a11y-testing`** for keyboard and accessibility checks.
7. **Chrome DevTools MCP is optional**, not required. Add only if the built-in browser cannot provide necessary Lighthouse, network or performance inspection.

## Do not install

- Do not run `--all` or install an entire GitHub skill repository.
- Do not reinstall skills already present.
- Do not add Astro, React, Next.js, Firebase, database, CMS or slide-generation tools for this static HTML/CSS/vanilla JS task.
- Do not add a second SEO package unless a named missing capability is demonstrated.
- Do not load all `.agents` agents/skills into every prompt. Invoke only one or two relevant skills.

## If a skill is missing

From the project root, after checking there is no equivalent folder, install only the missing one:

```bash
npx skills add anthropics/skills --skill frontend-design -a antigravity
npx skills add vercel-labs/agent-skills --skill web-design-guidelines -a antigravity
```

Do not run these automatically when the skills already exist. The CLI supports selecting specific skills and targeting Antigravity. If Antigravity doesn't detect a skill file, restart/refresh the workspace and inspect the skill-install path before duplicating it.

## Separate tools/services correctly

- **Plugins / Build with Google:** integrations enabled in Antigravity settings.
- **Agent Skills:** local `SKILL.md` instructions, such as `agentic-seo`.
- **MCP server:** an optional bridge to a tool such as Chrome DevTools.
- **Search Console / Bing Webmaster Tools:** external owner-managed services; they need account/domain verification after deployment and are not editor plugins.

## Reference links

- Antigravity Rules: https://antigravity.google/docs/rules/
- Antigravity Skills: https://www.antigravity.google/docs/skills?tab=ide
- Build with Google: https://www.antigravity.google/docs/build-with-google/
- Antigravity MCP: https://antigravity.google/docs/mcp
- Skills CLI: https://github.com/vercel-labs/skills
- Existing frontend design skill: https://github.com/anthropics/skills/tree/main/skills/frontend-design
- Existing web guidelines skill: https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines
- Google AI features and websites: https://developers.google.com/search/docs/appearance/ai-features
