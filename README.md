# Web Cache Purge Risk Briefs

Static browser-local MVP for turning public-safe CDN/cache purge notes or scrubbed snippets into a reviewer-ready risk brief, missing-context checklist, validation path, owner handoff, and token/customer URL privacy flags.

## Public pages

- Landing: `https://ert93333-ops.github.io/web-cache-purge-risk-briefs/`
- Checklist: `https://ert93333-ops.github.io/web-cache-purge-risk-briefs/cache-purge-checklist.html`
- Public marketing checklist: `https://gist.github.com/ert93333-ops/00ba8ca55e41dea84086cd3159b734d0`

## Scope

- No CDN connection, purge execution, invalidate/delete/ban execution, cache warming, cache rule changes, origin requests, CDN credentials, API tokens, cookies, sessions, signed URLs, customer URLs, origin hostnames, raw logs, backend, or external database.
- Shared marketing and notification credentials stay in the private root `.env` of the Hermes playbook, not in this public site directory.

## Verification

From the Hermes playbook root:

```powershell
npm run workflow:web-cache-purge-risk
```
