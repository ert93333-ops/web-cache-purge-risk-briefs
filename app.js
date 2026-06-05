const PRODUCT = "Web Cache Purge Risk Briefs";
const STORAGE_PREFIX = "webcachepurgeriskbriefs";
const ISSUE_URL = "https://github.com/ert93333-ops/web-cache-purge-risk-briefs/issues/new?template=demo_request.md&labels=early-access%2Cpurchase-intent%2Cdemo-request&title=Early%20access%20request%3A%20Web%20Cache%20Purge%20Risk%20Briefs";

const fields = {
  notes: document.querySelector("#purge-notes"),
  scope: document.querySelector("#scope-notes"),
  method: document.querySelector("#method-notes"),
  key: document.querySelector("#key-notes"),
  blast: document.querySelector("#blast-notes"),
  origin: document.querySelector("#origin-notes"),
  cause: document.querySelector("#cause-notes"),
  validation: document.querySelector("#validation-notes"),
  owner: document.querySelector("#owner-notes"),
  privacy: document.querySelector("#privacy-notes"),
};

const output = document.querySelector("#brief-output");
const outputPanel = document.querySelector("#output-panel");
const outputStatus = document.querySelector("#output-status");
const workflowError = document.querySelector("#workflow-error");
const copyButton = document.querySelector("#copy-brief");
const copyStatus = document.querySelector("#copy-status");
const intentForm = document.querySelector("#intent-form");
const intentStatus = document.querySelector("#intent-status");
const remoteIntent = document.querySelector("#remote-intent");
const remoteIntentLink = document.querySelector("#remote-intent-link");
const remoteCopyButton = document.querySelector("#copy-remote-intent");
const remoteCopyStatus = document.querySelector("#remote-copy-status");

let lastBriefText = "";
let selectedPlan = "Starter";
let lastRemoteBody = "";

function track(event, detail = {}) {
  const payload = {
    event,
    detail,
    product: PRODUCT,
    page: window.location.pathname,
    utm: Object.fromEntries(new URLSearchParams(window.location.search)),
    at: new Date().toISOString(),
  };
  const key = `${STORAGE_PREFIX}_analytics_events`;
  const events = JSON.parse(localStorage.getItem(key) || "[]");
  events.push(payload);
  localStorage.setItem(key, JSON.stringify(events.slice(-200)));
}

function hasAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

function fieldText() {
  return Object.fromEntries(Object.entries(fields).map(([key, element]) => [key, element.value.trim()]));
}

function combinedText(values) {
  return Object.values(values).join("\n").toLowerCase();
}

function missingChecks(values) {
  const all = combinedText(values);
  const scopeText = `${values.notes} ${values.scope}`.toLowerCase();
  const methodText = `${values.notes} ${values.method}`.toLowerCase();
  const keyText = `${values.notes} ${values.key}`.toLowerCase();
  const blastText = `${values.notes} ${values.blast}`.toLowerCase();
  const originText = `${values.notes} ${values.origin}`.toLowerCase();
  const causeText = `${values.notes} ${values.cause}`.toLowerCase();
  const validationText = `${values.notes} ${values.validation}`.toLowerCase();
  const ownerText = `${values.notes} ${values.owner}`.toLowerCase();

  const checks = [
    {
      label: "missing CDN/platform, zone/service/property, environment, hostname, URL, prefix, tag, surrogate key, CP code, cache key, or path scope:",
      ok: hasAny(scopeText, [/\bcloudflare\b/, /\bfastly\b/, /\bakamai\b/, /\bvarnish\b/, /\bcdn\b/, /\bedge\b/, /\bzone\b/, /\bservice\b/, /\bproperty\b/, /\benvironment\b/, /\bproduction\b/, /\bstaging\b/, /\bhostname\b/, /\bhost\b/, /\burl\b/, /\bpath\b/, /\bprefix\b/, /\btag\b/, /\bsurrogate[- ]key\b/, /\bcp code\b/, /\bcache key\b/]),
    },
    {
      label: "missing purge method: invalidate/delete/soft purge/ban/purge by URL/tag/prefix/host/key/CP code/purge everything:",
      ok: hasAny(methodText, [/\binvalidat(e|ion)\b/, /\bdelete\b/, /\bsoft purge\b/, /\bsoft[- ]purge\b/, /\bban\b/, /\bpurge by url\b/, /\bby url\b/, /\bby tag\b/, /\bby prefix\b/, /\bby host\b/, /\bby key\b/, /\bby cp code\b/, /\bcp code\b/, /\bpurge everything\b/, /\bpurge all\b/, /\btargeted purge\b/, /\btag purge\b/, /\bsurrogate[- ]key\b/]),
    },
    {
      label: "missing cache key/query/header/cookie/device/locale/tenant/auth/vary behavior:",
      ok: hasAny(keyText, [/\bcache key\b/, /\bquery string\b/, /\bquery\b/, /\bheader\b/, /\bcookie\b/, /\bdevice\b/, /\bmobile\b/, /\bdesktop\b/, /\blocale\b/, /\blanguage\b/, /\btenant\b/, /\bauth\b/, /\bauthenticated\b/, /\blogged[- ]in\b/, /\bvary\b/, /\bvariation\b/, /\bcanonical key\b/]),
    },
    {
      label: "missing blast-radius context for HTML/assets/API/logged-in/cart/checkout/account/pricing/product/CMS/tenant pages:",
      ok: hasAny(blastText, [/\bblast\b/, /\bradius\b/, /\bhtml\b/, /\basset\b/, /\bcss\b/, /\bjs\b/, /\bapi\b/, /\blogged[- ]in\b/, /\bcart\b/, /\bcheckout\b/, /\baccount\b/, /\bpricing\b/, /\bproduct\b/, /\binventory\b/, /\bcms\b/, /\btenant\b/, /\bcustomer\b/, /\bpage type\b/]),
    },
    {
      label: "missing origin load/origin shield/stale-while-revalidate/stale-if-error/TTL/revalidation/reheat/warm-up/rate-limit risk:",
      ok: hasAny(originText, [/\borigin load\b/, /\borigin\b/, /\borigin shield\b/, /\bstale[- ]while[- ]revalidate\b/, /\bswr\b/, /\bstale[- ]if[- ]error\b/, /\bsie\b/, /\bttl\b/, /\brevalidat(e|ion)\b/, /\breheat\b/, /\bwarm[- ]?up\b/, /\brate[- ]?limit\b/, /\b429\b/, /\bshield\b/, /\bmiss storm\b/]),
    },
    {
      label: "missing cause and urgency: deploy/CMS publish/pricing/product inventory/security incident/wrong content/image/CSS/JS/legal takedown:",
      ok: hasAny(causeText, [/\bcause\b/, /\burgent\b/, /\burgency\b/, /\bdeploy\b/, /\brelease\b/, /\bcms\b/, /\bpublish\b/, /\bpricing\b/, /\bproduct\b/, /\binventory\b/, /\bsecurity\b/, /\bincident\b/, /\bwrong content\b/, /\bstale\b/, /\bimage\b/, /\bcss\b/, /\bjs\b/, /\bjavascript\b/, /\blegal\b/, /\btakedown\b/, /\bhotfix\b/]),
    },
    {
      label: "missing validation: URL samples/cache-status/header checks/HIT/MISS/Age/x-cache/cf-cache-status/edge location/before-after/monitoring:",
      ok: hasAny(validationText, [/\bvalidat(e|ion)\b/, /\burl sample\b/, /\bsample url\b/, /\bcache[- ]status\b/, /\bheader\b/, /\bhit\b/, /\bmiss\b/, /\bage\b/, /\bx-cache\b/, /\bcf-cache-status\b/, /\bedge location\b/, /\bcolo\b/, /\bbefore\b/, /\bafter\b/, /\bscreenshot\b/, /\bmonitor\b/, /\bmonitoring\b/, /\bcurl\b/, /\bsynthetic\b/]),
    },
    {
      label: "missing owner/reviewer/approver/escalation/comms owner/next update:",
      ok: hasAny(ownerText, [/\bowner\b/, /\breviewer\b/, /\bapprover\b/, /\bapproval\b/, /\bescalat(e|ion)\b/, /\bcomms owner\b/, /\bcommunications owner\b/, /\bon[- ]call\b/, /\bnext update\b/, /\bby \d{1,2}:\d{2}\b/, /\butc\b/, /\blead\b/, /\bsre\b/, /\bplatform\b/]),
    },
  ];

  const unsafeWording = hasAny(all, [/\bpurge everything\b/, /\bpurge all\b/, /\bclear everything\b/, /\bclear cache\b/, /\bdelete all\b/, /\bdelete cache\b/, /\bno[- ]origin[- ]risk\b/, /\bno origin risk\b/, /\bno[- ]customer[- ]impact\b/, /\bno customer impact\b/, /\bignore query strings?\b/, /\bforce refresh\b/, /\bjust purge\b/, /\bblast all\b/]);
  const privateRiskText = all.replace(/\b(?:no|without)\s+(?:(?:api|bearer)\s+)?(?:tokens?|cookies?|sessions?|signed urls?|customer urls?|origin hostnames?|internal urls?|raw logs?|credentials?|pii|production data)(?:\s*,\s*(?:(?:api|bearer)\s+)?(?:tokens?|cookies?|sessions?|signed urls?|customer urls?|origin hostnames?|internal urls?|raw logs?|credentials?|pii|production data))*[^.;\n]*/g, "");
  const privateRisk = hasAny(privateRiskText, [/\bapi token\b/, /\bbearer\b/, /\btoken\b/, /\bcookie\b/, /\bsession\b/, /\bsigned url\b/, /\bcustomer url\b/, /\borigin hostname\b/, /\binternal url\b/, /\braw log\b/, /\bcredential\b/, /\bsecret\b/, /\bpassword\b/, /\bpii\b/, /\bproduction data\b/, /\bcustomer data\b/, /\baccess key\b/, /\bauthorization:\b/]);

  const warnings = checks.filter((check) => !check.ok).map((check) => check.label);
  if (unsafeWording) warnings.push("unsafe purge everything/delete all/clear cache/no-origin-risk/no-customer-impact/ignore query strings/force refresh wording:");
  if (privateRisk) warnings.push("private API token/bearer token/cookie/session/signed URL/customer URL/origin hostname/internal URL/raw log/credential/PII/production-data risk:");
  return warnings;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function line(label, value, fallback) {
  return `<li><strong>${label}:</strong> ${escapeHtml(value || fallback)}</li>`;
}

function buildBrief(values) {
  const warnings = missingChecks(values);
  const outline = [
    "Name CDN/platform, zone/service/property, environment, hostname/path/prefix/tag, and exact purge method.",
    "Confirm cache-key variation: query strings, headers, cookies, device, locale, tenant, auth, and Vary behavior.",
    "State blast radius across HTML, assets, API, logged-in, cart, checkout, account, pricing, product, CMS, and tenant pages.",
    "Document origin-load risk, TTL/stale behavior, warm-up needs, rate-limit risk, and validation headers before approval.",
    "Set owner, reviewer, approver, comms owner, escalation path, next update, and privacy guardrails.",
  ];

  output.innerHTML = `
    <h3>Web cache purge risk brief ready</h3>
    <h4>Purge scope summary</h4>
    <ul>
      ${line("Scope", values.scope, "Needs CDN/platform, zone/service/property, environment, hostname, URL, prefix, tag, surrogate key, CP code, cache key, or path scope.")}
      ${line("Purge method", values.method, "Needs invalidate/delete/soft purge/ban/purge-by-URL/tag/prefix/host/key/CP-code decision.")}
      ${line("Cache-key variation", values.key, "Needs query string, header, cookie, device, locale, tenant, auth, and Vary behavior.")}
      ${line("Blast radius", values.blast, "Needs HTML/assets/API/logged-in/cart/checkout/account/pricing/product/CMS/tenant page impact.")}
      ${line("Origin and stale behavior", values.origin, "Needs origin load, shield, TTL, stale-while-revalidate, stale-if-error, warm-up, and rate-limit risk.")}
    </ul>
    <h4>Missing context and risk warnings</h4>
    ${warnings.length ? `<ul>${warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}</ul>` : "<p>No major missing context detected in the public-safe fields.</p>"}
    <h4>Validation and warm-up checklist</h4>
    <ol>${outline.map((item) => `<li>${item}</li>`).join("")}</ol>
    <h4>Cause and urgency</h4>
    <p>${escapeHtml(values.cause || "Add deploy/CMS publish/pricing/product inventory/security incident/wrong content/image/CSS/JS/legal takedown cause and urgency.")}</p>
    <h4>Validation and owner handoff</h4>
    <p>${escapeHtml(values.validation || "Add URL samples, cache-status/header checks, HIT/MISS/Age/x-cache/cf-cache-status checks, edge location, before/after evidence, and monitoring.")}</p>
    <p>${escapeHtml(values.owner || "Set a named SRE/platform owner, reviewer, approver, escalation path, comms owner, and next-update time.")}</p>
  `;

  lastBriefText = output.innerText;
  outputPanel.classList.add("has-brief");
  outputPanel.classList.toggle("status-warning", warnings.length > 0);
  outputPanel.classList.toggle("status-good", warnings.length === 0);
  outputStatus.textContent = warnings.length ? `${warnings.length} issue(s) to review` : "Brief ready";
  copyButton.disabled = false;
  track("brief_generated", { warningCount: warnings.length });
  track("core_action_completed", { warningCount: warnings.length });
}

function generateBrief() {
  workflowError.textContent = "";
  const values = fieldText();
  if (!values.notes) {
    workflowError.textContent = "Paste public-safe cache purge notes first.";
    track("brief_generation_failed", { reason: "empty_purge_notes" });
    return;
  }
  track("core_action_started", { triggerSource: "generate_button" });
  buildBrief(values);
}

async function copyText(text, statusElement, success) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  statusElement.textContent = success;
}

function loadSample() {
  fields.notes.value = "Cloudflare production zone for www.example.com after a CMS pricing publish. Review targeted prefix and tag invalidation before approval.";
  fields.scope.value = "CDN Cloudflare; production zone; hostname www.example.com; path prefix /pricing/*; cache tag product-page; service web; environment production.";
  fields.method.value = "Targeted invalidate by prefix and cache tag. Avoid broad cache clearing unless approver documents a separate emergency.";
  fields.key.value = "Cache key varies by query string, device, locale, tenant, auth state, and Vary headers. Logged-in and anonymous paths must be checked separately.";
  fields.blast.value = "Blast radius includes HTML pricing pages, product pages, CMS content, assets, tenant page variants, cart, checkout, account, and API-adjacent pages.";
  fields.origin.value = "Origin shield is enabled; TTL is 30 minutes; stale-while-revalidate and stale-if-error behavior are in use; warm-up sample URLs; watch rate-limit and miss-storm risk.";
  fields.cause.value = "CMS pricing copy update and product page publish are urgent for launch copy consistency, not a security incident or legal takedown.";
  fields.validation.value = "Validate sample URLs with curl headers, CF-Cache-Status, Age, HIT/MISS, edge colo, before/after screenshots, and monitoring for origin load.";
  fields.owner.value = "SRE on-call owns purge review; web performance lead approves; support comms owner sends next update by 10:30 UTC.";
  fields.privacy.value = "Public-safe notes only; no API tokens, bearer tokens, cookies, sessions, signed URLs, customer URLs, origin hostnames, internal URLs, raw logs, credentials, PII, or production data.";
  track("sample_loaded", { sample: "cloudflare_pricing_publish" });
}

const pathName = window.location.pathname;
track("page_view");
if (pathName === "/" || pathName.endsWith("/") || pathName.endsWith("/index.html")) track("landing_viewed");
if (pathName.endsWith("cache-purge-checklist.html")) {
  track("template_opened");
  track("seo_page_viewed");
}

if (document.querySelector("#generate-button")) {
  document.querySelector("#generate-button").addEventListener("click", generateBrief);
  document.querySelector("#sample-button").addEventListener("click", loadSample);
  copyButton.addEventListener("click", () => {
    copyText(lastBriefText, copyStatus, "Copied cache purge risk brief.");
    track("copy_brief_clicked");
  });

  document.querySelectorAll(".plan-button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedPlan = button.dataset.plan;
      document.querySelector("#plan-interest").value = selectedPlan;
      track("plan_selected", { plan: selectedPlan });
      track("pricing_viewed", { plan: selectedPlan });
      intentForm.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  intentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    track("signup_started", { plan: selectedPlan });
    const intent = {
      email: document.querySelector("#intent-email").value.trim(),
      role: document.querySelector("#intent-role").value.trim(),
      volume: document.querySelector("#purge-volume").value.trim(),
      process: document.querySelector("#current-process").value.trim(),
      plan: document.querySelector("#plan-interest").value,
      willingness: document.querySelector("#willingness").value.trim(),
      at: new Date().toISOString(),
    };
    const key = `${STORAGE_PREFIX}_purchase_intents`;
    const intents = JSON.parse(localStorage.getItem(key) || "[]");
    intents.push(intent);
    localStorage.setItem(key, JSON.stringify(intents.slice(-50)));
    lastRemoteBody = [
      "Public early access request for Web Cache Purge Risk Briefs.",
      "",
      `Role/team: ${intent.role || "[not provided]"}`,
      `Cache purge review volume: ${intent.volume || "[not provided]"}`,
      `Current cache purge review process: ${intent.process || "[not provided]"}`,
      `Plan interest: ${intent.plan}`,
      `Willingness to pay: ${intent.willingness || "[not provided]"}`,
      "",
      "Do not include CDN tokens, API keys, cookies, sessions, signed URLs, customer URLs, origin hostnames, internal URLs, raw logs, credentials, PII, production data, or email addresses in this public issue.",
    ].join("\n");
    remoteIntentLink.href = `${ISSUE_URL}&body=${encodeURIComponent(lastRemoteBody)}`;
    remoteIntent.hidden = false;
    intentStatus.textContent = "You are on the early access list. Open or copy the public request if you want remote follow-up.";
    track("purchase_intent_submitted", { plan: intent.plan, hasEmail: Boolean(intent.email) });
    track("waitlist_submitted", { plan: intent.plan });
    track("signup_completed", { plan: intent.plan });
    track("remote_intent_ready", { includesEmail: false });
  });

  remoteCopyButton.addEventListener("click", () => {
    copyText(lastRemoteBody, remoteCopyStatus, "Copied request details.");
    track("remote_intent_copied");
  });

  document.querySelectorAll('a[href="#workflow"]').forEach((link) => {
    link.addEventListener("click", () => track("cta_clicked", { triggerSource: "workflow_anchor" }));
  });
}
